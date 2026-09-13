// src/services/api.js
// Complete Django REST Framework API Client for FazFood

import { MENU_ITEMS, CATEGORIES } from '../data';

// Django backend URL configured via environment variable or default to localhost:8000
const DJANGO_API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api';

/**
 * Helper to get authorization header if token is present
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem('fazfood_auth_token');
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  if (token) {
    // Django TokenAuthentication uses 'Token <key>', JWT uses 'Bearer <key>'
    // Supports both seamlessly
    headers['Authorization'] = token.startsWith('Bearer ') || token.startsWith('Token ')
      ? token
      : `Token ${token}`;
  }
  return headers;
};

/**
 * Universal safe request handler with timeout and error handling
 */
async function request(endpoint, options = {}, timeoutMs = 4000) {
  const url = `${DJANGO_API_BASE.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...(options.headers || {})
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorData = {};
      try {
        errorData = await response.json();
      } catch {
        errorData = { detail: response.statusText };
      }
      throw new Error(errorData.detail || errorData.message || `Django API error (${response.status})`);
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return { success: true };
    }

    return await response.json();
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

/**
 * HEALTH CHECK API - Check if Django server is currently running
 */
export const healthAPI = {
  checkHealth: async () => {
    try {
      // Pings Django health or menu endpoint
      const response = await fetch(`${DJANGO_API_BASE.replace(/\/$/, '')}/health/`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      });
      if (response.ok) {
        return { isOnline: true, url: DJANGO_API_BASE, message: 'Connected to Django Backend' };
      }
      return { isOnline: false, url: DJANGO_API_BASE, message: 'Django server responded with error' };
    } catch {
      // If health/ endpoint isn't implemented yet, check if root /menu/ responds
      try {
        const altResponse = await fetch(`${DJANGO_API_BASE.replace(/\/$/, '')}/menu/`, {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
        });
        if (altResponse.ok) {
          return { isOnline: true, url: DJANGO_API_BASE, message: 'Connected to Django Backend' };
        }
      } catch {
        // Django is offline
      }
      return { 
        isOnline: false, 
        url: DJANGO_API_BASE, 
        message: 'Django server offline (using local storage fallback)' 
      };
    }
  }
};

/**
 * AUTHENTICATION APIs
 * Maps to Django:
 * - POST /api/auth/login/
 * - POST /api/auth/register/
 * - POST /api/auth/logout/
 * - GET  /api/auth/me/
 */
export const authAPI = {
  login: async (email, password) => {
    try {
      const data = await request('/auth/login/', {
        method: 'POST',
        body: JSON.stringify({ email, password, username: email })
      });

      // Save token & user profile from Django
      if (data.token || data.access) {
        localStorage.setItem('fazfood_auth_token', data.token || data.access);
      }
      if (data.user) {
        localStorage.setItem('fazfood_user_profile', JSON.stringify(data.user));
      }
      localStorage.setItem('fazfood_admin_logged', 'true');
      return { success: true, user: data.user, token: data.token, mode: 'django' };
    } catch (err) {
      console.warn('[Django API] Login endpoint unavailable, falling back to local verification:', err.message);

      // Local fallback verification
      const users = JSON.parse(localStorage.getItem('fazfood_registered_users') || '[]');
      const matchedUser = users.find(u => u.email === email && u.password === password);

      if ((email === 'owner@fazfood.com' && password === 'admin123') || matchedUser) {
        localStorage.setItem('fazfood_admin_logged', 'true');
        return { 
          success: true, 
          user: matchedUser || { name: 'Shop Owner', email: 'owner@fazfood.com', role: 'admin' },
          mode: 'local'
        };
      }
      throw new Error('Invalid credentials. Check email and password, or start Django server.');
    }
  },

  register: async ({ name, email, password, phone }) => {
    try {
      const data = await request('/auth/register/', {
        method: 'POST',
        body: JSON.stringify({ name, username: email, email, password, phone })
      });
      return { success: true, data, mode: 'django' };
    } catch (err) {
      console.warn('[Django API] Register endpoint unavailable, falling back to local storage:', err.message);

      const existing = JSON.parse(localStorage.getItem('fazfood_registered_users') || '[]');
      if (existing.some(u => u.email === email)) {
        throw new Error('Email already registered for shop administration');
      }

      const newUser = { name, email, password, phone, created_at: new Date().toISOString() };
      existing.push(newUser);
      localStorage.setItem('fazfood_registered_users', JSON.stringify(existing));
      return { success: true, data: newUser, mode: 'local' };
    }
  },

  logout: async () => {
    try {
      await request('/auth/logout/', { method: 'POST' });
    } catch {
      // Ignore network errors on logout
    } finally {
      localStorage.removeItem('fazfood_auth_token');
      localStorage.removeItem('fazfood_admin_logged');
      localStorage.removeItem('fazfood_user_profile');
    }
    return { success: true };
  },

  getCurrentUser: async () => {
    try {
      return await request('/auth/me/', { method: 'GET' });
    } catch {
      const profile = localStorage.getItem('fazfood_user_profile');
      return profile ? JSON.parse(profile) : null;
    }
  }
};

/**
 * MENU & CATEGORIES APIs
 * Maps to Django:
 * - GET  /api/menu/?category=...&search=...&sort=...
 * - GET  /api/menu/:id/
 * - GET  /api/categories/
 * - POST /api/menu/ (Admin only)
 * - PUT  /api/menu/:id/ (Admin only)
 * - DELETE /api/menu/:id/ (Admin only)
 */
export const menuAPI = {
  getMenuItems: async (params = {}) => {
    try {
      const query = new URLSearchParams();
      if (params.category && params.category !== 'all') query.append('category', params.category);
      if (params.search) query.append('search', params.search);
      if (params.sort) query.append('sort', params.sort);

      const queryString = query.toString() ? `?${query.toString()}` : '';
      const data = await request(`/menu/${queryString}`, { method: 'GET' });
      return Array.isArray(data) ? data : (data.results || MENU_ITEMS);
    } catch (err) {
      console.info('[Django API] Menu endpoint unavailable, serving initial local menu items.');
      return MENU_ITEMS;
    }
  },

  getMenuItem: async (id) => {
    try {
      return await request(`/menu/${id}/`, { method: 'GET' });
    } catch {
      return MENU_ITEMS.find(item => item.id === id) || null;
    }
  },

  getCategories: async () => {
    try {
      const data = await request('/categories/', { method: 'GET' });
      return Array.isArray(data) ? data : (data.results || CATEGORIES);
    } catch {
      return CATEGORIES;
    }
  }
};

/**
 * ORDERS APIs
 * Maps to Django:
 * - POST   /api/orders/          (Create customer order)
 * - GET    /api/orders/          (List orders with filters)
 * - GET    /api/orders/:id/      (Order details)
 * - PATCH  /api/orders/:id/      (Update order status)
 * - DELETE /api/orders/:id/      (Delete order)
 * - GET    /api/admin/stats/     (Dashboard statistics)
 */
export const ordersAPI = {
  createOrder: async (orderPayload) => {
    // 1. Prepare format for Django REST Framework
    const djangoPayload = {
      order_id: orderPayload.id,
      customer_name: orderPayload.address.fullName,
      email: orderPayload.contact.email,
      phone: orderPayload.contact.phone,
      street_address: orderPayload.address.streetAddress,
      city: orderPayload.address.city,
      postal_code: orderPayload.address.postalCode,
      payment_method: orderPayload.paymentMethod,
      promo_code: orderPayload.promoCode || '',
      discount_amount: orderPayload.discountAmount || 0,
      final_total: orderPayload.finalTotal,
      status: orderPayload.status || 'Pending',
      items: orderPayload.items.map(item => ({
        menu_item_id: item.id,
        name: item.name,
        quantity: item.quantity,
        price_per_item: item.pricePerItem,
        customizations: item.customizations || []
      }))
    };

    let serverSavedOrder = null;

    try {
      serverSavedOrder = await request('/orders/', {
        method: 'POST',
        body: JSON.stringify(djangoPayload)
      });
      console.log('[Django API] Order synced successfully to Django server:', serverSavedOrder);
    } catch (err) {
      console.warn('[Django API] Could not sync order to Django (server offline or unreachable):', err.message);
    }

    // Always keep local storage updated as a resilient store
    try {
      const existing = JSON.parse(localStorage.getItem('fazfood_orders') || '[]');
      existing.unshift(orderPayload);
      localStorage.setItem('fazfood_orders', JSON.stringify(existing));
    } catch (err) {
      console.error('Error caching order locally:', err);
    }

    return serverSavedOrder || orderPayload;
  },

  getOrders: async (params = {}) => {
    try {
      const query = new URLSearchParams();
      if (params.status && params.status !== 'all') query.append('status', params.status);
      if (params.search) query.append('search', params.search);

      const queryString = query.toString() ? `?${query.toString()}` : '';
      const data = await request(`/orders/${queryString}`, { method: 'GET' });
      
      const ordersList = Array.isArray(data) ? data : (data.results || []);
      
      // Standardize format if coming from Django snake_case
      return ordersList.map(order => ({
        id: order.order_id || order.id,
        address: {
          fullName: order.customer_name || order.address?.fullName || 'Customer',
          streetAddress: order.street_address || order.address?.streetAddress || '',
          city: order.city || order.address?.city || '',
          postalCode: order.postal_code || order.address?.postalCode || ''
        },
        contact: {
          phone: order.phone || order.contact?.phone || '',
          email: order.email || order.contact?.email || ''
        },
        paymentMethod: order.payment_method || order.paymentMethod || 'credit_card',
        promoCode: order.promo_code || order.promoCode || '',
        discountAmount: Number(order.discount_amount || order.discountAmount || 0),
        finalTotal: Number(order.final_total || order.finalTotal || 0),
        status: order.status || 'Pending',
        created_at: order.created_at || new Date().toISOString(),
        items: (order.items || []).map(item => ({
          id: item.menu_item_id || item.id,
          name: item.name,
          quantity: item.quantity,
          pricePerItem: Number(item.price_per_item || item.pricePerItem || 0),
          customizations: item.customizations || []
        }))
      }));
    } catch (err) {
      console.info('[Django API] Orders endpoint offline, reading from local storage:', err.message);
      const local = localStorage.getItem('fazfood_orders');
      return local ? JSON.parse(local) : [];
    }
  },

  updateOrderStatus: async (orderId, newStatus) => {
    try {
      await request(`/orders/${orderId}/`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus })
      });
      console.log(`[Django API] Status updated to ${newStatus} for order ${orderId}`);
    } catch (err) {
      console.warn('[Django API] Updating status locally (Django API offline):', err.message);
    }

    // Always update local cache
    const existing = JSON.parse(localStorage.getItem('fazfood_orders') || '[]');
    const updated = existing.map(o => (o.id === orderId ? { ...o, status: newStatus } : o));
    localStorage.setItem('fazfood_orders', JSON.stringify(updated));
    return updated;
  },

  deleteOrder: async (orderId) => {
    try {
      await request(`/orders/${orderId}/`, { method: 'DELETE' });
      console.log(`[Django API] Order ${orderId} deleted from Django backend`);
    } catch (err) {
      console.warn('[Django API] Deleting order locally (Django API offline):', err.message);
    }

    const existing = JSON.parse(localStorage.getItem('fazfood_orders') || '[]');
    const updated = existing.filter(o => o.id !== orderId);
    localStorage.setItem('fazfood_orders', JSON.stringify(updated));
    return updated;
  },

  getStats: async () => {
    try {
      return await request('/admin/stats/', { method: 'GET' });
    } catch {
      // Derive stats locally
      const existing = JSON.parse(localStorage.getItem('fazfood_orders') || '[]');
      const totalSales = existing
        .filter(o => o.status !== 'Cancelled')
        .reduce((acc, curr) => acc + (Number(curr.finalTotal) || 0), 0);
      const activeOrders = existing
        .filter(o => ['Pending', 'Grilling', 'On Route'].includes(o.status))
        .length;
      const completedCount = existing
        .filter(o => o.status === 'Delivered')
        .length;

      return {
        total_sales: totalSales,
        active_orders: activeOrders,
        average_ticket: existing.length > 0 ? (totalSales / existing.length) : 0,
        completed_count: completedCount
      };
    }
  }
};

/**
 * PROMO CODES API
 * Maps to Django:
 * - POST /api/promos/validate/
 */
export const promoAPI = {
  validatePromo: async (code, subtotal) => {
    try {
      const data = await request('/promos/validate/', {
        method: 'POST',
        body: JSON.stringify({ code, subtotal })
      });
      return {
        isValid: true,
        code: data.code,
        discountPercent: data.discount_percent || 15,
        message: data.message || 'Coupon applied successfully!'
      };
    } catch (err) {
      // Local fallback
      const cleanCode = code.trim().toUpperCase();
      if (cleanCode === 'FAZDELIGHT') {
        return {
          isValid: true,
          code: 'FAZDELIGHT',
          discountPercent: 15,
          message: 'Coupon FAZDELIGHT applied: 15% discount!'
        };
      }
      throw new Error('Invalid coupon code! Use FAZDELIGHT for 15% off.');
    }
  }
};

/**
 * REVIEWS API
 * Maps to Django:
 * - POST /api/reviews/
 * - GET  /api/reviews/
 */
export const reviewsAPI = {
  submitReview: async (reviewPayload) => {
    try {
      const djangoReview = {
        order_number: reviewPayload.orderNumber,
        rating: reviewPayload.rating,
        comment: reviewPayload.comment,
        items: reviewPayload.items || []
      };
      await request('/reviews/', {
        method: 'POST',
        body: JSON.stringify(djangoReview)
      });
      console.log('[Django API] Review submitted to Django backend');
    } catch (err) {
      console.warn('[Django API] Saving review locally (Django offline):', err.message);
    }

    // Save locally
    try {
      const saved = JSON.parse(localStorage.getItem('fazfood_reviews') || '[]');
      saved.unshift(reviewPayload);
      localStorage.setItem('fazfood_reviews', JSON.stringify(saved));
    } catch (e) {
      console.error('Error saving review locally:', e);
    }
    return { success: true };
  },

  getReviews: async () => {
    try {
      return await request('/reviews/', { method: 'GET' });
    } catch {
      const local = localStorage.getItem('fazfood_reviews');
      return local ? JSON.parse(local) : [];
    }
  }
};

export default {
  health: healthAPI,
  auth: authAPI,
  menu: menuAPI,
  orders: ordersAPI,
  promo: promoAPI,
  reviews: reviewsAPI,
  BASE_URL: DJANGO_API_BASE
};

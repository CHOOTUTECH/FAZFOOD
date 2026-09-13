import React from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { MenuView } from './components/MenuView';
import { DetailsView } from './components/DetailsView';
import { CheckoutView } from './components/CheckoutView';
import { CartDrawer } from './components/CartDrawer';
import { OrderSuccessModal } from './components/OrderSuccessModal';

import { AdminView } from './components/AdminView';
import { menuAPI, ordersAPI } from './services/api';
import { MENU_ITEMS } from './data';

export default function App() {
  // Navigation states
  const [activeView, setActiveView] = React.useState('home');
  const [selectedCategory, setSelectedCategory] = React.useState('all');
  const [selectedProduct, setSelectedProduct] = React.useState(null);
  const [menuItems, setMenuItems] = React.useState(MENU_ITEMS);

  // Load menu dynamically from Django API (with graceful fallback to default items)
  React.useEffect(() => {
    async function loadDjangoMenu() {
      try {
        const items = await menuAPI.getMenuItems();
        if (items && items.length > 0) {
          setMenuItems(items);
        }
      } catch (err) {
        console.info('Using local menu items:', err);
      }
    }
    loadDjangoMenu();
  }, []);

  // Cart Drawer state
  const [isCartOpen, setIsCartOpen] = React.useState(false);

  // Local storage synchronized Cart state
  const [cart, setCart] = React.useState(() => {
    try {
      const saved = localStorage.getItem('fazfood_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Keep localStorage synced with Cart changes
  React.useEffect(() => {
    localStorage.setItem('fazfood_cart', JSON.stringify(cart));
  }, [cart]);

  // Order success states
  const [latestOrder, setLatestOrder] = React.useState(null);
  const [isSuccessOpen, setIsSuccessOpen] = React.useState(false);

  // Cart operations helpers
  const handleUpdateQuantity = (id, qty) => {
    if (qty <= 0) {
      setCart((prev) => prev.filter((item) => item.id !== id));
    } else {
      setCart((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity: qty } : item))
      );
    }
  };

  const handleRemoveItem = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleAddToCart = (cartItem) => {
    setCart((prev) => {
      const exists = prev.find((item) => item.id === cartItem.id);
      if (exists) {
        return prev.map((item) =>
          item.id === cartItem.id
            ? { ...item, quantity: item.quantity + cartItem.quantity }
            : item
        );
      }
      return [...prev, cartItem];
    });
  };

  // Navigates directly from selected item in grid to customized view details screen
  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setActiveView('details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Checkout flow trigger from drawer
  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setActiveView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Placing the final order (Syncs with Django Backend API & local cache)
  const handlePlaceOrderComplete = async (orderDetails) => {
    const newOrderRecord = {
      id: `FAZ-${Math.floor(1000 + Math.random() * 9000)}-${Array.from({ length: 3 }, () => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)]).join('')}`,
      address: {
        fullName: orderDetails.address.fullName,
        streetAddress: orderDetails.address.streetAddress,
        city: orderDetails.address.city,
        postalCode: orderDetails.address.postalCode
      },
      contact: {
        phone: orderDetails.contact.phone,
        email: orderDetails.contact.email
      },
      paymentMethod: orderDetails.paymentMethod,
      promoCode: orderDetails.promoCode || '',
      discountAmount: orderDetails.discountAmount || 0,
      finalTotal: orderDetails.finalTotal,
      status: 'Pending',
      created_at: new Date().toISOString(),
      items: cart.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        pricePerItem: item.pricePerItem,
        customizations: item.customizations || []
      }))
    };

    setLatestOrder(newOrderRecord);
    setIsSuccessOpen(true);

    // Sync order to Django REST API
    try {
      await ordersAPI.createOrder(newOrderRecord);
    } catch (e) {
      console.error('Error in handlePlaceOrderComplete:', e);
    }
  };

  // Resets states when closing the success modal (returns to home and clears cart)
  const handleCloseSuccessModal = () => {
    setIsSuccessOpen(false);
    setLatestOrder(null);
    setCart([]);
    setActiveView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background font-sans text-on-surface antialiased">
      {/* Dynamic Header */}
      <Header
        activeView={activeView}
        setActiveView={setActiveView}
        cart={cart}
        setIsCartOpen={setIsCartOpen}
      />

      {/* Main Screen Views Switcher */}
      <main className="flex-grow">
        {activeView === 'home' && (
          <HomeView
            setActiveView={setActiveView}
            setSelectedCategory={setSelectedCategory}
            onSelectProduct={handleSelectProduct}
            menuItems={menuItems}
          />
        )}

        {activeView === 'menu' && (
          <MenuView
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            onSelectProduct={handleSelectProduct}
            menuItems={menuItems}
          />
        )}

        {activeView === 'details' && selectedProduct && (
          <DetailsView
            product={selectedProduct}
            onBack={() => {
              setActiveView('menu');
            }}
            onAddToCart={handleAddToCart}
          />
        )}

        {activeView === 'checkout' && (
          <CheckoutView
            cart={cart}
            onBackToMenu={() => {
              setActiveView('menu');
            }}
            onPlaceOrder={handlePlaceOrderComplete}
          />
        )}

        {activeView === 'admin' && (
          <AdminView />
        )}
      </main>

      {/* Dynamic Shared Footer */}
      <Footer setActiveView={setActiveView} />

      {/* Sliding Right-Side Cart Drawer Overlay */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onCheckout={handleProceedToCheckout}
      />

      {/* Fullscreen Celebration Order Success Modal Dialog */}
      <OrderSuccessModal
        isOpen={isSuccessOpen}
        onClose={handleCloseSuccessModal}
        orderDetails={latestOrder}
        cart={cart}
      />
    </div>
  );
}

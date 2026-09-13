import React from 'react';
import { 
  TrendingUp, 
  ShoppingBag, 
  Clock, 
  CheckCircle, 
  Lock, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  CreditCard, 
  Trash2, 
  RefreshCw, 
  ChevronRight, 
  Check, 
  Code, 
  Sparkles,
  Search,
  Filter,
  LogOut,
  AlertCircle,
  FileSpreadsheet,
  Server,
  Database,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Terminal,
  Activity,
  Layers,
  Copy
} from 'lucide-react';
import { motion } from 'motion/react';
import { authAPI, ordersAPI, healthAPI } from '../services/api';

export const AdminView = () => {
  // Authentication states
  const [isLoggedIn, setIsLoggedIn] = React.useState(() => {
    return localStorage.getItem('fazfood_admin_logged') === 'true';
  });
  const [authMode, setAuthMode] = React.useState('login'); // 'login' | 'register'
  
  // Login form fields
  const [email, setEmail] = React.useState('owner@fazfood.com');
  const [password, setPassword] = React.useState('admin123');
  const [errorMsg, setErrorMsg] = React.useState('');
  
  // Registration fields
  const [regName, setRegName] = React.useState('');
  const [regEmail, setRegEmail] = React.useState('');
  const [regPassword, setRegPassword] = React.useState('');
  const [regPhone, setRegPhone] = React.useState('');
  const [successMsg, setSuccessMsg] = React.useState('');

  // Django REST Backend Connection States
  const [backendStatus, setBackendStatus] = React.useState({
    isOnline: false,
    url: 'http://127.0.0.1:8000/api',
    message: 'Checking Django API...'
  });
  const [isCheckingBackend, setIsCheckingBackend] = React.useState(false);
  const [showDjangoGuide, setShowDjangoGuide] = React.useState(false);
  const [copiedEndpoint, setCopiedEndpoint] = React.useState(null);

  // Orders list state
  const [orders, setOrders] = React.useState([]);
  const [selectedStatusFilter, setSelectedStatusFilter] = React.useState('all');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isLoadingOrders, setIsLoadingOrders] = React.useState(false);

  const handleExportToExcel = () => {
    try {
      if (orders.length === 0) {
        alert("No orders available to export!");
        return;
      }

      // Define columns/headers
      const headers = [
        "Order ID",
        "Order Date",
        "Customer Name",
        "Phone Number",
        "Email Address",
        "Delivery Address",
        "City",
        "Postal Code",
        "Payment Method",
        "Promo Code Used",
        "Discount Amount ($)",
        "Grand Total ($)",
        "Order Status",
        "Items Summary"
      ];

      // Map rows
      const rows = orders.map(order => {
        // Build items summary, e.g.: "1x Grilled Beef Burger (Extra Cheddar Cheese); 2x Pepperoni Pizza"
        const itemsSummary = order.items.map(item => {
          const customizations = item.customizations && item.customizations.length > 0
            ? ` (${item.customizations.join(", ")})`
            : "";
          return `${item.quantity}x ${item.name}${customizations}`;
        }).join(" | ");

        // Escaping values for CSV
        const escapeCsv = (val) => {
          if (val === null || val === undefined) return "";
          let stringVal = String(val);
          // Replace inner double quotes with double-double quotes
          stringVal = stringVal.replace(/"/g, '""');
          // If the string contains comma, double-quote, or newline, wrap in double quotes
          if (stringVal.includes(",") || stringVal.includes('"') || stringVal.includes("\n") || stringVal.includes("\r")) {
            return `"${stringVal}"`;
          }
          return stringVal;
        };

        return [
          escapeCsv(order.id),
          escapeCsv(new Date(order.created_at).toLocaleString()),
          escapeCsv(order.address.fullName),
          escapeCsv(order.contact.phone),
          escapeCsv(order.contact.email),
          escapeCsv(order.address.streetAddress),
          escapeCsv(order.address.city),
          escapeCsv(order.address.postalCode),
          escapeCsv(order.paymentMethod ? order.paymentMethod.replace('_', ' ').toUpperCase() : ""),
          escapeCsv(order.promoCode || "None"),
          escapeCsv(order.discountAmount || "0.00"),
          escapeCsv(order.finalTotal),
          escapeCsv(order.status),
          escapeCsv(itemsSummary)
        ];
      });

      // Construct CSV content
      const csvContent = [
        headers.join(","),
        ...rows.map(row => row.join(","))
      ].join("\n");

      // Excel BOM (Byte Order Mark) to ensure Excel opens CSV in UTF-8
      const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      
      const dateStr = new Date().toISOString().split('T')[0];
      link.setAttribute("download", `fazfood_orders_export_${dateStr}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Error exporting orders:", err);
      alert("Failed to export orders to Excel format.");
    }
  };

  // Check Django Backend Health Status
  const checkDjangoStatus = async () => {
    setIsCheckingBackend(true);
    try {
      const res = await healthAPI.checkHealth();
      setBackendStatus(res);
    } catch {
      setBackendStatus({
        isOnline: false,
        url: 'http://127.0.0.1:8000/api',
        message: 'Django server offline (Operating on Local Storage Cache)'
      });
    } finally {
      setIsCheckingBackend(false);
    }
  };

  React.useEffect(() => {
    checkDjangoStatus();
  }, []);

  // Load orders from Django API (with automatic fallback to local storage)
  const loadOrders = async () => {
    setIsLoadingOrders(true);
    try {
      const fetched = await ordersAPI.getOrders({
        status: selectedStatusFilter,
        search: searchQuery
      });
      if (fetched && Array.isArray(fetched) && fetched.length > 0) {
        setOrders(fetched);
      } else {
        // Sample orders fallback for initial exploration if brand new empty setup
        const sampleOrders = [
          {
            id: "FAZ-8201-XYZ",
            address: {
              fullName: "Amit Kumar",
              streetAddress: "72 Park Avenue, Apt 4B",
              city: "New York",
              postalCode: "10016"
            },
            contact: {
              phone: "+1 (555) 987-6543",
              email: "amit.kumar@gmail.com"
            },
            paymentMethod: "credit_card",
            promoCode: "FAZDELIGHT",
            discountAmount: 2.25,
            finalTotal: 15.24,
            status: "Grilling",
            created_at: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
            items: [
              { id: "grilled-beef-burger", name: "Grilled Beef Burger", quantity: 1, pricePerItem: 12.99, customizations: ["Extra Cheddar Cheese", "Add Caramelized Onions"] }
            ]
          },
          {
            id: "FAZ-4927-ABC",
            address: {
              fullName: "Sarah Connor",
              streetAddress: "128 Gourmet Blvd",
              city: "New York",
              postalCode: "10012"
            },
            contact: {
              phone: "+1 (555) 345-6789",
              email: "sarah@resistance.net"
            },
            paymentMethod: "apple_pay",
            promoCode: "",
            discountAmount: 0,
            finalTotal: 31.00,
            status: "Delivered",
            created_at: new Date(Date.now() - 1000 * 60 * 95).toISOString(),
            items: [
              { id: "double-bacon-cheese", name: "Double Bacon Cheese", quantity: 1, pricePerItem: 16.50, customizations: ["Add Crispy Bacon"] },
              { id: "gourmet-pepperoni-pizza", name: "Gourmet Pepperoni Pizza", quantity: 1, pricePerItem: 14.50, customizations: [] }
            ]
          }
        ];
        localStorage.setItem('fazfood_orders', JSON.stringify(sampleOrders));
        setOrders(sampleOrders);
      }
    } catch (err) {
      console.error('Error loading orders:', err);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  React.useEffect(() => {
    loadOrders();
  }, [selectedStatusFilter]);

  // Seed default orders explicitly
  const handleResetOrders = async () => {
    localStorage.removeItem('fazfood_orders');
    await loadOrders();
  };

  // Handle Login submission via Django auth API
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      await authAPI.login(email, password);
      setIsLoggedIn(true);
      await loadOrders();
    } catch (err) {
      setErrorMsg(err.message || 'Invalid email or password. Use owner@fazfood.com & admin123');
    }
  };

  // Handle Registration via Django auth API
  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!regName || !regEmail || !regPassword) {
      setErrorMsg('Please fill all required fields');
      return;
    }

    try {
      await authAPI.register({
        name: regName,
        email: regEmail,
        password: regPassword,
        phone: regPhone
      });
      setSuccessMsg('Registration successful! Please login with your credentials.');
      setAuthMode('login');
      setEmail(regEmail);
      setPassword(regPassword);
    } catch (err) {
      setErrorMsg(err.message || 'Error saving user credentials');
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (e) {
      console.info('Logout error:', e);
    }
    setIsLoggedIn(false);
  };

  // Update order status (Syncs to Django API & updates local cache)
  const handleUpdateStatus = async (orderId, newStatus) => {
    const updated = orders.map(order => {
      if (order.id === orderId) {
        return { ...order, status: newStatus };
      }
      return order;
    });
    setOrders(updated);

    try {
      await ordersAPI.updateOrderStatus(orderId, newStatus);
    } catch (err) {
      console.error('Error updating order status:', err);
    }
  };

  // Delete/Archive order (Syncs to Django API & updates local cache)
  const handleDeleteOrder = async (orderId) => {
    if (window.confirm(`Are you sure you want to delete order ${orderId}?`)) {
      const filtered = orders.filter(order => order.id !== orderId);
      setOrders(filtered);

      try {
        await ordersAPI.deleteOrder(orderId);
      } catch (err) {
        console.error('Error deleting order:', err);
      }
    }
  };

  // Calculating stats metrics dynamically
  const statsTotalSales = orders
    .filter(o => o.status !== 'Cancelled')
    .reduce((acc, curr) => acc + curr.finalTotal, 0);

  const statsActiveOrders = orders
    .filter(o => ['Pending', 'Grilling', 'On Route'].includes(o.status))
    .length;

  const statsCompletedCount = orders
    .filter(o => o.status === 'Delivered')
    .length;

  // Filter & Search logic
  const filteredAndSearchedOrders = orders.filter(order => {
    const matchesStatus = selectedStatusFilter === 'all' || order.status === selectedStatusFilter;
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.address.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.contact.phone.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8" id="admin-view-root">
      
      {/* 1. NOT LOGGED IN: LOGIN / REGISTER FORMS */}
      {!isLoggedIn ? (
        <div className="max-w-md mx-auto bg-white rounded-[2rem] shadow-xl border border-slate-200 overflow-hidden mt-8 animate-in fade-in zoom-in-95 duration-300">
          
          {/* Header Banner */}
          <div className="bg-primary text-white p-8 text-center relative overflow-hidden">
            <div className="absolute w-60 h-60 rounded-full bg-secondary-container/10 blur-2xl pointer-events-none -top-10 -right-10" />
            <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-3">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <h2 className="font-headline text-2xl tracking-wide text-white">Owner Portal</h2>
            <p className="text-white/80 text-xs mt-1">Manage shop orders, sales statistics, and track culinary preparation.</p>
          </div>

          <div className="p-8">
            {/* Tabs Selector */}
            <div className="flex border-b border-slate-100 mb-6">
              <button 
                type="button"
                onClick={() => { setAuthMode('login'); setErrorMsg(''); }}
                className={`flex-1 pb-3 text-sm font-bold border-b-2 transition-colors ${authMode === 'login' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
              >
                Sign In
              </button>
              <button 
                type="button"
                onClick={() => { setAuthMode('register'); setErrorMsg(''); }}
                className={`flex-1 pb-3 text-sm font-bold border-b-2 transition-colors ${authMode === 'register' ? 'border-primary text-primary' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
              >
                Register Shop
              </button>
            </div>

            {/* Notifications panel */}
            {errorMsg && (
              <div className="flex items-center gap-2 p-3.5 bg-red-50 border border-red-200 text-red-600 text-xs font-semibold rounded-xl mb-4">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
            {successMsg && (
              <div className="flex items-center gap-2 p-3.5 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold rounded-xl mb-4">
                <Check className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* TAB 1: LOGIN FORM */}
            {authMode === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Owner Email Address</label>
                  <div className="relative">
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full text-xs p-3.5 pl-10 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-primary focus:bg-white transition-all font-semibold"
                      placeholder="owner@fazfood.com"
                      required
                    />
                    <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Master Password</label>
                  <div className="relative">
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full text-xs p-3.5 pl-10 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-primary focus:bg-white transition-all font-semibold"
                      placeholder="••••••••"
                      required
                    />
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-primary hover:underline font-bold cursor-pointer">Forgot password?</span>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-primary hover:bg-primary-hover text-white font-headline text-base tracking-wider py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer mt-2"
                  id="owner-login-submit"
                >
                  ENTER OWNER DASHBOARD
                </button>

                <div className="text-center pt-3 border-t border-slate-100">
                  <p className="text-[10px] text-gray-500 font-medium">
                    Demo Credentials:<br />
                    <span className="font-bold text-primary">owner@fazfood.com</span> & Password <span className="font-bold text-primary">admin123</span>
                  </p>
                </div>
              </form>
            )}

            {/* TAB 2: REGISTER FORM */}
            {authMode === 'register' && (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Shop Owner Full Name</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="w-full text-xs p-3.5 pl-10 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-primary focus:bg-white transition-all font-semibold"
                      placeholder="Gourmet Chef"
                      required
                    />
                    <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Registered Email</label>
                  <div className="relative">
                    <input 
                      type="email" 
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full text-xs p-3.5 pl-10 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-primary focus:bg-white transition-all font-semibold"
                      placeholder="chef@gmail.com"
                      required
                    />
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Create Secure Password</label>
                  <div className="relative">
                    <input 
                      type="password" 
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full text-xs p-3.5 pl-10 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-primary focus:bg-white transition-all font-semibold"
                      placeholder="••••••••"
                      required
                    />
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Contact Number (Optional)</label>
                  <div className="relative">
                    <input 
                      type="tel" 
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      className="w-full text-xs p-3.5 pl-10 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-primary focus:bg-white transition-all font-semibold"
                      placeholder="+1 (555) 000-0000"
                    />
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-primary hover:bg-primary-hover text-white font-headline text-base tracking-wider py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer mt-2"
                >
                  CREATE OWNER ACCOUNT
                </button>
              </form>
            )}

          </div>
        </div>
      ) : (
        
        /* 2. LOGGED IN: COMPREHENSIVE OWNER DASHBOARD */
        <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-400">
          
          {/* Top Panel Brand */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border border-slate-200 p-8 rounded-[2rem] shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-white shadow-md">
                <span className="material-symbols-outlined font-bold text-3xl">restaurant</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-headline text-3xl text-on-surface">Owner Dashboard</h1>
                  <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 uppercase tracking-wide">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" /> System Live
                  </span>
                </div>
                <p className="text-gray-500 text-xs mt-1 font-medium">Monitor live orders, preparaion pipeline, and checkout revenues.</p>
              </div>
            </div>

            {/* Right Quick Controls */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={checkDjangoStatus}
                disabled={isCheckingBackend}
                className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-60"
                title="Ping Django REST API Server"
              >
                <Activity className={`w-3.5 h-3.5 ${isCheckingBackend ? 'animate-spin text-primary' : 'text-slate-600'}`} />
                {isCheckingBackend ? 'Pinging...' : 'Ping Backend'}
              </button>

              <button
                onClick={() => setShowDjangoGuide(!showDjangoGuide)}
                className="flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                title="View Django REST API documentation and connected endpoints"
              >
                <Server className="w-3.5 h-3.5" />
                Django API
                {showDjangoGuide ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={handleExportToExcel}
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                id="btn-export-excel"
              >
                <FileSpreadsheet className="w-4 h-4" /> Export to Excel
              </button>

              <button
                onClick={handleResetOrders}
                className="flex items-center gap-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-gray-600 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm"
                title="Reset orders to default showcase sample list"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Reset
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 border border-red-150 text-red-600 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm"
              >
                <LogOut className="w-3.5 h-3.5" /> Logout
              </button>
            </div>
          </div>

          {/* DJANGO API INTEGRATION STATUS BAR */}
          <div className={`p-4 rounded-2xl border flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs transition-all ${
            backendStatus.isOnline 
              ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
              : 'bg-amber-50/80 border-amber-200 text-amber-900'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full shrink-0 ${
                backendStatus.isOnline ? 'bg-emerald-500 ring-4 ring-emerald-200 animate-pulse' : 'bg-amber-500 ring-4 ring-amber-200'
              }`} />
              <div>
                <span className="font-bold">
                  {backendStatus.isOnline ? 'Django REST Backend: CONNECTED (Online)' : 'Django REST Backend: OFFLINE (Operating on Local Storage Cache)'}
                </span>
                <span className="block text-[11px] opacity-80 mt-0.5">
                  Target API URL: <code className="font-mono font-bold bg-white/60 px-1.5 py-0.5 rounded">{backendStatus.url || 'http://127.0.0.1:8000/api'}</code>
                  {' • '}{backendStatus.isOnline ? 'Real-time database sync active' : 'Run python manage.py runserver to connect live SQL database'}
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowDjangoGuide(!showDjangoGuide)}
              className="px-3 py-1.5 rounded-lg bg-white shadow-xs font-bold text-xs hover:bg-slate-50 transition-colors shrink-0 flex items-center gap-1 border border-black/10 cursor-pointer"
            >
              <Code className="w-3.5 h-3.5" />
              {showDjangoGuide ? 'Hide API Endpoints' : 'View API Endpoints'}
            </button>
          </div>

          {/* EXPANDABLE DJANGO API ENDPOINTS REFERENCE & CODE */}
          {showDjangoGuide && (
            <div className="bg-slate-900 text-slate-200 rounded-3xl p-6 border border-slate-800 shadow-xl space-y-5 animate-in fade-in slide-in-from-top-3 duration-300">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-emerald-400" />
                    <h3 className="font-headline text-lg text-white font-bold">Django REST API Endpoints Specification</h3>
                  </div>
                  <p className="text-slate-400 text-xs mt-1">
                    All frontend operations in FazFood are integrated through <code className="text-emerald-300 font-mono">src/services/api.js</code>. Connect your Django backend on port 8000.
                  </p>
                </div>
                <span className="text-[11px] bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700">
                  Django REST Framework 3.14+
                </span>
              </div>

              {/* Endpoints Table */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {[
                  { method: 'POST', path: '/api/auth/login/', desc: 'Shop owner login & Token authentication' },
                  { method: 'POST', path: '/api/auth/register/', desc: 'Shop owner account registration' },
                  { method: 'GET', path: '/api/orders/', desc: 'Fetch all orders (filterable by status & search)' },
                  { method: 'POST', path: '/api/orders/', desc: 'Place customer order with nested order items' },
                  { method: 'PATCH', path: '/api/orders/{id}/', desc: 'Update order progress status (Grilling, Delivered, etc.)' },
                  { method: 'DELETE', path: '/api/orders/{id}/', desc: 'Archive or remove order from database' },
                  { method: 'GET', path: '/api/menu/', desc: 'Retrieve dynamic menu items and categories' },
                  { method: 'POST', path: '/api/promos/validate/', desc: 'Validate coupon codes (e.g. FAZDELIGHT)' },
                  { method: 'POST', path: '/api/reviews/', desc: 'Customer review submission with rating & remarks' },
                  { method: 'GET', path: '/api/admin/stats/', desc: 'Aggregated revenue & order counts for dashboard' }
                ].map((ep, idx) => (
                  <div key={idx} className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                          ep.method === 'GET' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                          ep.method === 'POST' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                          ep.method === 'PATCH' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                          'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        }`}>
                          {ep.method}
                        </span>
                        <code className="text-white font-mono font-bold text-xs">{ep.path}</code>
                      </div>
                      <p className="text-slate-400 text-[11px]">{ep.desc}</p>
                    </div>

                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(`http://127.0.0.1:8000${ep.path}`);
                        setCopiedEndpoint(idx);
                        setTimeout(() => setCopiedEndpoint(null), 2000);
                      }}
                      className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors shrink-0"
                      title="Copy full URL"
                    >
                      {copiedEndpoint === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                ))}
              </div>

              {/* Quick CLI tip */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-slate-300">
                    Seed initial database menu: <code className="text-emerald-400 font-mono bg-slate-900 px-2 py-0.5 rounded ml-1">python seed_django_data.py</code>
                  </span>
                </div>
                <span className="text-slate-400 text-[11px]">
                  Full guide in <code className="text-indigo-300 font-mono">DJANGO_BACKEND_SETUP.md</code>
                </span>
              </div>
            </div>
          )}



          {/* STATS METRIC GRID CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="dashboard-metrics-grid">
            
            {/* Stat 1: Revenue sales */}
            <div className="bg-white rounded-[2rem] p-6 border border-slate-200 flex items-center gap-5 shadow-sm">
              <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl shrink-0">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">REVENUE SALES</span>
                <span className="font-headline text-2xl text-on-surface block mt-1">${statsTotalSales.toFixed(2)}</span>
                <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">Excluding Cancelled</span>
              </div>
            </div>

            {/* Stat 2: Active orders */}
            <div className="bg-white rounded-[2rem] p-6 border border-slate-200 flex items-center gap-5 shadow-sm">
              <div className="p-4 bg-primary/10 text-primary rounded-2xl shrink-0">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">ACTIVE PIPELINE</span>
                <span className="font-headline text-2xl text-on-surface block mt-1">{statsActiveOrders} Orders</span>
                <span className="text-[10px] text-primary font-semibold block mt-0.5">Cooking & On Route</span>
              </div>
            </div>

            {/* Stat 3: Average Ticket size */}
            <div className="bg-white rounded-[2rem] p-6 border border-slate-200 flex items-center gap-5 shadow-sm">
              <div className="p-4 bg-purple-50 text-purple-600 rounded-2xl shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">AVERAGE TICKET</span>
                <span className="font-headline text-2xl text-on-surface block mt-1">
                  ${orders.length > 0 ? (statsTotalSales / orders.length).toFixed(2) : "0.00"}
                </span>
                <span className="text-[10px] text-purple-600 font-semibold block mt-0.5">Acreage Basket Price</span>
              </div>
            </div>

            {/* Stat 4: Completed Deliveries */}
            <div className="bg-white rounded-[2rem] p-6 border border-slate-200 flex items-center gap-5 shadow-sm">
              <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl shrink-0">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">SUCCESS RATE</span>
                <span className="font-headline text-2xl text-on-surface block mt-1">{statsCompletedCount} Deliveries</span>
                <span className="text-[10px] text-blue-600 font-semibold block mt-0.5">Contactless Completed</span>
              </div>
            </div>

          </div>

          {/* MAIN ORDER MANAGEMENT FLOW PANEL */}
          <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
            
            {/* Header controls bar */}
            <div className="p-6 md:p-8 border-b border-slate-150 flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4">
              <div>
                <h2 className="font-headline text-xl text-on-surface">Customer Orders Queue</h2>
                <p className="text-gray-500 text-xs mt-0.5 font-medium">Control the preparation states, update drivers, and cancel orders.</p>
              </div>

              {/* Filtering Controls */}
              <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                
                {/* Search Bar */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by ID, Customer Name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="text-xs p-3 pl-9 pr-4 border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-primary focus:bg-white transition-all font-semibold max-w-xs"
                  />
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>

                {/* Status Filter buttons */}
                <div className="flex gap-1 bg-slate-100 p-1 rounded-xl overflow-x-auto no-scrollbar shrink-0">
                  {['all', 'Pending', 'Grilling', 'On Route', 'Delivered', 'Cancelled'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setSelectedStatusFilter(status)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors cursor-pointer ${
                        selectedStatusFilter === status
                          ? 'bg-primary text-white shadow-sm'
                          : 'text-gray-500 hover:text-gray-800 hover:bg-slate-200/50'
                      }`}
                    >
                      {status === 'all' ? 'All Queue' : status}
                    </button>
                  ))}
                </div>

              </div>
            </div>

            {/* Orders queue grid list */}
            {filteredAndSearchedOrders.length === 0 ? (
              <div className="text-center py-20 bg-white">
                <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
                  <Filter className="w-7 h-7" />
                </div>
                <h3 className="font-headline text-xl text-on-surface">No Orders Found</h3>
                <p className="text-gray-400 text-xs mt-1 max-w-xs mx-auto">
                  Try clearing your search query or choosing another status queue filter tab.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-150">
                {filteredAndSearchedOrders.map((order) => {
                  
                  // Status pill styling
                  const statusColors = {
                    Pending: 'bg-amber-50 text-amber-700 border-amber-200',
                    Grilling: 'bg-orange-50 text-orange-700 border-orange-200',
                    'On Route': 'bg-blue-50 text-blue-700 border-blue-200',
                    Delivered: 'bg-green-50 text-green-700 border-green-200',
                    Cancelled: 'bg-red-50 text-red-700 border-red-200'
                  };

                  return (
                    <div key={order.id} className="p-6 md:p-8 hover:bg-slate-50/50 transition-colors flex flex-col lg:flex-row justify-between gap-8">
                      
                      {/* Column 1: Order Meta & Customer Info */}
                      <div className="space-y-4 max-w-sm">
                        <div className="flex items-center gap-3">
                          <span className="font-headline text-base tracking-wider text-slate-800 font-mono bg-slate-100 px-3 py-1 rounded-xl">
                            {order.id}
                          </span>
                          <span className={`text-[10px] font-bold border px-2.5 py-1 rounded-full uppercase tracking-wider ${statusColors[order.status] || 'bg-gray-100 text-gray-700'}`}>
                            {order.status}
                          </span>
                        </div>

                        <div className="space-y-2 text-xs">
                          {/* Name */}
                          <div className="flex items-start gap-2">
                            <User className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                            <div>
                              <p className="font-bold text-on-surface text-sm">{order.address.fullName}</p>
                              <p className="text-gray-500">{new Date(order.created_at).toLocaleString()}</p>
                            </div>
                          </div>

                          {/* Contact Info */}
                          <div className="flex items-start gap-2">
                            <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                            <p className="text-gray-600 font-medium">{order.contact.phone} <span className="text-gray-400 font-normal">|</span> {order.contact.email}</p>
                          </div>

                          {/* Address */}
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                            <p className="text-gray-600 font-medium leading-relaxed">
                              {order.address.streetAddress}, {order.address.city}, {order.address.postalCode}
                            </p>
                          </div>

                          {/* Payment method */}
                          <div className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-slate-400 shrink-0" />
                            <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-200/60 px-2 py-0.5 rounded">
                              {order.paymentMethod.replace('_', ' ')}
                            </span>
                            {order.promoCode && (
                              <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                                Promo: {order.promoCode}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Column 2: Order Items Purchased */}
                      <div className="flex-1 bg-slate-50 border border-slate-150 rounded-2xl p-5 space-y-3">
                        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ORDERED MENU ITEMS</h4>
                        
                        <div className="space-y-3 divide-y divide-slate-200/60">
                          {order.items.map((item, idx) => (
                            <div key={idx} className={`pt-2.5 first:pt-0 flex justify-between items-start text-xs`}>
                              <div>
                                <span className="font-bold text-on-surface">
                                  {item.quantity}x {item.name}
                                </span>
                                {item.customizations && item.customizations.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {item.customizations.map((cust, cIdx) => (
                                      <span key={cIdx} className="text-[9px] bg-white border border-slate-200 text-gray-500 px-1.5 py-0.5 rounded">
                                        +{cust}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                              <span className="font-headline text-on-surface shrink-0 ml-4">${(item.pricePerItem * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>

                        <div className="flex justify-between items-center border-t border-slate-200/80 pt-3 mt-3">
                          <div>
                            {order.discountAmount > 0 && (
                              <p className="text-[10px] font-semibold text-emerald-600">Discount: -${order.discountAmount.toFixed(2)}</p>
                            )}
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">GRAND TOTAL</p>
                          </div>
                          <span className="font-headline text-lg text-primary">${order.finalTotal.toFixed(2)}</span>
                        </div>
                      </div>

                      {/* Column 3: Control Panel Action Handlers */}
                      <div className="flex flex-col sm:flex-row lg:flex-col gap-3 justify-center min-w-[200px]">
                        
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Update Status</label>
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                            className="w-full text-xs font-bold border border-slate-200 rounded-xl py-3 pl-3 pr-8 bg-white focus:outline-none focus:border-primary cursor-pointer shadow-sm"
                          >
                            <option value="Pending">🕒 Pending</option>
                            <option value="Grilling">🔥 Grilling</option>
                            <option value="On Route">🚴 On Route</option>
                            <option value="Delivered">✅ Delivered</option>
                            <option value="Cancelled">❌ Cancelled</option>
                          </select>
                        </div>

                        <div className="flex gap-2 sm:self-end lg:self-stretch mt-auto">
                          {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                            <button
                              onClick={() => handleUpdateStatus(order.id, 'Delivered')}
                              className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-3 px-4 rounded-xl shadow-md transition-colors flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <CheckCircle className="w-4 h-4" /> Complete
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteOrder(order.id)}
                            className="bg-white border border-red-200 hover:bg-red-50 text-red-500 p-3 rounded-xl transition-colors shrink-0 cursor-pointer shadow-sm"
                            title="Delete Order Record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                      </div>

                    </div>
                  );
                })}
              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
};

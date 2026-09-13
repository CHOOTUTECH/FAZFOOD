import React from 'react';
import { ShoppingBag, Search, Menu, X, ArrowRight } from 'lucide-react';

export const Header = ({
  activeView,
  setActiveView,
  cart,
  setIsCartOpen,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-surface-container-high transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div 
            onClick={() => { setActiveView('home'); setMobileMenuOpen(false); }} 
            className="flex items-center gap-2 cursor-pointer group"
            id="header-logo-container"
          >
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white transform group-hover:rotate-12 transition-transform duration-300 shadow-md">
              <span className="material-symbols-outlined font-semibold text-2xl">restaurant</span>
            </div>
            <span className="font-headline text-3xl tracking-wider text-primary group-hover:text-primary-hover transition-colors duration-300">
              FAZ<span className="text-secondary-container">FOOD</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 text-sm font-semibold tracking-wide text-on-surface/80" id="desktop-nav">
            <button
              onClick={() => setActiveView('home')}
              className={`hover:text-primary transition-colors py-2 relative ${
                activeView === 'home' ? 'text-primary' : ''
              }`}
              id="nav-home"
            >
              Home
              {activeView === 'home' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </button>
            <button
              onClick={() => setActiveView('menu')}
              className={`hover:text-primary transition-colors py-2 relative ${
                activeView === 'menu' ? 'text-primary' : ''
              }`}
              id="nav-menu"
            >
              Our Menu
              {activeView === 'menu' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </button>
            <button
              onClick={() => {
                setActiveView('menu');
              }}
              className="hover:text-primary transition-colors py-2 relative"
              id="nav-offers"
            >
              Special Offers
              <span className="absolute -top-1 -right-3 text-[9px] bg-secondary-container text-on-secondary-container px-1 rounded-full font-bold">
                PROMO
              </span>
            </button>
            <button
              onClick={() => setActiveView('admin')}
              className={`hover:text-primary transition-colors py-2 relative flex items-center gap-1 ${
                activeView === 'admin' ? 'text-primary' : ''
              }`}
              id="nav-admin"
            >
              <span className="material-symbols-outlined text-base">admin_panel_settings</span> Owner Portal
              {activeView === 'admin' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-4" id="header-actions">
            {/* Quick Order Now button */}
            <button 
              onClick={() => setActiveView('menu')}
              className="hidden lg:flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-bold text-xs px-5 py-3 rounded-full transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              id="header-btn-order"
            >
              ORDER NOW <ArrowRight className="w-4 h-4" />
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-3 rounded-full hover:bg-surface-container-low transition-colors group cursor-pointer border border-surface-container-high"
              id="header-btn-cart"
              aria-label="Open Cart"
            >
              <ShoppingBag className="w-6 h-6 text-on-surface/80 group-hover:text-primary transition-colors" />
              {totalCartItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white ring-2 ring-white animate-bounce">
                  {totalCartItems}
                </span>
              )}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-on-surface/80 hover:bg-surface-container-low cursor-pointer"
              id="header-btn-mobile"
              aria-label="Toggle Mobile Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-surface-container-high shadow-lg animate-in slide-in-from-top duration-300" id="mobile-nav-panel">
          <div className="px-2 pt-2 pb-4 space-y-1">
            <button
              onClick={() => { setActiveView('home'); setMobileMenuOpen(false); }}
              className={`flex w-full items-center px-4 py-3 text-base font-bold rounded-lg ${
                activeView === 'home' ? 'bg-primary/10 text-primary' : 'text-on-surface hover:bg-surface-container-low'
              }`}
              id="mobile-nav-home"
            >
              Home
            </button>
            <button
              onClick={() => { setActiveView('menu'); setMobileMenuOpen(false); }}
              className={`flex w-full items-center px-4 py-3 text-base font-bold rounded-lg ${
                activeView === 'menu' ? 'bg-primary/10 text-primary' : 'text-on-surface hover:bg-surface-container-low'
              }`}
              id="mobile-nav-menu"
            >
              Our Menu
            </button>
            <button
              onClick={() => { setActiveView('menu'); setMobileMenuOpen(false); }}
              className="flex w-full items-center px-4 py-3 text-base font-bold text-on-surface hover:bg-surface-container-low rounded-lg"
              id="mobile-nav-offers"
            >
              Special Offers
              <span className="ml-2 text-[10px] bg-secondary-container text-on-secondary-container px-1.5 py-0.5 rounded-full font-bold">
                PROMO
              </span>
            </button>
            <button
              onClick={() => { setActiveView('admin'); setMobileMenuOpen(false); }}
              className={`flex w-full items-center px-4 py-3 text-base font-bold rounded-lg gap-2 ${
                activeView === 'admin' ? 'bg-primary/10 text-primary' : 'text-on-surface hover:bg-surface-container-low'
              }`}
              id="mobile-nav-admin"
            >
              <span className="material-symbols-outlined text-xl">admin_panel_settings</span> Owner Portal
            </button>
            <div className="px-4 pt-3">
              <button 
                onClick={() => { setActiveView('menu'); setMobileMenuOpen(false); }}
                className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white font-bold py-3 px-4 rounded-xl shadow-md transition-colors"
                id="mobile-nav-btn-order"
              >
                ORDER NOW <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

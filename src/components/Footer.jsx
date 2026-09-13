import React from 'react';
import { Mail, Phone, MapPin, Clock, ArrowUp } from 'lucide-react';

export const Footer = ({ setActiveView }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-inverse-surface text-white border-t border-surface-container-high" id="app-footer">
      {/* Top micro-banner */}
      <div className="bg-primary/95 text-white py-4 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-yellow-400 font-semibold animate-pulse">local_shipping</span>
            <span className="font-bold text-sm tracking-wide">FREE DELIVERY ON ORDERS ABOVE $40! USE CODE <span className="underline decoration-yellow-400 text-yellow-300">FAZDELIGHT</span> FOR 15% OFF!</span>
          </div>
          <button 
            onClick={() => setActiveView('menu')}
            className="bg-white text-primary hover:bg-yellow-400 hover:text-on-secondary-container text-xs font-headline tracking-widest px-6 py-2.5 rounded-full transition-all duration-300 shadow-md transform hover:scale-105"
            id="footer-banner-btn"
          >
            ORDER NOW
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Logo & Slogan */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setActiveView('home')}>
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white">
                <span className="material-symbols-outlined font-semibold text-2xl">restaurant</span>
              </div>
              <span className="font-headline text-3xl tracking-wider text-white">
                FAZ<span className="text-secondary-container">FOOD</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mt-2">
              Serving mouthwatering, flame-grilled burgers, fresh pizzas, and premium treats with speed and devotion. Crafted by real foodies, for real foodies.
            </p>
            <div className="flex gap-3 mt-4">
              <span className="w-10 h-10 rounded-full bg-white/10 hover:bg-primary flex items-center justify-center cursor-pointer transition-colors text-white">
                <span className="material-symbols-outlined text-lg">facebook</span>
              </span>
              <span className="w-10 h-10 rounded-full bg-white/10 hover:bg-primary flex items-center justify-center cursor-pointer transition-colors text-white">
                <span className="material-symbols-outlined text-lg">camera_alt</span>
              </span>
              <span className="w-10 h-10 rounded-full bg-white/10 hover:bg-primary flex items-center justify-center cursor-pointer transition-colors text-white">
                <span className="material-symbols-outlined text-lg">alternate_email</span>
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-headline text-lg tracking-wider text-yellow-400 mb-6">QUICK NAVIGATION</h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li>
                <button onClick={() => { setActiveView('home'); window.scrollTo(0, 0); }} className="hover:text-primary transition-colors flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">home</span> Home Page
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveView('menu'); window.scrollTo(0, 0); }} className="hover:text-primary transition-colors flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">restaurant_menu</span> Full Menu
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveView('menu'); window.scrollTo(0, 0); }} className="hover:text-primary transition-colors flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">local_offer</span> Deals & Promotions
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveView('checkout'); window.scrollTo(0, 0); }} className="hover:text-primary transition-colors flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">shopping_cart_checkout</span> Secure Checkout
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveView('admin'); window.scrollTo(0, 0); }} className="hover:text-primary transition-colors flex items-center gap-2 text-yellow-300">
                  <span className="material-symbols-outlined text-sm">admin_panel_settings</span> Owner Dashboard Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="font-headline text-lg tracking-wider text-yellow-400 mb-6">GET IN TOUCH</h3>
            <ul className="space-y-4 text-sm text-gray-300">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0" />
                <span>124 Gourmet Boulevard, Culinary District, NYC 10012</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <span>+1 (555) 234-5678</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <span>support@fazfood.com</span>
              </li>
            </ul>
          </div>

          {/* Operational Hours */}
          <div>
            <h3 className="font-headline text-lg tracking-wider text-yellow-400 mb-6">OPENING HOURS</h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex justify-between items-center border-b border-white/10 pb-2">
                <span>Monday - Friday:</span>
                <span className="text-white font-medium">10:00 AM - 11:00 PM</span>
              </li>
              <li className="flex justify-between items-center border-b border-white/10 pb-2">
                <span>Saturday:</span>
                <span className="text-white font-medium">09:00 AM - Midnight</span>
              </li>
              <li className="flex justify-between items-center">
                <span>Sunday:</span>
                <span className="text-white font-medium">09:00 AM - 10:00 PM</span>
              </li>
              <li className="text-[11px] text-gray-400 mt-3 italic flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-primary" /> Delivery kitchen closes 30 mins early.
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-400 text-center sm:text-left">
            &copy; {new Date().getFullYear()} FazFood Inc. All rights reserved. Designed with meticulous attention to detail.
          </p>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 bg-white/10 hover:bg-primary transition-all duration-300 text-white text-xs px-4 py-2 rounded-full cursor-pointer"
            id="btn-scroll-to-top"
          >
            Back to top <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
};

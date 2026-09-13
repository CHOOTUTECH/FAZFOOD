import React from 'react';
import { X, Trash2, ShoppingBag, Plus, Minus, ShieldCheck } from 'lucide-react';

export const CartDrawer = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckout,
}) => {
  if (!isOpen) return null;

  const subtotal = cart.reduce((acc, item) => acc + item.pricePerItem * item.quantity, 0);
  const vat = subtotal * 0.10; // 10%
  const deliveryFee = subtotal > 40 || subtotal === 0 ? 0 : 5.00;
  const grandTotal = subtotal + vat + deliveryFee;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" id="cart-drawer-overlay">
      {/* Dark backdrop */}
      <div 
        onClick={onClose} 
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300" 
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        {/* Drawer container */}
        <div className="w-screen max-w-md bg-white border-l border-surface-container-high shadow-2xl flex flex-col justify-between h-full animate-in slide-in-from-right duration-300">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-surface-container-high flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-2xl font-bold">shopping_basket</span>
              <h2 className="font-headline text-2xl text-on-surface">YOUR BASKET</h2>
              <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded-full">
                {cart.reduce((acc, i) => acc + i.quantity, 0)}
              </span>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-surface-container-low text-on-surface/80 hover:text-primary transition-colors cursor-pointer border border-surface-container-high"
              aria-label="Close Cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items list */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-24 h-24 rounded-full bg-surface-container-low flex items-center justify-center text-primary/40 mb-4 animate-pulse">
                  <ShoppingBag className="w-12 h-12" />
                </div>
                <h3 className="font-headline text-xl text-on-surface">Your basket is empty</h3>
                <p className="text-gray-400 text-xs mt-1.5 max-w-xs">
                  Browse our gourmet offerings and add custom flame-grilled delights to satisfy your cravings.
                </p>
                <button
                  onClick={onClose}
                  className="mt-6 bg-primary hover:bg-primary-hover text-white text-xs font-bold px-6 py-3 rounded-full shadow-md transition-colors cursor-pointer"
                >
                  START ORDERING
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div 
                  key={item.id}
                  className="flex items-start gap-4 pb-6 border-b border-surface-container-low last:border-b-0 last:pb-0"
                  id={`cart-item-${item.id}`}
                >
                  {/* Thumbnail */}
                  <div className="w-20 h-20 rounded-2xl bg-surface-container-low overflow-hidden shrink-0 border border-surface-container-high p-1">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover rounded-xl"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-bold text-on-surface line-clamp-2 leading-snug">
                        {item.name}
                      </h4>
                      <button 
                        onClick={() => onRemoveItem(item.id)}
                        className="text-gray-400 hover:text-primary transition-colors p-1 shrink-0"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Options / Customizations list */}
                    {item.customizations.length > 0 && (
                      <p className="text-[11px] text-gray-500 font-medium leading-relaxed mt-1">
                        + {item.customizations.join(', ')}
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Selectors */}
                      <div className="flex items-center gap-2 border border-surface-container-high rounded-xl p-1 bg-surface-container-low select-none">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="p-1 rounded-lg hover:bg-white text-on-surface transition-colors cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-headline text-on-surface w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="p-1 rounded-lg hover:bg-white text-on-surface transition-colors cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Item subtotal price */}
                      <span className="font-headline text-base text-on-surface">
                        ${(item.pricePerItem * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pricing calculations footer */}
          {cart.length > 0 && (
            <div className="border-t border-surface-container-high p-6 bg-surface-container-lowest flex flex-col gap-4">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center text-gray-500 font-medium">
                  <span>Subtotal:</span>
                  <span className="text-on-surface">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-gray-500 font-medium">
                  <span>VAT / Service Charge (10%):</span>
                  <span className="text-on-surface">${vat.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-gray-500 font-medium">
                  <span>Delivery Fee:</span>
                  {deliveryFee === 0 ? (
                    <span className="text-green-600 font-bold">FREE DELIVERY</span>
                  ) : (
                    <span className="text-on-surface">${deliveryFee.toFixed(2)}</span>
                  )}
                </div>
                <div className="flex justify-between items-center text-base font-bold text-on-surface border-t border-surface-container-low pt-2 mt-2">
                  <span>Total Due:</span>
                  <span className="text-xl font-headline text-primary">${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col gap-3 mt-2">
                <button
                  onClick={onCheckout}
                  className="w-full bg-primary hover:bg-primary-hover text-white font-headline text-base tracking-wider py-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                  id="cart-drawer-btn-checkout"
                >
                  PROCEED TO CHECKOUT
                </button>
                <div className="flex gap-3">
                  <button
                    onClick={onClearCart}
                    className="flex-1 bg-surface-container hover:bg-surface-container-high text-on-surface font-headline text-xs tracking-wider py-2.5 rounded-xl transition-colors cursor-pointer text-center"
                    id="cart-drawer-btn-clear"
                  >
                    CLEAR ALL
                  </button>
                  <button
                    onClick={onClose}
                    className="flex-1 border border-surface-container-high hover:bg-surface-container-low text-on-surface font-headline text-xs tracking-wider py-2.5 rounded-xl transition-colors cursor-pointer text-center"
                  >
                    CONTINUE SHOPPING
                  </button>
                </div>
              </div>

              {/* Security info */}
              <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-400 mt-1">
                <ShieldCheck className="w-4 h-4 text-green-600" /> SECURED 256-BIT SSL CHECKOUT
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

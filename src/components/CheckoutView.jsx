import React from 'react';
import { ShieldCheck, Truck, CreditCard, ShoppingBag, ArrowLeft, Check, AlertCircle, Loader2 } from 'lucide-react';
import { promoAPI } from '../services/api';

export const CheckoutView = ({
  cart,
  onBackToMenu,
  onPlaceOrder,
}) => {
  // Address form state
  const [fullName, setFullName] = React.useState('');
  const [streetAddress, setStreetAddress] = React.useState('');
  const [city, setCity] = React.useState('');
  const [postalCode, setPostalCode] = React.useState('');

  // Contact info state
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');

  // Payment State
  const [paymentMethod, setPaymentMethod] = React.useState('credit_card');
  const [cardNumber, setCardNumber] = React.useState('');
  const [expiryDate, setExpiryDate] = React.useState('');
  const [cvv, setCvv] = React.useState('');

  // Promo code state
  const [promoCode, setPromoCode] = React.useState('');
  const [appliedPromo, setAppliedPromo] = React.useState(null);
  const [promoError, setPromoError] = React.useState(null);
  const [discountPercent, setDiscountPercent] = React.useState(0);
  const [isValidatingPromo, setIsValidatingPromo] = React.useState(false);

  // Validation state
  const [validationErrors, setValidationErrors] = React.useState([]);

  // Calculation details
  const subtotal = cart.reduce((acc, item) => acc + item.pricePerItem * item.quantity, 0);
  const vat = subtotal * 0.10;
  const deliveryFee = subtotal > 40 || subtotal === 0 ? 0 : 5.00;
  const discountAmount = (subtotal + vat) * (discountPercent / 100);
  const finalTotal = subtotal + vat + deliveryFee - discountAmount;

  // Formatting helpers
  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').substring(0, 16);
    const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
    setCardNumber(formatted);
  };

  const handleExpiryDateChange = (e) => {
    let value = e.target.value.replace(/\D/g, '').substring(0, 4);
    if (value.length > 2) {
      value = `${value.substring(0, 2)}/${value.substring(2, 4)}`;
    }
    setExpiryDate(value);
  };

  const handleCvvChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').substring(0, 3);
    setCvv(value);
  };

  // Promo application (Syncs with Django /api/promos/validate/)
  const applyPromoCode = async () => {
    setPromoError(null);
    if (!promoCode.trim()) {
      setPromoError('Please enter a valid coupon code.');
      return;
    }

    setIsValidatingPromo(true);
    try {
      const result = await promoAPI.validatePromo(promoCode, subtotal);
      setAppliedPromo(result.code);
      setDiscountPercent(result.discountPercent);
    } catch (err) {
      setPromoError(err.message || 'Invalid coupon code! Try FAZDELIGHT for 15% off.');
    } finally {
      setIsValidatingPromo(false);
    }
  };

  // Form submit validation
  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = [];

    if (!fullName.trim()) errors.push('Full Name is required.');
    if (!streetAddress.trim()) errors.push('Street Address is required.');
    if (!city.trim()) errors.push('City is required.');
    if (!postalCode.trim()) errors.push('Postal / ZIP Code is required.');
    if (!email.trim() || !email.includes('@')) errors.push('A valid Email address is required.');
    if (!phone.trim() || phone.length < 7) errors.push('A valid Phone number is required.');

    if (paymentMethod === 'credit_card') {
      if (cardNumber.replace(/\s/g, '').length !== 16) errors.push('A valid 16-digit Card Number is required.');
      if (expiryDate.length !== 5) errors.push('A valid Expiry Date (MM/YY) is required.');
      if (cvv.length !== 3) errors.push('A valid 3-digit CVV is required.');
    }

    if (errors.length > 0) {
      setValidationErrors(errors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setValidationErrors([]);
    onPlaceOrder({
      address: { fullName, streetAddress, city, postalCode },
      contact: { email, phone },
      paymentMethod,
      promoCode: appliedPromo || '',
      discountAmount,
      finalTotal,
    });
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center" id="checkout-empty-state">
        <div className="w-20 h-20 bg-surface-container-low rounded-full flex items-center justify-center text-primary mx-auto mb-6">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="font-headline text-3xl text-on-surface">Your basket is empty</h2>
        <p className="text-gray-500 text-sm mt-2">
          You must add mouthwatering treats to your basket before you can proceed to checkout.
        </p>
        <button
          onClick={onBackToMenu}
          className="mt-8 bg-primary hover:bg-primary-hover text-white font-headline tracking-widest px-8 py-3.5 rounded-full shadow-md transition-all cursor-pointer"
        >
          EXPLORE OUR MENU
        </button>
      </div>
    );
  }

  return (
    <div className="py-12 bg-background min-h-screen" id="checkout-view-container">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb back button */}
        <button
          onClick={onBackToMenu}
          className="inline-flex items-center gap-2 text-on-surface/80 hover:text-primary font-bold text-sm tracking-wide mb-8 group cursor-pointer"
          id="checkout-back-btn"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> BACK TO MENU
        </button>

        {/* Validation Errors Header Banner */}
        {validationErrors.length > 0 && (
          <div className="mb-8 p-6 bg-red-50 border-l-4 border-red-600 rounded-2xl flex flex-col gap-2" id="checkout-errors">
            <div className="flex items-center gap-2 text-red-800 font-bold">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>Please review and fix the following issues to complete your order:</span>
            </div>
            <ul className="list-disc list-inside text-xs text-red-700 pl-2 space-y-1">
              {validationErrors.map((err, idx) => (
                <li key={idx}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Two-column layout */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* LEFT COLUMN: CUSTOMER DETAILS FORM */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            
            {/* DELIVERY ADDRESS */}
            <div className="bg-white rounded-[2.5rem] border border-surface-container-high p-8 shadow-sm">
              <h3 className="font-headline text-xl tracking-wider text-on-surface mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-2xl">local_shipping</span> 1. DELIVERY INFORMATION
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5" id="checkout-delivery-form">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">FULL NAME</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g., Alexander Mercer"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-surface-container-low border border-surface-container-high rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary text-on-surface"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">STREET ADDRESS / APT</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g., 42 High Street, Suite 5B"
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    className="w-full bg-surface-container-low border border-surface-container-high rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary text-on-surface"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">CITY</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g., New York"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-surface-container-low border border-surface-container-high rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary text-on-surface"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">POSTAL / ZIP CODE</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g., 10012"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full bg-surface-container-low border border-surface-container-high rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary text-on-surface"
                  />
                </div>
              </div>
            </div>

            {/* CONTACT INFORMATION */}
            <div className="bg-white rounded-[2.5rem] border border-surface-container-high p-8 shadow-sm">
              <h3 className="font-headline text-xl tracking-wider text-on-surface mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-2xl">call</span> 2. CONTACT DETAILS
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5" id="checkout-contact-form">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">EMAIL ADDRESS</label>
                  <input
                    type="email"
                    required
                    placeholder="alex@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-surface-container-low border border-surface-container-high rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary text-on-surface"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">MOBILE NUMBER</label>
                  <input
                    type="tel"
                    required
                    placeholder="+1 (555) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-surface-container-low border border-surface-container-high rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary text-on-surface"
                  />
                </div>
              </div>
            </div>

            {/* SECURE PAYMENT METHOD */}
            <div className="bg-white rounded-[2.5rem] border border-surface-container-high p-8 shadow-sm">
              <h3 className="font-headline text-xl tracking-wider text-on-surface mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-2xl">payment</span> 3. SECURE PAYMENT METHOD
              </h3>

              {/* Payment selector tabs */}
              <div className="grid grid-cols-3 gap-4 mb-6" id="checkout-payment-selector">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('credit_card')}
                  className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer select-none ${
                    paymentMethod === 'credit_card'
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-surface-container-high bg-white hover:bg-surface-container-low text-on-surface'
                  }`}
                >
                  <CreditCard className="w-6 h-6" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('paypal')}
                  className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer select-none ${
                    paymentMethod === 'paypal'
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-surface-container-high bg-white hover:bg-surface-container-low text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-2xl">payments</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider">PayPal</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('apple_pay')}
                  className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer select-none ${
                    paymentMethod === 'apple_pay'
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-surface-container-high bg-white hover:bg-surface-container-low text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-2xl font-bold">smartphone</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider">Apple Pay</span>
                </button>
              </div>

              {/* Credit Card Specific Inputs */}
              {paymentMethod === 'credit_card' ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 border-t border-surface-container-low pt-6 animate-in fade-in duration-300">
                  <div className="sm:col-span-3">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">CREDIT CARD NUMBER</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="4111 2222 3333 4444"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        className="w-full bg-surface-container-low border border-surface-container-high rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-primary text-on-surface"
                      />
                      <CreditCard className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">EXPIRY DATE</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={expiryDate}
                      onChange={handleExpiryDateChange}
                      className="w-full bg-surface-container-low border border-surface-container-high rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary text-on-surface"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">CVV / CVC</label>
                    <input
                      type="password"
                      placeholder="E.g., 123"
                      value={cvv}
                      onChange={handleCvvChange}
                      className="w-full bg-surface-container-low border border-surface-container-high rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary text-on-surface"
                    />
                  </div>
                </div>
              ) : (
                <div className="bg-surface-container-low border border-surface-container-high rounded-2xl p-6 text-center text-sm font-semibold text-gray-600 animate-in fade-in duration-300">
                  <span className="material-symbols-outlined text-primary text-3xl font-bold mb-2">lock</span>
                  <p>You will be securely redirected to your provider's window during confirmation.</p>
                </div>
              )}
            </div>

          </div>

          {/* RIGHT COLUMN: BASKET SUMMARY & CHECKOUT COST */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            
            {/* Basket Items Summary */}
            <div className="bg-white rounded-[2.5rem] border border-surface-container-high p-8 shadow-sm">
              <h3 className="font-headline text-xl tracking-wider text-on-surface mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-2xl">restaurant</span> YOUR ITEMS SUMMARY
              </h3>

              <div className="space-y-4 max-h-[240px] overflow-y-auto no-scrollbar pr-1 border-b border-surface-container-low pb-6 mb-6" id="checkout-summary-items">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center justify-between">
                    <div className="flex gap-3 items-center min-w-0">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-surface-container-low border shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-on-surface line-clamp-1">{item.name}</h4>
                        <span className="text-[10px] text-gray-500 font-bold block mt-0.5">Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <span className="font-headline text-sm text-on-surface shrink-0">${(item.pricePerItem * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Promo code block */}
              <div className="flex flex-col gap-2">
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">HAVE A COUPON CODE?</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter code (FAZDELIGHT)"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    disabled={!!appliedPromo}
                    className="flex-grow bg-surface-container-low border border-surface-container-high text-on-surface font-semibold placeholder-gray-400 text-xs rounded-xl px-4 focus:outline-none focus:border-primary disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={applyPromoCode}
                    disabled={!!appliedPromo || isValidatingPromo}
                    className="bg-primary hover:bg-primary-hover text-white text-xs font-headline tracking-widest px-6 py-3 rounded-xl shadow-sm transition-colors cursor-pointer disabled:opacity-50 shrink-0 flex items-center gap-1.5"
                    id="btn-apply-promo"
                  >
                    {isValidatingPromo ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        CHECKING...
                      </>
                    ) : (
                      'APPLY'
                    )}
                  </button>
                </div>
                
                {appliedPromo && (
                  <div className="text-xs text-green-600 font-bold flex items-center gap-1 mt-1">
                    <Check className="w-4 h-4 stroke-[3px]" /> Coupon code <b>FAZDELIGHT</b> applied successfully (15% off)!
                  </div>
                )}
                {promoError && (
                  <div className="text-xs text-primary font-bold flex items-center gap-1 mt-1">
                    <AlertCircle className="w-4 h-4 shrink-0" /> {promoError}
                  </div>
                )}
              </div>
            </div>

            {/* Price Calculations */}
            <div className="bg-white rounded-[2.5rem] border border-surface-container-high p-8 shadow-sm flex flex-col gap-4">
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between items-center text-gray-500 font-medium">
                  <span>Subtotal:</span>
                  <span className="text-on-surface">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-gray-500 font-medium">
                  <span>VAT / Service Charge (10%):</span>
                  <span className="text-on-surface">${vat.toFixed(2)}</span>
                </div>
                
                {appliedPromo && (
                  <div className="flex justify-between items-center text-green-600 font-bold">
                    <span>Discount (15% coupon):</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between items-center text-gray-500 font-medium">
                  <span>Delivery Service:</span>
                  {deliveryFee === 0 ? (
                    <span className="text-green-600 font-bold">FREE DELIVERY</span>
                  ) : (
                    <span className="text-on-surface">${deliveryFee.toFixed(2)}</span>
                  )}
                </div>

                <div className="flex justify-between items-center text-base font-bold text-on-surface border-t border-surface-container-low pt-3 mt-3">
                  <span>Total Due:</span>
                  <span className="text-2xl font-headline text-primary">${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* PLACE SECURE ORDER */}
              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-hover text-white font-headline text-lg tracking-wider py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer mt-2 transform hover:-translate-y-0.5"
                id="btn-place-order"
              >
                PLACE SECURE ORDER <ShieldCheck className="w-5 h-5" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-400 mt-2">
                <Truck className="w-4 h-4 text-primary" /> ESTIMATED ARRIVAL TIME: 20-25 MINS
              </div>
            </div>

          </div>

        </form>
      </div>
    </div>
  );
};

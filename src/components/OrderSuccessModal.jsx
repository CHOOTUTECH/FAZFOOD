import React from 'react';
import { Sparkles, Calendar, Check, ArrowRight, ShieldCheck, Star, Heart } from 'lucide-react';
import { reviewsAPI } from '../services/api';

export const OrderSuccessModal = ({
  isOpen,
  onClose,
  orderDetails,
  cart,
}) => {
  const [rating, setRating] = React.useState(0);
  const [hoverRating, setHoverRating] = React.useState(0);
  const [comment, setComment] = React.useState('');
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  // Reset states on mount or when orderDetails changes
  React.useEffect(() => {
    if (isOpen) {
      setRating(0);
      setHoverRating(0);
      setComment('');
      setIsSubmitted(false);
    }
  }, [isOpen]);

  if (!isOpen || !orderDetails) return null;

  // Generate random order details for high immersion!
  const orderNumber = React.useMemo(() => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const num = Math.floor(1000 + Math.random() * 9000);
    const code = Array.from({ length: 3 }, () => letters[Math.floor(Math.random() * letters.length)]).join('');
    return `FAZ-${num}-${code}`;
  }, [isOpen]);

  const dateStr = React.useMemo(() => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }, [isOpen]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (rating === 0) return;

    const newReview = {
      id: Math.random().toString(36).substring(2, 9),
      orderNumber,
      rating,
      comment,
      date: new Date().toISOString(),
      items: cart.map((item) => item.name),
    };

    // Save review to Django API (with automatic local storage fallback)
    try {
      await reviewsAPI.submitReview(newReview);
    } catch (err) {
      console.error('Error submitting review:', err);
    }

    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto" id="order-success-modal">
      {/* Heavy Blur Backdrop */}
      <div 
        onClick={onClose} 
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300" 
      />

      {/* Main card panel */}
      <div className="relative bg-white rounded-[2.5rem] border border-surface-container-high shadow-2xl w-full max-w-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-300">
        
        {/* Banner with celebrate illustrations */}
        <div className="bg-primary text-white p-8 text-center relative overflow-hidden flex flex-col items-center">
          {/* Decorative glowing backplate */}
          <div className="absolute w-80 h-80 rounded-full bg-secondary-container/20 blur-3xl pointer-events-none" />
          
          <div className="w-16 h-16 rounded-full bg-white text-primary flex items-center justify-center shadow-lg mb-4 animate-bounce">
            <Check className="w-8 h-8 stroke-[3.5px]" />
          </div>

          <span className="text-[10px] bg-secondary-container text-on-secondary-container font-headline tracking-widest px-4 py-1.5 rounded-full shadow-sm flex items-center gap-1 uppercase">
            <Sparkles className="w-3.5 h-3.5 fill-on-secondary-container" /> ORDER CONFIRMED
          </span>

          <h2 className="font-headline text-3xl sm:text-4xl text-white mt-3 tracking-wide">
            Double the Fun is on the Way!
          </h2>
          <p className="text-white/80 text-xs mt-1.5 max-w-sm">
            Your flame-grilled chef selection has been prepped and handed over to our express delivery rider.
          </p>
        </div>

        {/* Info Grid */}
        <div className="p-8 space-y-6">
          
          {/* Metadata Block */}
          <div className="grid grid-cols-2 gap-4 border-b border-surface-container-low pb-6">
            <div>
              <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">ORDER NUMBER</div>
              <div className="text-sm font-headline text-on-surface tracking-wider font-mono">{orderNumber}</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">ESTIMATED DELIVERY</div>
              <div className="text-sm font-headline text-green-600">20-25 MINS (HOT & FRESH)</div>
            </div>
          </div>

          {/* Delivery & Rider tracker progress simulation */}
          <div className="bg-surface-container-low rounded-2xl p-5 border border-surface-container-high">
            <div className="flex items-center justify-between mb-3 text-xs font-bold text-gray-600">
              <span className="flex items-center gap-1"><span className="material-symbols-outlined text-primary text-base">delivery_dining</span> Delivery Route</span>
              <span className="text-primary">Preparing...</span>
            </div>
            
            {/* Real Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
              <div className="bg-primary h-full rounded-full animate-pulse" style={{ width: '25%' }} />
            </div>

            <div className="grid grid-cols-4 text-[9px] font-bold text-gray-400 mt-2 text-center">
              <span className="text-primary">Prepping</span>
              <span>Grilling</span>
              <span>On Route</span>
              <span>Arrived</span>
            </div>
          </div>

          {/* Order Details Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6 border-b border-surface-container-low">
            
            {/* Delivery address */}
            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">DELIVERY ADDRESS</h3>
              <div className="text-xs text-on-surface space-y-1">
                <p className="font-bold">{orderDetails.address.fullName}</p>
                <p className="text-gray-600">{orderDetails.address.streetAddress}</p>
                <p className="text-gray-600">{orderDetails.address.city}, {orderDetails.address.postalCode}</p>
              </div>
            </div>

            {/* Contact info and payment */}
            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">CONTACT & PAYMENT</h3>
              <div className="text-xs text-on-surface space-y-1">
                <p className="text-gray-600"><span className="font-semibold text-gray-500">Phone:</span> {orderDetails.contact.phone}</p>
                <p className="text-gray-600"><span className="font-semibold text-gray-500">Email:</span> {orderDetails.contact.email}</p>
                <p className="text-gray-600 uppercase mt-1 inline-flex items-center gap-1 text-[10px] bg-surface-container px-2 py-0.5 rounded font-bold text-on-surface/80">
                  <ShieldCheck className="w-3.5 h-3.5 text-green-600" /> {orderDetails.paymentMethod.replace('_', ' ')}
                </p>
              </div>
            </div>

          </div>

          {/* Items Summary list */}
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">ITEMS PURCHASED</h3>
            <div className="space-y-3 max-h-[140px] overflow-y-auto no-scrollbar pr-1 border-b border-surface-container-low pb-4">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center text-xs">
                  <span className="font-bold text-on-surface">
                    {item.quantity}x <span className="font-medium text-gray-700">{item.name}</span>
                  </span>
                  <span className="font-headline text-on-surface">${(item.pricePerItem * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing breakdown total */}
          <div className="flex justify-between items-center pt-2">
            <div>
              <div className="text-[10px] text-gray-400 font-bold uppercase">PAID GRAND TOTAL</div>
              <div className="text-sm text-gray-500 flex items-center gap-1.5 mt-0.5">
                <Calendar className="w-4 h-4" /> {dateStr}
              </div>
            </div>
            <div className="text-right">
              <span className="font-headline text-3xl text-primary">${orderDetails.finalTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Rating and Review Section */}
          <div className="border border-surface-container-high rounded-2xl p-5 bg-surface-container-lowest/50" id="rating-review-section">
            {!isSubmitted ? (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div className="flex flex-col items-center text-center space-y-2">
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Rate Your Meal & Experience
                  </h4>
                  <p className="text-xs text-gray-600">
                    Let us know how we did! Your feedback helps us make every bite perfect.
                  </p>
                  
                  {/* Star Icons Grid */}
                  <div className="flex gap-1.5 py-1">
                    {[1, 2, 3, 4, 5].map((starValue) => {
                      const active = starValue <= (hoverRating || rating);
                      return (
                        <button
                          key={starValue}
                          type="button"
                          onClick={() => setRating(starValue)}
                          onMouseEnter={() => setHoverRating(starValue)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="p-1 focus:outline-none transition-transform duration-100 hover:scale-125 cursor-pointer"
                          aria-label={`Rate ${starValue} stars`}
                          id={`star-btn-${starValue}`}
                        >
                          <Star
                            className={`w-8 h-8 transition-colors ${
                              active
                                ? 'fill-amber-400 text-amber-400 drop-shadow-sm'
                                : 'text-gray-300 hover:text-amber-300'
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                  {rating > 0 && (
                    <span className="text-xs font-bold text-amber-600 uppercase tracking-wider animate-pulse">
                      {rating === 5 ? 'Legendary! 🌟' : rating === 4 ? 'Great! 👍' : rating === 3 ? 'Good! 🙂' : rating === 2 ? 'Needs Work' : 'Disappointed'}
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="review-textarea" className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    Add a Review (Optional)
                  </label>
                  <textarea
                    id="review-textarea"
                    rows={2}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell us what you loved, or what we can grill better next time..."
                    className="w-full text-xs p-3 rounded-xl border border-surface-container-high bg-white text-on-surface focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder-gray-400 resize-none transition-all duration-200"
                    maxLength={250}
                  />
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-gray-400">
                      {comment.length}/250 characters
                    </span>
                    <button
                      type="submit"
                      disabled={rating === 0}
                      className={`text-xs font-bold px-4 py-2 rounded-xl transition-all duration-300 flex items-center gap-1.5 ${
                        rating > 0
                          ? 'bg-primary text-white cursor-pointer hover:bg-primary-hover shadow-sm'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                      id="submit-review-btn"
                    >
                      Submit Feedback
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="flex flex-col items-center text-center p-4 space-y-2 animate-in fade-in zoom-in duration-300">
                <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center mb-1">
                  <Heart className="w-5 h-5 fill-current text-green-600 animate-pulse" />
                </div>
                <h4 className="font-headline text-lg text-on-surface">
                  Feedback Received!
                </h4>
                <p className="text-xs text-gray-600 max-w-sm">
                  Thank you! Your rating and comments have been sent directly to our kitchen staff. We really appreciate your feedback!
                </p>
              </div>
            )}
          </div>

          {/* CTA returns to menu */}
          <button
            onClick={onClose}
            className="w-full bg-primary hover:bg-primary-hover text-white font-headline text-lg tracking-wider py-4 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer mt-4"
            id="order-success-return-btn"
          >
            ORDER MORE SAVORY TREATS <ArrowRight className="w-5 h-5" />
          </button>

        </div>
      </div>
    </div>
  );
};

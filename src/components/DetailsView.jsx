import React from 'react';
import { Star, Minus, Plus, ShoppingBag, ArrowLeft, Check } from 'lucide-react';
import { MENU_ITEMS } from '../data';

export const DetailsView = ({
  product,
  onBack,
  onAddToCart,
}) => {
  const [size, setSize] = React.useState('SINGLE');
  const [selectedAddons, setSelectedAddons] = React.useState([]);
  const [quantity, setQuantity] = React.useState(1);
  const [successAnimation, setSuccessAnimation] = React.useState(false);

  // Define premium addons prices
  const ADDONS_PRICES = {
    'Extra Aged Cheddar Cheese': 1.50,
    'Applewood Crispy Bacon': 2.00,
    'Caramelized Onions': 1.00,
    'Spicy Jalapeno Slices': 0.75,
    'Extra Pickles': 0.50,
    'Sunny-Side Fried Egg': 1.50,
  };

  const addonsList = Object.keys(ADDONS_PRICES);

  // Size premiums
  const sizePremium = size === 'DOUBLE' ? 3.50 : size === 'TRIPLE' ? 6.50 : 0;

  // Single Item price
  const addonsTotal = selectedAddons.reduce((acc, ad) => acc + (ADDONS_PRICES[ad] || 0), 0);
  const pricePerItem = product.price + sizePremium + addonsTotal;
  const totalPrice = pricePerItem * quantity;

  // Handles addon checkboxes
  const toggleAddon = (addon) => {
    if (selectedAddons.includes(addon)) {
      setSelectedAddons(selectedAddons.filter((item) => item !== addon));
    } else {
      setSelectedAddons([...selectedAddons, addon]);
    }
  };

  // Up-sells: we recommend french-fries, onion-rings, soft-drink, milkshake
  const upsellIds = ['french-fries', 'onion-rings', 'soft-drink', 'milkshake'];
  const upsellItems = MENU_ITEMS.filter((item) => upsellIds.includes(item.id));

  const handleAddProductToCart = () => {
    const cartItemId = `${product.id}-${size}-${selectedAddons.sort().join(',')}`;
    const cartItem = {
      id: cartItemId,
      menuItemId: product.id,
      name: `${product.name} (${size})`,
      basePrice: product.price,
      pricePerItem: pricePerItem,
      quantity: quantity,
      size: size,
      customizations: selectedAddons,
      image: product.image,
    };
    onAddToCart(cartItem);
    setSuccessAnimation(true);
    setTimeout(() => {
      setSuccessAnimation(false);
    }, 2000);
  };

  const handleAddUpsellToCart = (item) => {
    const cartItemId = `${item.id}-SINGLE-`;
    const cartItem = {
      id: cartItemId,
      menuItemId: item.id,
      name: item.name,
      basePrice: item.price,
      pricePerItem: item.price,
      quantity: 1,
      size: 'SINGLE',
      customizations: [],
      image: item.image,
    };
    onAddToCart(cartItem);
  };

  // Default nutrition values if none provided
  const nutrition = product.nutritionFacts || {
    calories: '420 kcal',
    totalFat: '18g',
    saturatedFat: '7g',
    cholesterol: '65mg',
    sodium: '780mg',
    carbohydrates: '34g',
    fiber: '2g',
    sugars: '5g',
    protein: '22g',
  };

  const ingredientsText = product.ingredients || 'Freshly prepped locally sourced artisanal bread bun, fresh crisp garden greens, select farm produce, hand-blended chef sauces, seasonings.';

  return (
    <div className="py-12 bg-background" id="details-view-container">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Link Button */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-on-surface/80 hover:text-primary font-bold text-sm tracking-wide mb-8 group cursor-pointer"
          id="details-back-btn"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> BACK TO MENU
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* LEFT COLUMN: GORGEOUS GRAPHIC, INGREDIENTS & NUTRITIONS */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            
            {/* Visual presentation card */}
            <div className="bg-white rounded-[2.5rem] border border-surface-container-high p-8 shadow-sm flex items-center justify-center relative overflow-hidden h-[300px] sm:h-[400px]">
              {/* Spinning radial background */}
              <div className="absolute w-[300px] h-[300px] rounded-full border border-dashed border-primary/20 animate-spin" style={{ animationDuration: '60s' }} />
              {/* Blur backdrop glow */}
              <div className="absolute w-44 h-44 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
              
              <img
                src={product.image}
                alt={product.name}
                className="w-[240px] sm:w-[320px] h-auto object-contain z-10 floating drop-shadow-[0_20px_30px_rgba(169,0,16,0.25)]"
                referrerPolicy="no-referrer"
              />

              {product.isChefChoice && (
                <span className="absolute top-6 left-6 bg-secondary-container text-on-secondary-container text-xs font-headline tracking-widest uppercase px-4 py-2 rounded-2xl shadow-md">
                  ★ Chef Spec
                </span>
              )}
            </div>

            {/* Ingredients block */}
            <div className="bg-white rounded-3xl border border-surface-container-high p-6 shadow-sm">
              <h3 className="font-headline text-lg tracking-wider text-on-surface mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">grocery</span> RAW INGREDIENTS
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                {ingredientsText}
              </p>
            </div>

            {/* Nutrition Facts block */}
            <div className="bg-white rounded-3xl border border-surface-container-high p-6 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-surface-container-high mb-4">
                <h3 className="font-headline text-lg tracking-wider text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-xl">nutrition</span> NUTRITION FACTS
                </h3>
                <span className="text-[10px] text-gray-400 font-bold">PER PORTION</span>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-2.5 bg-surface-container-low rounded-2xl">
                  <div className="text-[10px] text-gray-500 font-bold uppercase">Calories</div>
                  <div className="text-sm font-headline text-on-surface mt-0.5">{nutrition.calories}</div>
                </div>
                <div className="p-2.5 bg-surface-container-low rounded-2xl">
                  <div className="text-[10px] text-gray-500 font-bold uppercase">Protein</div>
                  <div className="text-sm font-headline text-on-surface mt-0.5">{nutrition.protein}</div>
                </div>
                <div className="p-2.5 bg-surface-container-low rounded-2xl">
                  <div className="text-[10px] text-gray-500 font-bold uppercase">Total Fat</div>
                  <div className="text-sm font-headline text-on-surface mt-0.5">{nutrition.totalFat}</div>
                </div>
                <div className="p-2.5 bg-surface-container-low rounded-2xl">
                  <div className="text-[10px] text-gray-500 font-bold uppercase">Carbs</div>
                  <div className="text-sm font-headline text-on-surface mt-0.5">{nutrition.carbohydrates}</div>
                </div>
                <div className="p-2.5 bg-surface-container-low rounded-2xl">
                  <div className="text-[10px] text-gray-500 font-bold uppercase">Sodium</div>
                  <div className="text-sm font-headline text-on-surface mt-0.5">{nutrition.sodium}</div>
                </div>
                <div className="p-2.5 bg-surface-container-low rounded-2xl">
                  <div className="text-[10px] text-gray-500 font-bold uppercase">Sugars</div>
                  <div className="text-sm font-headline text-on-surface mt-0.5">{nutrition.sugars}</div>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: CONFIGURATION / CUSTOMIZATION */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            
            {/* Base Product Info */}
            <div className="bg-white rounded-[2.5rem] border border-surface-container-high p-8 shadow-sm">
              <div className="flex flex-wrap items-center gap-2 mb-3 text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < product.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                ))}
                <span className="text-xs text-gray-500 font-bold ml-1">({product.reviewsCount} customer reviews)</span>
              </div>
              <h1 className="font-headline text-3xl sm:text-4xl text-on-surface tracking-wide">
                {product.name}
              </h1>
              <p className="text-gray-600 text-sm leading-relaxed mt-3">
                {product.description}
              </p>
            </div>

            {/* SIZE CONFIGURATION */}
            {product.category === 'burgers' && (
              <div className="bg-white rounded-[2.5rem] border border-surface-container-high p-8 shadow-sm">
                <h3 className="font-headline text-lg tracking-wider text-on-surface mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-xl">layers</span> CHOOSE SIZE / PATTY COUNT
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" id="details-size-selector">
                  <button
                    onClick={() => setSize('SINGLE')}
                    className={`p-4 rounded-2xl border text-left flex flex-col justify-between h-28 transition-all duration-300 cursor-pointer ${
                      size === 'SINGLE'
                        ? 'border-primary bg-primary/5 shadow-md'
                        : 'border-surface-container-high bg-white hover:bg-surface-container-low'
                    }`}
                  >
                    <span className="text-xs font-bold text-gray-500">SINGLE PATTY</span>
                    <div className="flex flex-col">
                      <span className="font-headline text-lg text-on-surface">Standard</span>
                      <span className="text-[11px] font-bold text-gray-400 mt-0.5">Base price</span>
                    </div>
                  </button>

                  <button
                    onClick={() => setSize('DOUBLE')}
                    className={`p-4 rounded-2xl border text-left flex flex-col justify-between h-28 transition-all duration-300 cursor-pointer ${
                      size === 'DOUBLE'
                        ? 'border-primary bg-primary/5 shadow-md'
                        : 'border-surface-container-high bg-white hover:bg-surface-container-low'
                    }`}
                  >
                    <span className="text-xs font-bold text-gray-500">DOUBLE PATTY</span>
                    <div className="flex flex-col">
                      <span className="font-headline text-lg text-on-surface">Double Up</span>
                      <span className="text-[11px] font-bold text-primary mt-0.5">+$3.50 extra</span>
                    </div>
                  </button>

                  <button
                    onClick={() => setSize('TRIPLE')}
                    className={`p-4 rounded-2xl border text-left flex flex-col justify-between h-28 transition-all duration-300 cursor-pointer ${
                      size === 'TRIPLE'
                        ? 'border-primary bg-primary/5 shadow-md'
                        : 'border-surface-container-high bg-white hover:bg-surface-container-low'
                    }`}
                  >
                    <span className="text-xs font-bold text-gray-500">TRIPLE MONSTER</span>
                    <div className="flex flex-col">
                      <span className="font-headline text-lg text-on-surface">Triple Stack</span>
                      <span className="text-[11px] font-bold text-primary mt-0.5">+$6.50 extra</span>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* ADD-ONS PREMIUM CHECKLIST */}
            {product.category === 'burgers' && (
              <div className="bg-white rounded-[2.5rem] border border-surface-container-high p-8 shadow-sm">
                <h3 className="font-headline text-lg tracking-wider text-on-surface mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-xl">add_circle</span> CUSTOMIZE ADD-ONS
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" id="details-addons-list">
                  {addonsList.map((addon) => {
                    const isSelected = selectedAddons.includes(addon);
                    return (
                      <div
                        key={addon}
                        onClick={() => toggleAddon(addon)}
                        className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all duration-300 select-none ${
                          isSelected
                            ? 'border-primary bg-primary/5 shadow-sm'
                            : 'border-surface-container-high bg-white hover:bg-surface-container-low'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all duration-200 ${
                            isSelected ? 'bg-primary border-primary text-white' : 'border-gray-300 bg-white'
                          }`}>
                            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3px]" />}
                          </div>
                          <span className="text-xs font-bold text-on-surface/80">{addon}</span>
                        </div>
                        <span className="text-xs font-headline text-primary">+${ADDONS_PRICES[addon].toFixed(2)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SUMMARY BAR & ADD TO BASKET */}
            <div className="bg-white rounded-[2.5rem] border border-surface-container-high p-8 shadow-sm flex flex-col sm:flex-row gap-6 justify-between items-center">
              
              {/* Quantity */}
              <div className="flex items-center gap-4 border border-surface-container-high rounded-2xl p-2 bg-surface-container-low select-none">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2.5 rounded-xl hover:bg-white text-on-surface transition-colors cursor-pointer"
                  id="btn-qty-minus"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-headline text-lg text-on-surface px-2 w-8 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2.5 rounded-xl hover:bg-white text-on-surface transition-colors cursor-pointer"
                  id="btn-qty-plus"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Price subtotal and ADD TO BASKET */}
              <div className="flex flex-col items-center sm:items-end gap-1 text-center sm:text-right">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">TOTAL CALCULATED PRICE</span>
                <span className="font-headline text-3xl text-on-surface">${totalPrice.toFixed(2)}</span>
              </div>

              <button
                onClick={handleAddProductToCart}
                disabled={successAnimation}
                className={`w-full sm:w-auto font-headline text-lg tracking-wider px-8 py-4 rounded-2xl transition-all duration-300 shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                  successAnimation
                    ? 'bg-green-600 hover:bg-green-700 text-white shadow-inner scale-98'
                    : 'bg-primary hover:bg-primary-hover text-white hover:shadow-lg'
                }`}
                id="btn-add-to-basket"
              >
                {successAnimation ? (
                  <>
                    <Check className="w-5 h-5 stroke-[3px]" /> ADDED TO BASKET
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" /> ADD TO BASKET
                  </>
                )}
              </button>
            </div>

            {/* UP-SELL PANEL (PAIR IT WITH) */}
            <div className="bg-white rounded-[2.5rem] border border-surface-container-high p-8 shadow-sm">
              <h3 className="font-headline text-lg tracking-wider text-on-surface mb-5 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">restaurant</span> MAKE IT A DELUXE MEAL?
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6" id="details-upsells">
                {upsellItems.map((item) => (
                  <div
                    key={item.id}
                    className="border border-surface-container-high rounded-2xl p-4 flex flex-col justify-between gap-3 text-center hover:shadow-md transition-shadow relative group"
                  >
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-surface-container-low mx-auto p-1 border border-surface-container-low">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-on-surface line-clamp-1">{item.name}</h4>
                      <span className="font-headline text-xs text-primary mt-0.5 block">${item.price.toFixed(2)}</span>
                    </div>
                    <button
                      onClick={() => handleAddUpsellToCart(item)}
                      className="bg-surface-container-low hover:bg-primary hover:text-white text-on-surface text-[10px] font-bold py-2 rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center gap-1 border border-surface-container-high hover:border-primary"
                    >
                      ADD +
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

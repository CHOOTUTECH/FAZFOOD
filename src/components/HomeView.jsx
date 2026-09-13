import React from 'react';
import { Star, Flame, ArrowRight, ShieldCheck, Clock, Award, Leaf, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { MENU_ITEMS, CATEGORIES } from '../data';

export const HomeView = ({
  setActiveView,
  setSelectedCategory,
  onSelectProduct,
  menuItems = MENU_ITEMS,
}) => {
  const popularItems = (menuItems || MENU_ITEMS).filter(item => item.isPopular || item.isChefChoice);

  return (
    <div className="flex flex-col min-h-screen bg-background" id="home-view-container">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-primary/5 via-white to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="flex flex-col gap-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 self-center lg:self-start bg-primary/10 border border-primary/20 px-4 py-2 rounded-full text-primary text-xs font-bold tracking-widest uppercase">
                <Flame className="w-4 h-4 fill-primary" /> Fastest Delivery in NYC
              </div>
              <h1 className="font-headline text-5xl sm:text-6xl lg:text-7xl leading-tight text-on-surface tracking-tight">
                Double the Fun,<br />
                <span className="text-primary">Half the Wait!</span>
              </h1>
              <p className="text-gray-600 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Craving high-octane flavor? Sink your teeth into flame-grilled perfection. Handcrafted artisanal brioche, 100% grass-fed premium Angus beef, and our secretive sauces. Delivered blazing hot to your door within 20 minutes.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mt-4">
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setActiveView('menu');
                  }}
                  className="w-full sm:w-auto bg-primary hover:bg-primary-hover text-white font-headline text-lg tracking-wider px-8 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  id="hero-btn-order-now"
                >
                  ORDER NOW
                </button>
                <button
                  onClick={() => {
                    setSelectedCategory('burgers');
                    setActiveView('menu');
                  }}
                  className="w-full sm:w-auto bg-white border border-surface-container-highest hover:bg-surface-container-low text-on-surface font-headline text-lg tracking-wider px-8 py-4 rounded-full transition-all duration-300 shadow-sm"
                  id="hero-btn-view-menu"
                >
                  SEE MENU
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-surface-container-high mt-6">
                <div>
                  <div className="text-2xl sm:text-3xl font-headline text-primary">50+</div>
                  <div className="text-xs text-gray-500 font-medium">Tasty Options</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-headline text-primary">20 MIN</div>
                  <div className="text-xs text-gray-500 font-medium">Free Delivery</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-headline text-primary">4.9 ★</div>
                  <div className="text-xs text-gray-500 font-medium">Gourmet Rating</div>
                </div>
              </div>
            </div>

            {/* Right Graphic */}
            <div className="relative flex justify-center items-center">
              {/* Outer decorative ring */}
              <div className="absolute w-[320px] h-[320px] sm:w-[450px] sm:h-[450px] rounded-full border-2 border-dashed border-primary/20 animate-spin" style={{ animationDuration: '40s' }} />
              {/* Glowing backplate */}
              <div className="absolute w-[240px] h-[240px] sm:w-[350px] sm:h-[350px] rounded-full bg-secondary-container/25 blur-3xl" />
              
              {/* Prominent floating burger */}
              <div className="relative z-10 floating cursor-pointer group" onClick={() => {
                const burger = MENU_ITEMS.find(i => i.id === 'grilled-beef-burger');
                if (burger) onSelectProduct(burger);
              }}>
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBDCK06XHyfeHEekaVDGSgMXUvyIifQaqrWPxlpXflCX6_-uXmehSbadXgXZaJZf9tvyR4rYUbgGrtJhb-k4RXS_HFrKS3xrJE_MiRqEV1gebK2zsHfWvcJsXj_q8lHQbk-uh4UHBlCP3NyGLp8iCt-8zwIO0rrusYeI1jbJWpDsCQBcair5SRi9mNQuihVd-euVz8cnAlVbFgpHUh3X-o7IkBMihpEpq6McelT5aXhTtArMBk9q44Dq0GP4FTl7zSEzGZVjvzzqS8"
                  alt="Signature Grilled Beef Burger"
                  className="w-[280px] sm:w-[420px] h-auto object-contain drop-shadow-[0_25px_35px_rgba(169,0,16,0.35)] group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                
                {/* Floating tags */}
                <div className="absolute -top-4 -left-4 sm:top-4 sm:-left-4 bg-white border border-surface-container-highest px-3 py-1.5 rounded-2xl shadow-xl flex items-center gap-1.5 animate-bounce">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-bold text-on-surface">5.0 Star Rated</span>
                </div>

                <div className="absolute bottom-6 -right-4 bg-primary text-white px-4 py-2 rounded-2xl shadow-xl flex flex-col items-center">
                  <span className="text-[10px] font-bold tracking-widest uppercase opacity-75">ONLY</span>
                  <span className="text-lg font-headline">$12.99</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BADGES SECTION */}
      <section className="py-16 bg-gradient-to-b from-background to-white" id="home-trust-badges">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-4">
            
            {/* Trust Badge 1: Fresh Ingredients */}
            <div className="relative group bg-white border border-surface-container-high rounded-3xl p-8 flex flex-col items-center text-center gap-4 transition-all duration-300 hover:shadow-xl hover:border-green-500/30 transform hover:-translate-y-1">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-2xl bg-green-500/10 text-green-600 flex items-center justify-center border border-green-500/20 group-hover:bg-green-500 group-hover:text-white transition-all duration-300 shadow-md">
                <Leaf className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="mt-4 flex flex-col items-center gap-2">
                <span className="text-[10px] bg-green-50 text-green-700 font-headline font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-green-100">
                  100% FARM FRESH
                </span>
                <h3 className="font-headline text-xl text-on-surface tracking-wide mt-1">Fresh Ingredients</h3>
                <p className="text-gray-500 text-xs leading-relaxed max-w-sm">
                  We partner directly with family farms in NY to source organic crisp produce, artisanal fresh brioche, and 100% grass-fed premium Angus beef daily. Never frozen, pure food bliss.
                </p>
              </div>
            </div>

            {/* Trust Badge 2: Speedy Delivery */}
            <div className="relative group bg-white border border-surface-container-high rounded-3xl p-8 flex flex-col items-center text-center gap-4 transition-all duration-300 hover:shadow-xl hover:border-primary/30 transform hover:-translate-y-1">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-md">
                <Zap className="w-6 h-6 fill-current group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="mt-4 flex flex-col items-center gap-2">
                <span className="text-[10px] bg-primary/10 text-primary font-headline font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-primary/20">
                  20-MIN SUPERCHARGED
                </span>
                <h3 className="font-headline text-xl text-on-surface tracking-wide mt-1">Speedy Delivery</h3>
                <p className="text-gray-500 text-xs leading-relaxed max-w-sm">
                  Armed with state-of-the-art heat-locking induction thermal backpacks, our fast-dispatch fleet races to your door in under 20 minutes. Hot, fresh, and incredibly sizzling!
                </p>
              </div>
            </div>

            {/* Trust Badge 3: Elite Hygiene & Safety */}
            <div className="relative group bg-white border border-surface-container-high rounded-3xl p-8 flex flex-col items-center text-center gap-4 transition-all duration-300 hover:shadow-xl hover:border-amber-500/30 transform hover:-translate-y-1">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center border border-amber-500/20 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300 shadow-md">
                <ShieldCheck className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="mt-4 flex flex-col items-center gap-2">
                <span className="text-[10px] bg-amber-50 text-amber-700 font-headline font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-amber-100">
                  GOURMET CERTIFIED
                </span>
                <h3 className="font-headline text-xl text-on-surface tracking-wide mt-1">Guaranteed Safety</h3>
                <p className="text-gray-500 text-xs leading-relaxed max-w-sm">
                  Our professional chefs adhere to global food safety standards. Equipped with 100% contactless dispatch, eco-friendly secure seals, and transparent tracking.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CATEGORIES SECTION (Circular Cards) */}
      <section className="py-12 bg-white border-y border-surface-container-high" id="home-categories">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-headline text-center text-3xl tracking-wide text-on-surface mb-10">
            EXPLORE OUR CRAVINGS
          </h2>

          <div className="flex overflow-x-auto gap-6 sm:gap-10 pb-4 no-scrollbar justify-start md:justify-center items-center">
            {CATEGORIES.map((category) => (
              <div
                key={category.id}
                onClick={() => {
                  setSelectedCategory(category.id);
                  setActiveView('menu');
                }}
                className="flex flex-col items-center gap-3 shrink-0 cursor-pointer group"
                id={`cat-card-${category.id}`}
              >
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-surface-container-low border border-surface-container-high p-2 flex items-center justify-center shadow-sm group-hover:shadow-md group-hover:border-primary/40 transition-all duration-300 transform group-hover:scale-105">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover rounded-full"
                    referrerPolicy="no-referrer"
                  />
                  {/* Subtle red overlay circle */}
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-300" />
                </div>
                <span className="text-sm font-bold text-on-surface/80 group-hover:text-primary transition-colors tracking-wide">
                  {category.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TODAY'S SPECIALS / CHEF'S CHOICE */}
      <section className="py-20" id="home-specials">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-end gap-4 mb-12">
            <div>
              <div className="text-primary text-xs font-bold tracking-widest uppercase mb-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm font-bold">restaurant_menu</span> CHEF'S EXPERTISE
              </div>
              <h2 className="font-headline text-4xl text-on-surface tracking-wide">
                TODAY'S GOURMET SPECIALS
              </h2>
            </div>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setActiveView('menu');
              }}
              className="group flex items-center gap-1 text-primary hover:text-primary-hover font-bold text-sm tracking-wide transition-colors cursor-pointer"
            >
              See Full Menu <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {popularItems.slice(0, 4).map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -6, transition: { duration: 0.2, ease: "easeOut" } }}
                transition={{ 
                  duration: 0.4, 
                  ease: [0.16, 1, 0.3, 1], 
                  delay: index * 0.04 
                }}
                onClick={() => onSelectProduct(item)}
                className="bg-white rounded-3xl border border-surface-container-high hover:border-primary/20 overflow-hidden shadow-sm hover:shadow-xl flex flex-col group cursor-pointer transition-colors duration-300"
                id={`special-card-${item.id}`}
              >
                {/* Image & Badge Container */}
                <div className="relative pt-[70%] bg-surface-container-low overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  {/* Category overlay label */}
                  <span className="absolute top-4 left-4 bg-black/75 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                    {item.category}
                  </span>
                  {item.isChefChoice && (
                    <span className="absolute top-4 right-4 bg-secondary-container text-on-secondary-container text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3 fill-on-secondary-container" /> Chef's Choice
                    </span>
                  )}
                </div>

                {/* Body Details */}
                <div className="p-6 flex flex-col flex-grow justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-1 mb-2 text-yellow-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < item.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} />
                      ))}
                      <span className="text-xs text-gray-500 font-bold ml-1">({item.reviewsCount})</span>
                    </div>
                    <h3 className="font-headline text-lg tracking-wide text-on-surface group-hover:text-primary transition-colors line-clamp-1">
                      {item.name}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-surface-container-low pt-4">
                    <span className="font-headline text-xl text-on-surface">${Number(item.price).toFixed(2)}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectProduct(item);
                      }}
                      className="bg-primary hover:bg-primary-hover text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-md transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      CUSTOMIZE <span className="material-symbols-outlined text-sm">tune</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FLOATING FRENCH FRIES SATISFY CRAVINGS BANNER */}
      <section className="py-12 bg-white overflow-hidden border-y border-surface-container-high" id="home-floating-fries-banner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-inverse-surface rounded-[2.5rem] p-8 sm:p-12 lg:p-16 relative overflow-hidden flex flex-col lg:flex-row items-center gap-12 shadow-2xl">
            {/* Glowing spot background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/20 blur-3xl pointer-events-none" />

            {/* Left Image column (blazing hot fries floating) */}
            <div className="relative w-full lg:w-1/2 flex justify-center items-center">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAN_sfr3rSt25seTBTAIQVt8xbOWk57_QRI92o7U3ok_DEmUxcicxh769yhGbF7tvPgEL6AyanBXfGupcZs4hDZBaHNQ9d1pWPd4e8o1Rc8WbuFQmotUuDAjw__dXrFbdgptSF38cTx0s5wc0fAmof0L33bRqhrcJ23g-BgRJrU163x3wqKTAnze7rpIODoePF_CQ_UCxAvKh71Icc_NTSjQ5icWUF-ZZJ3AkjYZDcSE4K1fzBHO-vxk01VKsDPrYmKh8_u2PW3C6A"
                alt="Floating French Fries"
                className="w-[280px] sm:w-[350px] h-auto object-contain floating drop-shadow-[0_20px_30px_rgba(254,183,0,0.3)]"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Right text details column */}
            <div className="w-full lg:w-1/2 flex flex-col gap-6 text-center lg:text-left z-10">
              <span className="text-secondary-container text-xs font-bold tracking-widest uppercase flex items-center justify-center lg:justify-start gap-1">
                <span className="material-symbols-outlined text-sm">local_pizza</span> CRUNCHY DELIGHTS
              </span>
              <h2 className="font-headline text-4xl sm:text-5xl text-white leading-tight">
                SATISFY YOUR MIDNIGHT<br />
                <span className="text-secondary-container">FAST FOOD CRAVINGS</span>
              </h2>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                Crispy on the outside, soft on the inside, cooked to golden perfection. Elevate your meal with our farm-fresh sides, savory onion rings, and handcrafted milkshakes. Guaranteed to hit the spot, every single time.
              </p>
              <div className="flex justify-center lg:justify-start">
                <button
                  onClick={() => {
                    setSelectedCategory('sides');
                    setActiveView('menu');
                  }}
                  className="bg-primary hover:bg-primary-hover text-white font-headline text-lg tracking-wider px-8 py-4 rounded-full transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
                  id="satisfy-banner-btn"
                >
                  ORDER SIDES NOW
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* GOURMET SECRETS / INGREDIENT OVERVIEW */}
      <section className="py-20" id="home-secrets">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Raw text and feature logs */}
            <div className="flex flex-col gap-6">
              <span className="text-primary text-xs font-bold tracking-widest uppercase flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">verified</span> AUTHENTIC FLAVORS
              </span>
              <h2 className="font-headline text-4xl sm:text-5xl text-on-surface leading-tight">
                OUR GOURMET SECRETS ARE<br />
                <span className="text-primary">100% TRANSPARENT</span>
              </h2>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                We believe in delicious details. Every ingredient is sourced locally, prepped daily by culinary experts, and cooked fresh to order. No processed shortcuts, no preservatives—just honest, mouthwatering fast food.
              </p>

              <div className="flex flex-col gap-4 mt-2">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-2xl text-primary shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-on-surface text-base">Always Sizzling Hot</h4>
                    <p className="text-xs text-gray-500 mt-1">Our heat-insulated thermal backpacks guarantee your burger arrives as hot as if it just came off the flame grill.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-2xl text-primary shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-on-surface text-base">100% Certified Premium Meat</h4>
                    <p className="text-xs text-gray-500 mt-1">We exclusively partner with organic local ranches to ensure premium grass-fed USDA certified Choice beef patties.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-2xl text-primary shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-on-surface text-base">Chef-Curated Signature Sauces</h4>
                    <p className="text-xs text-gray-500 mt-1">Our chef crafts unique spreads, including our famous sweet mayo blend and the secret smoky heat sauce daily.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Awesome layered blueprints image */}
            <div className="relative flex justify-center">
              <div className="bg-white rounded-3xl overflow-hidden border border-surface-container-high shadow-2xl p-4 sm:p-6 flex flex-col gap-4 max-w-lg">
                <div className="flex items-center justify-between pb-3 border-b border-surface-container-low">
                  <span className="font-headline text-xs tracking-wider text-primary">ANATOMY OF THE PERFECT BURGER</span>
                  <span className="bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded text-[10px] font-bold">100% FRESH</span>
                </div>
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDLGBm5oxN_xAhe__n1IiX4sfCsI-_LB96R3mMI7eEtHBrVN92XvqQkeKi6JLBJ0GZS9jN6Cg7lDiD8pLE868k9of0te1j7xAsN7XSQ1fyx8oqwQn2I75WD6YMjwaN-gIpocZ8isSw3fGbAQDFZKf0uMeLU_nzxbgYMSGYzbz1mEUa_KNuDtJj74gJ2n_LycFdvgAlvoCJeQ5lRIow7aEYsEG7zivcKCpCFzI7MjbM5TkdDMxnR8HeXZyiU2bX-QbBRb9tyjzHaKdQ"
                  alt="Burger blueprint layers ingredients"
                  className="w-full h-auto object-cover rounded-2xl"
                  referrerPolicy="no-referrer"
                />
                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-surface-container-low">
                  <div className="text-center p-2.5 bg-surface-container-lowest border border-surface-container-high rounded-xl">
                    <div className="text-xs text-gray-500 font-bold">Total Prep Time</div>
                    <div className="text-base font-headline text-on-surface mt-1">5-7 Mins</div>
                  </div>
                  <div className="text-center p-2.5 bg-surface-container-lowest border border-surface-container-high rounded-xl">
                    <div className="text-xs text-gray-500 font-bold">Grill Temperature</div>
                    <div className="text-base font-headline text-on-surface mt-1">450°F</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

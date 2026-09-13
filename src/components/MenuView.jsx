import React from 'react';
import { Search, Star, Sparkles, SlidersHorizontal, Eye } from 'lucide-react';
import { motion } from 'motion/react';
import { MENU_ITEMS } from '../data';

export const MenuView = ({
  selectedCategory,
  setSelectedCategory,
  onSelectProduct,
  menuItems = MENU_ITEMS,
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [sortBy, setSortBy] = React.useState('default');

  const itemsToFilter = menuItems && menuItems.length > 0 ? menuItems : MENU_ITEMS;

  // Filter products
  const filteredProducts = itemsToFilter.filter((item) => {
    const matchesCategory =
      selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0; // default (natural array order)
  });

  const categoriesList = [
    { id: 'all', name: 'All Cravings', icon: 'lunch_dining' },
    { id: 'burgers', name: 'Burgers', icon: 'burger' },
    { id: 'pizza', name: 'Pizza', icon: 'local_pizza' },
    { id: 'sides', name: 'Sides & Extras', icon: 'french_fries' },
    { id: 'drinks', name: 'Drinks', icon: 'local_bar' },
    { id: 'desserts', name: 'Desserts', icon: 'icecream' },
  ];

  return (
    <div className="py-12 bg-background min-h-screen" id="menu-view-container">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page title header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-primary text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-1">
            <span className="material-symbols-outlined text-sm font-bold">restaurant_menu</span> FLAME GRILLED DEVOTION
          </span>
          <h1 className="font-headline text-4xl sm:text-5xl text-on-surface mt-2 tracking-wide">
            CRAFTED TO CRUSH HUNGER
          </h1>
          <p className="text-gray-500 text-sm mt-3 leading-relaxed">
            Choose from our award-winning menu items. High-quality local ingredients prepped fresh and customized to your exact specifications.
          </p>
        </div>

        {/* SEARCH & FILTERS BAR */}
        <div className="bg-white rounded-3xl border border-surface-container-high p-6 shadow-sm flex flex-col lg:flex-row gap-6 justify-between items-center mb-10" id="search-filter-controls">
          
          {/* Search Input */}
          <div className="relative w-full lg:max-w-md">
            <input
              type="text"
              placeholder="Search juicy burgers, sides, sodas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-container-low border border-surface-container-high text-on-surface placeholder-gray-400 text-sm font-semibold rounded-2xl pl-12 pr-4 py-3.5 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all duration-300"
              id="menu-search-input"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          </div>

          {/* Quick Categories filter */}
          <div className="flex overflow-x-auto gap-3 pb-2 lg:pb-0 w-full lg:w-auto no-scrollbar justify-start items-center">
            {categoriesList.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold tracking-wide transition-all duration-300 flex items-center gap-1.5 shrink-0 cursor-pointer border ${
                  selectedCategory === cat.id
                    ? 'bg-primary text-white border-primary shadow-md transform scale-102'
                    : 'bg-surface-container-low text-on-surface hover:bg-surface-container border-surface-container-high'
                }`}
                id={`menu-cat-btn-${cat.id}`}
              >
                <span className="material-symbols-outlined text-base">{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>

          {/* Sorting Dropdown */}
          <div className="flex items-center gap-3 w-full lg:w-auto shrink-0 border-t lg:border-t-0 pt-4 lg:pt-0 border-surface-container-high">
            <SlidersHorizontal className="w-4 h-4 text-gray-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-surface-container-low border border-surface-container-high text-on-surface text-xs font-bold rounded-xl py-2.5 pl-3 pr-8 focus:outline-none focus:border-primary cursor-pointer"
              id="menu-sort-select"
            >
              <option value="default">Default Sorting</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Popularity (Rating)</option>
            </select>
          </div>
        </div>

        {/* MENU GRID */}
        {sortedProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-surface-container-high shadow-inner">
            <div className="w-20 h-20 rounded-full bg-surface-container flex items-center justify-center text-primary mx-auto mb-4">
              <span className="material-symbols-outlined text-4xl">search_off</span>
            </div>
            <h3 className="font-headline text-2xl text-on-surface">No Cravings Found</h3>
            <p className="text-gray-400 text-sm mt-1 max-w-sm mx-auto">
              We couldn't find anything matching your search. Try adjusting your filters or category tabs!
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-6 bg-primary hover:bg-primary-hover text-white text-xs font-bold px-6 py-3 rounded-full shadow-md transition-colors cursor-pointer"
            >
              RESET ALL FILTERS
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {sortedProducts.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -6, transition: { duration: 0.2, ease: "easeOut" } }}
                transition={{ 
                  duration: 0.4, 
                  ease: [0.16, 1, 0.3, 1], 
                  delay: Math.min(index * 0.03, 0.3) 
                }}
                onClick={() => onSelectProduct(item)}
                className="bg-white rounded-3xl border border-surface-container-high hover:border-primary/20 overflow-hidden shadow-sm hover:shadow-xl flex flex-col group cursor-pointer transition-colors duration-300"
                id={`menu-card-${item.id}`}
              >
                {/* Image Section */}
                <div className="relative pt-[75%] bg-surface-container-low overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Badges Overlay */}
                  <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                    <span className="bg-black/75 backdrop-blur-sm text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                      {item.category}
                    </span>
                    {item.isNew && (
                      <span className="bg-green-600 text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-0.5">
                        <Sparkles className="w-2.5 h-2.5 fill-white" /> NEW RELEASE
                      </span>
                    )}
                  </div>

                  {item.isPopular && (
                    <span className="absolute top-4 right-4 bg-secondary-container text-on-secondary-container text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                      🔥 BESTSELLER
                    </span>
                  )}

                  {/* Hover Quick View Overlay */}
                  <div className="absolute inset-0 bg-black/45 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/90 backdrop-blur-sm text-on-surface text-xs font-bold px-5 py-3 rounded-full flex items-center gap-1.5 shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <Eye className="w-4 h-4" /> CUSTOMIZE & VIEW
                    </div>
                  </div>
                </div>

                {/* Info Section */}
                <div className="p-6 flex flex-col flex-grow justify-between gap-4">
                  <div>
                    {/* Stars / Rating */}
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < item.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-200'
                          }`}
                        />
                      ))}
                      <span className="text-[10px] text-gray-500 font-bold ml-1">
                        ({item.reviewsCount})
                      </span>
                    </div>

                    <h3 className="font-headline text-lg tracking-wide text-on-surface group-hover:text-primary transition-colors line-clamp-1">
                      {item.name}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Pricing / CTA */}
                  <div className="flex items-center justify-between border-t border-surface-container-low pt-4 mt-auto">
                    <span className="font-headline text-xl text-on-surface">
                      ${Number(item.price).toFixed(2)}
                    </span>
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
        )}
      </div>
    </div>
  );
};

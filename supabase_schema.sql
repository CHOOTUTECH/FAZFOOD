-- =================================================================================
--                   FAZFOOD SUPABASE DATABASE SCHEMA SETTINGS
-- =================================================================================
-- 
-- Aap in SQL queries ko copy karke apne Supabase project ke "SQL Editor" me 
-- paste aur run kar sakte hain. Isse saare tables aur relations ban jayenge.
--
-- =================================================================================


-- 1. MENU ITEMS TABLE
-- Is table me hum saare khane ke items (Burgers, Pizza, Sides, Drinks, etc.) save karenge.
CREATE TABLE IF NOT EXISTS menu_items (
    id TEXT PRIMARY KEY,                       -- Unique identifier (e.g., 'grilled-beef-burger')
    name TEXT NOT NULL,                        -- Item ka naam (e.g., 'Grilled Beef Burger')
    description TEXT,                          -- Item ki description
    price NUMERIC(10, 2) NOT NULL,             -- Price (e.g., 12.99)
    category TEXT NOT NULL,                    -- Category: burgers, pizza, sides, drinks, desserts
    rating NUMERIC(2, 1) DEFAULT 5.0,          -- Average customer rating
    reviews_count INTEGER DEFAULT 0,           -- Total customer reviews count
    image TEXT,                                -- Food image URL
    is_popular BOOLEAN DEFAULT false,          -- Best-seller / Popular badge
    is_chef_choice BOOLEAN DEFAULT false,      -- Chef specialty badge
    is_new BOOLEAN DEFAULT false,              -- New item badge
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);


-- 2. ORDERS TABLE
-- Jab user Checkout complete karega, toh order details is table me save honge.
CREATE TABLE IF NOT EXISTS orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name TEXT NOT NULL,                   -- Delivery ke liye full name
    street_address TEXT NOT NULL,              -- Delivery Address
    city TEXT NOT NULL,                        -- Delivery City
    postal_code TEXT NOT NULL,                 -- Postal / ZIP Code
    email TEXT NOT NULL,                       -- Contact Email
    phone TEXT NOT NULL,                       -- Contact Phone Number
    payment_method TEXT NOT NULL,              -- Payment Type: credit_card, paypal, apple_pay
    promo_code TEXT,                           -- Applied promo code (if any)
    discount_amount NUMERIC(10, 2) DEFAULT 0,  -- Discount amount in dollars
    final_total NUMERIC(10, 2) NOT NULL,       -- Total paid amount
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);


-- 3. ORDER ITEMS TABLE
-- Ek order me multiple food items ho sakte hain. Har item ki entry is table me foreign key ke sath hogi.
CREATE TABLE IF NOT EXISTS order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,  -- Kis order ka item hai (Foreign Key)
    item_id TEXT,                              -- Menu item reference code
    name TEXT NOT NULL,                        -- Food item name
    quantity INTEGER NOT NULL,                 -- Kitne items order kiye
    price_per_item NUMERIC(10, 2) NOT NULL,    -- Ek item ki total price (Customizations ke sath)
    customizations TEXT[],                     -- Selected addons list (Array of text)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);


-- 4. REVIEWS TABLE
-- Order success hone ke baad, agar customer star rating aur feedback deta hai, toh woh yahan save hoga.
CREATE TABLE IF NOT EXISTS reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_number TEXT NOT NULL,                -- Order unique number tracking
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL, -- Star rating (1 to 5)
    comment TEXT,                              -- Customer feedback comment
    items TEXT[],                              -- Ordered items list for context (Array of text)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);


-- =================================================================================
--                      SAMPLE DATA SEEDING (INITIAL MENU ITEMS)
-- =================================================================================
-- Agar aap starting me database me dummy items load karna chahte hain, 
-- toh aap is query ko run kar sakte hain:

INSERT INTO menu_items (id, name, description, price, category, rating, reviews_count, image, is_popular, is_chef_choice, is_new)
VALUES 
('grilled-beef-burger', 'Grilled Beef Burger', 'Classic flame-grilled grass-fed Angus beef patty with cheddar, smoky sauce, tomatoes and fresh caramelized onion.', 12.99, 'burgers', 4.9, 142, 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDCK06XHyfeHEekaVDGSgMXUvyIifQaqrWPxlpXflCX6_-uXmehSbadXgXZaJZf9tvyR4rYUbgGrtJhb-k4RXS_HFrKS3xrJE_MiRqEV1gebK2zsHfWvcJsXj_q8lHQbk-uh4UHBlCP3NyGLp8iCt-8zwIO0rrusYeI1jbJWpDsCQBcair5SRi9mNQuihVd-euVz8cnAlVbFgpHUh3X-o7IkBMihpEpq6McelT5aXhTtArMBk9q44Dq0GP4FTl7zSEzGZVjvzzqS8', true, true, false),

('double-bacon-cheese', 'Double Bacon Cheese', 'Double juicy beef patty stacked with double aged cheese, crispy applewood smoked bacon strips, sweet pickles and BBQ sauce.', 16.50, 'burgers', 5.0, 89, 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDCK06XHyfeHEekaVDGSgMXUvyIifQaqrWPxlpXflCX6_-uXmehSbadXgXZaJZf9tvyR4rYUbgGrtJhb-k4RXS_HFrKS3xrJE_MiRqEV1gebK2zsHfWvcJsXj_q8lHQbk-uh4UHBlCP3NyGLp8iCt-8zwIO0rrusYeI1jbJWpDsCQBcair5SRi9mNQuihVd-euVz8cnAlVbFgpHUh3X-o7IkBMihpEpq6McelT5aXhTtArMBk9q44Dq0GP4FTl7zSEzGZVjvzzqS8', true, false, false),

('chicken-avocado-club', 'Chicken Avocado Club', 'Crispy buttermilk chicken breast topped with ripe sliced avocado, pepper jack cheese, field greens, and sweet garlic herb aioli.', 11.75, 'burgers', 4.8, 67, 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDCK06XHyfeHEekaVDGSgMXUvyIifQaqrWPxlpXflCX6_-uXmehSbadXgXZaJZf9tvyR4rYUbgGrtJhb-k4RXS_HFrKS3xrJE_MiRqEV1gebK2zsHfWvcJsXj_q8lHQbk-uh4UHBlCP3NyGLp8iCt-8zwIO0rrusYeI1jbJWpDsCQBcair5SRi9mNQuihVd-euVz8cnAlVbFgpHUh3X-o7IkBMihpEpq6McelT5aXhTtArMBk9q44Dq0GP4FTl7zSEzGZVjvzzqS8', false, false, true),

('gourmet-pepperoni-pizza', 'Gourmet Pepperoni Pizza', 'Hand-stretched sourdough crust layered with rich crushed tomato sauce, fresh creamy mozzarella and loaded with spicy cured pepperoni.', 14.50, 'pizza', 4.9, 115, 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDCK06XHyfeHEekaVDGSgMXUvyIifQaqrWPxlpXflCX6_-uXmehSbadXgXZaJZf9tvyR4rYUbgGrtJhb-k4RXS_HFrKS3xrJE_MiRqEV1gebK2zsHfWvcJsXj_q8lHQbk-uh4UHBlCP3NyGLp8iCt-8zwIO0rrusYeI1jbJWpDsCQBcair5SRi9mNQuihVd-euVz8cnAlVbFgpHUh3X-o7IkBMihpEpq6McelT5aXhTtArMBk9q44Dq0GP4FTl7zSEzGZVjvzzqS8', true, false, false),

('french-fries', 'Gourmet French Fries', 'Hand-cut local potatoes, twice-fried to golden, crispy perfection and tossed with sea salt, rosemary, and savory garlic powder.', 4.50, 'sides', 4.7, 240, 'https://lh3.googleusercontent.com/aida-public/AB6AXuAN_sfr3rSt25seTBTAIQVt8xbOWk57_QRI92o7U3ok_DEmUxcicxh769yhGbF7tvPgEL6AyanBXfGupcZs4hDZBaHNQ9d1pWPd4e8o1Rc8WbuFQmotUuDAjw__dXrFbdgptSF38cTx0s5wc0fAmof0L33bRqhrcJ23g-BgRJrU163x3wqKTAnze7rpIODoePF_CQ_UCxAvKh71Icc_NTSjQ5icWUF-ZZJ3AkjYZDcSE4K1fzBHO-vxk01VKsDPrYmKh8_u2PW3C6A', false, true, false)
ON CONFLICT (id) DO NOTHING;

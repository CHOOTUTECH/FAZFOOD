"""
FazFood Initial Menu & Categories Seeder for Django
Run this script inside your Django project:
python seed_django_data.py
"""

import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'fazfood_backend.settings')
django.setup()

from api.models import Category, MenuItem

CATEGORIES_DATA = [
    { 'slug': 'burgers', 'name': 'Burgers', 'image': 'https://lh3.googleusercontent.com/aida-public/AB6AXuAXPwTWwglIuvgvB3g-_PhIut8mESvLGM_cKXn-eGaKpXy9Ke5r6v9n6x39R_olL1DPGqZGFA7Qs90nM0yFV3YC0anT5mHBFF437rGrVfrWbO1g69FHoL1mTIdYxSQBDcUoZCM7nWG7S83TjpDcG0gnfRqUMfsEh-V8mPRfefHpRcIMacLyhfzyi9d-NSS7WXIy5FvfrCLrMyzlPVIkft10ZFoYq6hzZCo1aaZtaFRR6Oor9IGCnKQXi-lnN3W-qhvzqNKxP3dhJyo' },
    { 'slug': 'pizza', 'name': 'Pizza', 'image': 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_6YNja9fJKbFKPzVlUCCBuJpYaTxlSQlfr0llw34TkU_kfxciAXAO2qO6BpBUJER9Yen8uWbUYA8xTdY99hFeWh2UXm23D6RsdEvEEjP2Brr62-KS6qH7pnDJu9EUB1ze58UH5mHGOxntABN04J8cVY4cPUQjtrsHQf9CQJDyOK3I_a7L8GhvZZj5vh9QSXW7pkMa02sjvDLRA0nguc3hBeMJYeFqmg2l4nGmgPulNBcNG7U5LqoCUOQ-2siBV_3hWPNG68ayKO8' },
    { 'slug': 'sides', 'name': 'Sides & Extras', 'image': 'https://lh3.googleusercontent.com/aida-public/AB6AXuAhQjxbrMUm6Fx7RtZ2gUuANVCDoF-71sGzmvyQsxPxfQvebg2YWKtAu0IY_cm9cfViZyoCzfxj4m6gA_7xkJ2wVpIrra8H5oh0JsSkuZizINnwVXjIIUVW9ShUUpyJ4B7iBd85r5Xm3YHuAWjsaH1oDUoPUbzPz4qhTQHzHzrjAfih92wHpG3pRKZaeQcAV5oo88TAneakM_Z9CyAT9ft8qnUyYK4Ub_L2WiUAZ0RaBQHRkdFmqNk8de7bl-TLtZcOfjOVMzJCQs8' },
    { 'slug': 'drinks', 'name': 'Drinks', 'image': 'https://lh3.googleusercontent.com/aida-public/AB6AXuA9reyEb6mlPkXs8sTmIGDUo8K-VoJI_FQFy169Vt6njilupReajMbneg3FbtjkOpCd9se-iiJtbIbUmeB7Hytz6-p-J9HkNZdu-gtwyV8nhRIPvwFWOy7QcdHeQCZdm6ZI5NiuUUfu4DhUnslzEK7J3DfBMS4ioCSLLuc2bstyMr3eDCKvHe7TpTygiwpaa1Akwg0fS1vJapULn6RAHr4_Eh1J5pVBx_K7BfKcCdjoQFwcLc6LQc4W4mHPJ4jsEDfFM1Ahol3JujQ' },
    { 'slug': 'desserts', 'name': 'Desserts', 'image': 'https://lh3.googleusercontent.com/aida-public/AB6AXuD7Ov-p1K7dBes10ePVdRxo8cra29SgE8oK8CM5-jo3irdK2_Y6bwb-5rSQSLArh8rtdtRhKuHNW8oukA206_8Eu9Jss99KWksEb8N1PfS8gMYBnI323VNQm67tqdJcUF4aW5UN5JaM9KADpohUuecP6hM3uPZXg293W8_v60vtty8sLT5VoZ4-9c7AAXTdJw_xl1IwYqbRB915dkW2WhAhlcNunYX5Xr7uwh0n7tCq-GbtWFFBdmSCvJ9b8JZs0yYWMCepTrfgX4o' }
]

MENU_ITEMS_DATA = [
    {
        'item_id': 'grilled-beef-burger',
        'name': 'Grilled Beef Burger',
        'description': 'Our signature Grilled Beef Burger features a 100% Angus beef patty, flame-grilled to perfection, served on a toasted artisanal brioche bun with our secret house sauce.',
        'price': 12.99,
        'image': 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDCK06XHyfeHEekaVDGSgMXUvyIifQaqrWPxlpXflCX6_-uXmehSbadXgXZaJZf9tvyR4rYUbgGrtJhb-k4RXS_HFrKS3xrJE_MiRqEV1gebK2zsHfWvcJsXj_q8lHQbk-uh4UHBlCP3NyGLp8iCt-8zwIO0rrusYeI1jbJWpDsCQBcair5SRi9mNQuihVd-euVz8cnAlVbFgpHUh3X-o7IkBMihpEpq6McelT5aXhTtArMBk9q44Dq0GP4FTl7zSEzGZVjvzzqS8',
        'rating': 5.0,
        'reviews_count': 124,
        'category_slug': 'burgers',
        'is_popular': True,
        'ingredients': 'Angus Beef Patty, Enriched Flour (Wheat), Butter, Eggs, Whole Milk, Water, Sugar, Salt, Yeast, Cheddar Cheese, Tomato, Iceberg Lettuce, Red Onion, Pickles, Secret House Sauce.',
    },
    {
        'item_id': 'original-mayo-cruncher',
        'name': 'Original Mayo Cruncher',
        'description': 'Pepper mayo cruncher, fries, coleslaw, 1 pc chicken and a chilled drink in a full bundle meal.',
        'price': 50.00,
        'image': 'https://lh3.googleusercontent.com/aida-public/AB6AXuBO8q6T2H6LqLRh87Uc-NZ_vfgJIe_1EilzQPWxFVCIolqHS5c1xdUjdrZ8KGn9GdmHNJBkI9t9pJfb-T9J-aYkvo-8Hun1x2jRvsnsTIVA6w6yC7iLWHd9ats-x3HeKvFsT6xPzHnAfOMtwbSEzDul24n75TQ74-_rb83-ULxzcsvu8ytJUAl4Om2ae5C5RLTxpkPoDd4xPgJSRZMoecghPwEog3H9kEW4epJwHwQ41fRsWVzw9eWmqv43C5gqGDFJc2HWstYfwYw',
        'rating': 4.0,
        'reviews_count': 98,
        'category_slug': 'burgers',
        'is_popular': True,
        'ingredients': 'Crispy chicken breast, creamy pepper mayo, fresh shredded iceberg lettuce, sesame brioche bun.',
    },
    {
        'item_id': 'italiano-original',
        'name': 'Italiano Original',
        'description': 'Special slice with chicken breast fillet and Arrabbiata or Pepper Chili sauce.',
        'price': 45.00,
        'image': 'https://lh3.googleusercontent.com/aida-public/AB6AXuCfpJSNg2AcdG4px3EwmvUZ6eyqGmiMpQHEq8tKAowtzwa5xE5d97YscJS7Widpy3ghGl9QKZCIi71zzLTWRyghKR9NGnzEBrEwKo8BvhCLPy3CezuTE572W5lcO4SUP32OTc19fRet0E6ybdykO8A8ReIED8cOiejfJlhH0N2gqgbP_eld5iRocRNQr_n9aFSF_9BKcaD2jEUVXYELXHt6usJCMYD1_-_VwNuz_dBBaFPxZDo27p1AnKAD0cGxFUgrz1VVF3R3bcE',
        'rating': 5.0,
        'reviews_count': 84,
        'category_slug': 'pizza',
        'ingredients': 'Mozzarella, savory tomato sauce, spicy pepperoni, fresh basil, extra virgin olive oil.',
    },
    {
        'item_id': 'fazmonster-stack',
        'name': 'The Legendary FazMonster Stack',
        'description': 'Three flame-grilled 100% Angus beef patties layered with aged sharp cheddar, applewood smoked bacon, crispy onion rings, and spicy FazSauce.',
        'price': 18.99,
        'image': 'https://lh3.googleusercontent.com/aida-public/AB6AXuA1AA5QohepbYf7vwqFJXEl6WTz7ufSQeS_QrbMbU7HciMzTgD6naZAVWiwyPxXcw4UUzaV52GYpuLf6d_06RHf2KVFp1wmzK5HU-kxDxsjwrg9_yYP1BfxH3jKHXzyAumsnUvzdmLeXAxymCjQ1G-1_Iwes_LakzLUK1VF0gk1Xg94fKw2TP4K7c8wUlnp9fBUwpk9mSCUP5s7jVITKECy10uKAnajN-XIRA_9zq0uq05-8VISDhueafWAyg-2WE3StK-YWpdVik4',
        'rating': 5.0,
        'reviews_count': 312,
        'category_slug': 'burgers',
        'is_popular': True,
        'ingredients': 'Triple Angus Beef, Triple Aged Cheddar, Bacon Strips, Beer-Battered Onion Rings, Secret Spicy FazSauce.',
    },
    {
        'item_id': 'french-fries',
        'name': 'French Fries',
        'description': 'Crispy golden thin-cut french fries seasoned to perfection with sea salt.',
        'price': 3.50,
        'image': 'https://lh3.googleusercontent.com/aida-public/AB6AXuAx1uMzS7VTDctSbK40iJUVEVx0R1-FNBXlUCtLg_rFiF7Uip3znUKVqoDkhRFvf5SpPtoxHqfUN9sHNYNt0cQh0s8AKW3qHeOnRgMS53O4LOoOXDBiKaop2UEfnwfkV5UZRDwuz42QbgJ4fdVXy0WPegpxyrbv7T6pkt9md6GIv0KfW1EC4NOySvm_s29Obj-CX-bQtTtZ4WWQMr7ksAQmv8-MLBqkpOb8iDkrs5-5-Ut6nfZc8h4SuieuT9V7Zplw5VSOptbY4Mg',
        'rating': 5.0,
        'reviews_count': 412,
        'category_slug': 'sides',
        'ingredients': 'Russet potatoes, vegetable oil, sea salt.',
    },
    {
        'item_id': 'soft-drink',
        'name': 'Soft Drink',
        'description': 'Cold sparkling glass of dark cola with refreshing carbonation and ice.',
        'price': 2.50,
        'image': 'https://lh3.googleusercontent.com/aida-public/AB6AXuA9reyEb6mlPkXs8sTmIGDUo8K-VoJI_FQFy169Vt6njilupReajMbneg3FbtjkOpCd9se-iiJtbIbUmeB7Hytz6-p-J9HkNZdu-gtwyV8nhRIPvwFWOy7QcdHeQCZdm6ZI5NiuUUfu4DhUnslzEK7J3DfBMS4ioCSLLuc2bstyMr3eDCKvHe7TpTygiwpaa1Akwg0fS1vJapULn6RAHr4_Eh1J5pVBx_K7BfKcCdjoQFwcLc6LQc4W4mHPJ4jsEDfFM1Ahol3JujQ',
        'rating': 4.0,
        'reviews_count': 220,
        'category_slug': 'drinks',
        'ingredients': 'Carbonated water, cane sugar, caramel color, natural cola flavor.',
    }
]

def run():
    print("🌱 Seeding Categories...")
    for cat in CATEGORIES_DATA:
        obj, created = Category.objects.get_or_create(
            slug=cat['slug'],
            defaults={'name': cat['name'], 'image': cat['image']}
        )
        if created:
            print(f"  [+] Created Category: {cat['name']}")

    print("🍔 Seeding Menu Items...")
    for item in MENU_ITEMS_DATA:
        cat = Category.objects.get(slug=item['category_slug'])
        obj, created = MenuItem.objects.get_or_create(
            item_id=item['item_id'],
            defaults={
                'name': item['name'],
                'description': item['description'],
                'price': item['price'],
                'image': item['image'],
                'rating': item['rating'],
                'reviews_count': item['reviews_count'],
                'category': cat,
                'is_popular': item.get('is_popular', False),
                'ingredients': item.get('ingredients', ''),
            }
        )
        if created:
            print(f"  [+] Created Menu Item: {item['name']}")

    print("🎉 Database seeding complete! Ready for FazFood React frontend.")

if __name__ == '__main__':
    run()

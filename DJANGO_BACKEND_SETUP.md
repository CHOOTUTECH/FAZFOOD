# 🚀 FazFood Django REST Framework Backend Integration Guide
*(Complete Backend Setup with Models, Serializers, Views, and URLs)*

This guide provides the complete, production-ready Django REST Framework code to connect your FazFood frontend to a real Django SQL database (SQLite, PostgreSQL, or MySQL).

---

## 📌 1. Quick Setup & Requirements

### A. Create virtual environment & install packages
```bash
# Create and activate virtualenv
python -m venv venv

# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install required packages
pip install django djangorestframework django-cors-headers
```

### B. Initialize Project
```bash
django-admin startproject fazfood_backend .
python manage.py startapp api
```

---

## 📌 2. Configure `fazfood_backend/settings.py`

Add `rest_framework`, `corsheaders`, and `api` to your `INSTALLED_APPS` and middleware:

```python
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Third-party apps
    'rest_framework',
    'rest_framework.authtoken',
    'corsheaders',

    # Local app
    'api',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # MUST BE AT THE VERY TOP
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# Allow React frontend to connect
CORS_ALLOW_ALL_ORIGINS = True  # In development
# Or restrict to your frontend domain in production:
# CORS_ALLOWED_ORIGINS = [
#     "http://localhost:3000",
#     "http://127.0.0.1:3000",
# ]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],
}
```

---

## 📌 3. Database Models (`api/models.py`)

Replace `api/models.py` with this complete database design:

```python
from django.db import models
from django.contrib.auth.models import User

class Category(models.Model):
    slug = models.SlugField(max_length=50, unique=True, primary_key=True)
    name = models.CharField(max_length=100)
    image = models.URLField(max_length=500, blank=True, null=True)

    class Meta:
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name


class MenuItem(models.Model):
    item_id = models.SlugField(max_length=100, unique=True, primary_key=True)
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=7, decimal_places=2)
    image = models.URLField(max_length=500, blank=True)
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=5.0)
    reviews_count = models.IntegerField(default=0)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="menu_items")
    is_popular = models.BooleanField(default=False)
    is_chef_choice = models.BooleanField(default=False)
    ingredients = models.TextField(blank=True)
    calories = models.CharField(max_length=50, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Order(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'),
        ('Grilling', 'Grilling'),
        ('On Route', 'On Route'),
        ('Delivered', 'Delivered'),
        ('Cancelled', 'Cancelled'),
    ]

    order_id = models.CharField(max_length=50, unique=True, primary_key=True)
    customer_name = models.CharField(max_length=150)
    email = models.EmailField()
    phone = models.CharField(max_length=30)
    street_address = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20)
    payment_method = models.CharField(max_length=50, default='credit_card')
    promo_code = models.CharField(max_length=50, blank=True, null=True)
    discount_amount = models.DecimalField(max_digits=8, decimal_places=2, default=0.00)
    final_total = models.DecimalField(max_digits=8, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Order {self.order_id} - {self.customer_name} (${self.final_total})"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    menu_item_id = models.CharField(max_length=100)
    name = models.CharField(max_length=200)
    quantity = models.PositiveIntegerField(default=1)
    price_per_item = models.DecimalField(max_digits=7, decimal_places=2)
    customizations = models.JSONField(default=list, blank=True)

    def __str__(self):
        return f"{self.quantity}x {self.name} for {self.order.order_id}"


class Review(models.Model):
    order_number = models.CharField(max_length=50)
    rating = models.IntegerField(default=5)
    comment = models.TextField()
    items = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Rating {self.rating}* by {self.order_number}"
```

---

## 📌 4. Serializers (`api/serializers.py`)

Create `api/serializers.py`:

```python
from rest_framework import serializers
from .models import Category, MenuItem, Order, OrderItem, Review
from django.contrib.auth.models import User

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['slug', 'name', 'image']


class MenuItemSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='item_id', read_only=True)
    reviewsCount = serializers.IntegerField(source='reviews_count', read_only=True)
    isPopular = serializers.BooleanField(source='is_popular', read_only=True)
    isChefChoice = serializers.BooleanField(source='is_chef_choice', read_only=True)

    class Meta:
        model = MenuItem
        fields = [
            'id', 'item_id', 'name', 'description', 'price', 
            'image', 'rating', 'reviewsCount', 'category', 
            'isPopular', 'isChefChoice', 'ingredients'
        ]


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['menu_item_id', 'name', 'quantity', 'price_per_item', 'customizations']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)

    class Meta:
        model = Order
        fields = [
            'order_id', 'customer_name', 'email', 'phone',
            'street_address', 'city', 'postal_code', 'payment_method',
            'promo_code', 'discount_amount', 'final_total', 'status',
            'created_at', 'items'
        ]

    def create(self, validated_data):
        items_data = validated_data.pop('items', [])
        order = Order.objects.create(**validated_data)
        for item_data in items_data:
            OrderItem.objects.create(order=order, **item_data)
        return order


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ['id', 'order_number', 'rating', 'comment', 'items', 'created_at']
```

---

## 📌 5. Views (`api/views.py`)

Create `api/views.py`:

```python
from rest_framework import viewsets, status, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.db.models import Sum, Count, Avg
from .models import Category, MenuItem, Order, Review
from .serializers import CategorySerializer, MenuItemSerializer, OrderSerializer, ReviewSerializer


@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    return Response({"status": "ok", "message": "FazFood Django API is running smoothly!"})


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]


class MenuItemViewSet(viewsets.ModelViewSet):
    queryset = MenuItem.objects.all()
    serializer_class = MenuItemSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = MenuItem.objects.all()
        category = self.request.query_params.get('category', None)
        search = self.request.query_params.get('search', None)
        sort = self.request.query_params.get('sort', None)

        if category and category != 'all':
            queryset = queryset.filter(category__slug=category)
        if search:
            queryset = queryset.filter(name__icontains=search)
        if sort == 'price-asc':
            queryset = queryset.order_by('price')
        elif sort == 'price-desc':
            queryset = queryset.order_by('-price')
        elif sort == 'rating':
            queryset = queryset.order_by('-rating')
            
        return queryset


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Order.objects.all()
        status_filter = self.request.query_params.get('status', None)
        search = self.request.query_params.get('search', None)

        if status_filter and status_filter != 'all':
            queryset = queryset.filter(status=status_filter)
        if search:
            queryset = queryset.filter(
                models.Q(order_id__icontains=search) |
                models.Q(customer_name__icontains=search) |
                models.Q(email__icontains=search)
            )
        return queryset


class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all().order_by('-created_at')
    serializer_class = ReviewSerializer
    permission_classes = [AllowAny]


class PromoValidateView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        code = request.data.get('code', '').strip().upper()
        if code == 'FAZDELIGHT':
            return Response({
                "valid": True,
                "code": "FAZDELIGHT",
                "discount_percent": 15,
                "message": "Coupon FAZDELIGHT applied! (15% OFF)"
            })
        return Response(
            {"valid": False, "message": "Invalid promo code."}, 
            status=status.HTTP_400_BAD_REQUEST
        )


class AdminStatsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        valid_orders = Order.objects.exclude(status='Cancelled')
        total_sales = valid_orders.aggregate(Sum('final_total'))['final_total__sum'] or 0.00
        active_orders = Order.objects.filter(status__in=['Pending', 'Grilling', 'On Route']).count()
        completed_count = Order.objects.filter(status='Delivered').count()
        total_orders_count = Order.objects.count()
        avg_ticket = (total_sales / total_orders_count) if total_orders_count > 0 else 0.00

        return Response({
            "total_sales": float(total_sales),
            "active_orders": active_orders,
            "average_ticket": round(float(avg_ticket), 2),
            "completed_count": completed_count
        })


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        # Allow username or email login
        user = authenticate(username=email, password=password)
        if not user:
            try:
                user_obj = User.objects.get(email=email)
                user = authenticate(username=user_obj.username, password=password)
            except User.DoesNotExist:
                pass

        if user:
            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                "token": token.key,
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "name": user.get_full_name() or user.username
                }
            })
        return Response({"detail": "Invalid Credentials"}, status=status.HTTP_401_UNAUTHORIZED)


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username') or request.data.get('email')
        email = request.data.get('email')
        password = request.data.get('password')
        name = request.data.get('name', '')

        if User.objects.filter(username=username).exists() or User.objects.filter(email=email).exists():
            return Response({"detail": "User already exists with this email."}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(username=username, email=email, password=password)
        if name:
            user.first_name = name
            user.save()

        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            "token": token.key,
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "name": name or user.username
            }
        }, status=status.HTTP_201_CREATED)
```

---

## 📌 6. API Routing (`api/urls.py` and `fazfood_backend/urls.py`)

### A. Create `api/urls.py`:
```python
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    health_check, 
    CategoryViewSet, 
    MenuItemViewSet, 
    OrderViewSet, 
    ReviewViewSet, 
    PromoValidateView, 
    AdminStatsView,
    LoginView,
    RegisterView
)

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'menu', MenuItemViewSet)
router.register(r'orders', OrderViewSet)
router.register(r'reviews', ReviewViewSet)

urlpatterns = [
    path('health/', health_check, name='health_check'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('promos/validate/', PromoValidateView.as_view(), name='promo_validate'),
    path('admin/stats/', AdminStatsView.as_view(), name='admin_stats'),
    path('', include(router.urls)),
]
```

### B. Connect in `fazfood_backend/urls.py`:
```python
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
]
```

---

## 📌 7. Run Migrations & Start Django Server

```bash
# Run database migrations
python manage.py makemigrations
python manage.py migrate

# Create admin superuser
python manage.py createsuperuser
# Enter username: owner@fazfood.com
# Password: admin123 (or your preferred password)

# Start Django Development Server on port 8000
python manage.py runserver 8000
```

---

## 📌 8. Connecting the React Frontend

The React frontend includes the API layer (`src/services/api.js`).

1. Make sure your `.env` file contains:
```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```
2. When the Django server is running at `http://127.0.0.1:8000`, the **Owner Dashboard** in the React app will show **"Connected to Django Backend"** in green!
3. All orders placed by customers, status updates, and new user registrations will immediately sync to your Django database.

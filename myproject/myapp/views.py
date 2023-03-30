from .models import Product
from .forms import RegisterForm
from django.shortcuts import render, redirect
from django.contrib.auth.forms import  AuthenticationForm
from django.contrib.auth import login as auth_login, authenticate

app_name = "myapp"

def product_list(request):
    products = Product.objects.all()
    return render(request, 'myapp/product_list.html', {'products': products})

def cart(request):
    return render(request, 'myapp/cart.html')

def auth_view(request):
    register_form = RegisterForm()
    login_form = AuthenticationForm()
    if request.method == 'POST':
        # В зависимости от отправленной формы обрабатываем запросы на вход или регистрацию
        if 'register_form' in request.POST:
            form = RegisterForm(request.POST)
            if form.is_valid():
                form.save()
                username = form.cleaned_data.get('username')
                password = form.cleaned_data.get('password1')
                user = authenticate(request, username=username, password=password)
                auth_login(request, user)
                return redirect('product_list')
        elif 'login_form' in request.POST:
            form = AuthenticationForm(request, request.POST)
            if form.is_valid():
                auth_login(request, form.get_user())
                return redirect('product_list')

    return render(request, 'myapp/auth.html', {'register_form': register_form, 'login_form': login_form})
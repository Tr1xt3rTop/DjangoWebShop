class ShoppingCart {
    constructor() {
        this.items = [];
    }

    init(cartItems, totalPrice, checkoutButton) {
        this.cartItemsElement = cartItems;
        this.totalPriceElement = totalPrice;
        this.checkoutButton = checkoutButton;
    }

    renderCartItems() {
        this.cartItemsElement.innerHTML = "";

        this.items.forEach((item) => {
            const itemElement = document.createElement("div");
            itemElement.classList.add("cart-item");
            itemElement.innerHTML = `
        <div class="product-image-wrapper">
          <img src="${item.image}" alt="${item.title}">
        </div>
        <div class="item-details">
          <h3>${item.title}</h3>
          <p>Цена: ${item.price.toFixed(2)} руб.</p>
          <input type="number" value="${item.quantity}" min="1">
          <button>Удалить</button>
        </div>
      `;



            const inputElement = itemElement.querySelector("input");
            inputElement.addEventListener("input", (e) => {
                const newQuantity = parseInt(e.target.value, 10);
                this.updateQuantity(item.id, newQuantity);
            });

            const removeButton = itemElement.querySelector("button");
            removeButton.addEventListener("click", () => {
                this.removeItem(item.id);
            });

            this.cartItemsElement.appendChild(itemElement);
        });

        const totalPrice = this.items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0    );
        this.totalPriceElement.innerText = totalPrice.toFixed(2);

        if (this.items.length === 0) {
            this.checkoutButton.disabled = true;
        } else {
            this.checkoutButton.disabled = false;
        }
    }

    addItem(item) {
        const existingItemIndex = this.items.findIndex(
            (cartItem) => cartItem.id === item.id
        );

        if (existingItemIndex !== -1) {
            this.items[existingItemIndex].quantity += 1;
        } else {
            item.quantity = 1;
            this.items.push(item);
        }
        saveCartToLocalStorage();
        this.renderCartItems();
    }

    removeItem(id) {
        const itemIndex = this.items.findIndex((cartItem) => cartItem.id === id);

        if (itemIndex !== -1) {
            this.items.splice(itemIndex, 1);
        }
        saveCartToLocalStorage();
        this.renderCartItems();
    }

    updateQuantity(id, newQuantity) {
        const itemIndex = this.items.findIndex((cartItem) => cartItem.id === id);

        if (itemIndex !== -1) {
            this.items[itemIndex].quantity = newQuantity;
        }
        saveCartToLocalStorage();
        this.renderCartItems();
    }
}

const shoppingCart = new ShoppingCart();

function saveCartToLocalStorage() {
    localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart.items));
}

function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem("shoppingCart");

    if (savedCart) {
        shoppingCart.items = JSON.parse(savedCart);
    }
}

function addProductEventListeners() {
    const addProductButtons = document.querySelectorAll(".add-to-cart");

    addProductButtons.forEach((button) => {
        button.addEventListener("click", (e) => {
            const product = {
                id: e.target.getAttribute("data-id"),
                title: e.target.parentElement.querySelector("h3").innerText,
                price: parseFloat(
                    e.target.parentElement.querySelector("p").innerText.replace("Цена: ", "").replace(" руб.", "")
                ),
                image: e.target.parentElement.querySelector("img").src,
            };

            shoppingCart.addItem(product);
        });
    });
}

function init() {
    loadCartFromLocalStorage();

    const isCartPage = document.querySelector(".shopping-cart") !== null;
    const isProductsPage = document.querySelector(".product-list") !== null;

    if (isCartPage) {
        const cartItems = document.querySelector(".cart-items");
        const totalPrice = document.querySelector(".total-price");
        const checkoutButton = document.querySelector(".btn-checkout");

        shoppingCart.init(cartItems, totalPrice, checkoutButton);
        shoppingCart.renderCartItems();
    }

    if (isProductsPage) {
        addProductEventListeners();
    }
}

init();



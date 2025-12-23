// index logistics

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function addToCart(productName, productPrice) {
    let existingProduct = cart.find(item => item.name === productName);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({
            name: productName,
            price: productPrice,
            quantity: 1
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    alert(productName + " added to cart!");
}

// fade logistics in index
const faders = document.querySelectorAll(".fade-in");

window.addEventListener("scroll", () => {
  faders.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      el.classList.add("show");
    }
  });
});

const subscribeBtn = document.getElementById("subscribeBtn");

if (subscribeBtn) {
  subscribeBtn.addEventListener("click", () => {
    const emailInput = document.getElementById("subscribeEmail");
    const msg = document.getElementById("subscribeMsg");

    if (emailInput.value === "") {
      msg.textContent = "Please enter a valid email address.";
      msg.style.color = "red";
      return;
    }

    msg.textContent = "Thanks for subscribing! 🎉";
    msg.style.color = "green";
    emailInput.value = "";
  });
}


// cart logistics
function displayCart() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let cartItems = document.getElementById("cartItems");
    let total = 0;

    if (!cartItems) return;

    if (cart.length === 0) {
        cartItems.innerHTML = "<p>Your cart is empty.</p>";
        document.getElementById("totalPrice").innerText = "";
        return;
    }

    cartItems.innerHTML = "";

    cart.forEach((item, index) => {
        let qty = item.quantity || 1;
        let itemTotal = item.price * qty;
        total += itemTotal;

        cartItems.innerHTML += `
            <div class="cart-item">
                <span>
                ${item.name} × ${qty} — ₹${itemTotal}
                </span>
                <div>
                    <button onclick="decreaseQty(${index})">−</button>
                    <button onclick="increaseQty(${index})">+</button>
                    <button onclick="removeFromCart(${index})">Remove</button>
                </div>
            </div>
        `;
    });

    document.getElementById("totalPrice").innerText = "Total: ₹" + total;
}


function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
}

if (window.location.href.includes("cart.html")) {
    displayCart();
}
function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    let countElement = document.getElementById("cartCount");
    if (countElement) {
        countElement.innerText = totalItems;
    }
}

updateCartCount();

//quality control functions

function increaseQty(index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart[index].quantity += 1;
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
    updateCartCount();
}

function decreaseQty(index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart[index].quantity > 1) {
        cart[index].quantity -= 1;
    } else {
        cart.splice(index, 1);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
    updateCartCount();
}
// shop logistics
const searchInput = document.getElementById("searchInput");

if (searchInput) {
  searchInput.addEventListener("keyup", () => {
    const searchValue = searchInput.value.toLowerCase();
    const products = document.querySelectorAll(".product-card");

    products.forEach(product => {
      const productName = product.querySelector("h3").innerText.toLowerCase();

      if (productName.includes(searchValue)) {
        product.style.display = "block";
      } else {
        product.style.display = "none";
      }
    });

    checkEmptyState();
  });
}
// 🔹 Restore search value on page load
const savedSearch = localStorage.getItem("shopSearch");

if (searchInput && savedSearch) {
  searchInput.value = savedSearch;
  searchInput.dispatchEvent(new Event("keyup"));
}


const filterButtons = document.querySelectorAll(".filter-btn");
const productCards = document.querySelectorAll(".product-card");

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    // Active button styling
    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const category = btn.dataset.category;

    productCards.forEach(card => {
      const productCategory = card.dataset.category;

      if (category === "all" || productCategory === category) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  });
});

checkEmptyState(); 

function checkEmptyState() {
  const products = document.querySelectorAll(".product-card");
  const msg = document.getElementById("noProductsMsg");

  let visibleCount = 0;

  products.forEach(product => {
    if (product.style.display !== "none") {
      visibleCount++;
    }
  });

  if (msg) {
    msg.style.display = visibleCount === 0 ? "block" : "none";
  }
}

const sortSelect = document.getElementById("sortPrice");

if (sortSelect) {
  sortSelect.addEventListener("change", () => {
    const productsContainer = document.querySelector(".product-container");
    const products = Array.from(document.querySelectorAll(".product-card"));
    const sortValue = sortSelect.value;

    let sortedProducts = products;

    if (sortValue === "low-high") {
      sortedProducts = products.sort((a, b) => {
        const priceA = parseInt(a.querySelector("p").innerText.replace("₹", ""));
        const priceB = parseInt(b.querySelector("p").innerText.replace("₹", ""));
        return priceA - priceB;
      });
    }

    if (sortValue === "high-low") {
      sortedProducts = products.sort((a, b) => {
        const priceA = parseInt(a.querySelector("p").innerText.replace("₹", ""));
        const priceB = parseInt(b.querySelector("p").innerText.replace("₹", ""));
        return priceB - priceA;
      });
    }

    productsContainer.innerHTML = "";
    sortedProducts.forEach(product => productsContainer.appendChild(product));

    checkEmptyState();
  });
}

// CHECKOUT PAGE LOGIC

const orderItems = document.getElementById("orderItems");
const orderTotal = document.getElementById("orderTotal");
const placeOrderBtn = document.getElementById("placeOrderBtn");
const orderMsg = document.getElementById("orderMsg");

if (orderItems && orderTotal) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  let total = 0;

  cart.forEach(item => {
    const div = document.createElement("div");
    div.innerText = `${item.name} × ${item.quantity} — ₹${item.price * item.quantity}`;
    orderItems.appendChild(div);

    total += item.price * item.quantity;
  });

  orderTotal.innerText = total;
}

if (placeOrderBtn) {
  placeOrderBtn.addEventListener("click", () => {
    localStorage.removeItem("cart"); // clear cart
    orderMsg.innerText = "🎉 Order placed successfully!";
  });
}


// index logistics

let cart = JSON.parse(localStorage.getItem("cart")) || [];

function addToCart(button, name, price) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existingItem = cart.find(item => item.name === name);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ name, price, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  // 🎨 BUTTON UI CHANGE
  button.classList.add("added");
  button.innerText = "Added";

  // Optional: prevent multiple clicks immediately
  button.disabled = true;

  updateCartCount();
  updateAddToCartButtons(); 
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

    const checkoutBtn = document.getElementById("checkoutBtn"); // 🔹 ADD THIS

    if (!cartItems) return;

    if (cart.length === 0) {
        cartItems.innerHTML = "<p>Your cart is empty.</p>";
        document.getElementById("totalPrice").innerText = "";

        // 🔹 DISABLE CHECKOUT BUTTON
        if (checkoutBtn) {
            checkoutBtn.style.pointerEvents = "none";
            checkoutBtn.style.opacity = "0.5";
            checkoutBtn.style.cursor = "not-allowed";
        }

        return;
    }

    // 🔹 ENABLE CHECKOUT BUTTON (cart has items)
    if (checkoutBtn) {
        checkoutBtn.style.pointerEvents = "auto";
        checkoutBtn.style.opacity = "1";
        checkoutBtn.style.cursor = "pointer";
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
  
    updateAddToCartButtons();
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

document.addEventListener("DOMContentLoaded", () => {
  updateAddToCartButtons();
});

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

function updateAddToCartButtons() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const buttons = document.querySelectorAll(".add-to-cart-btn");

  buttons.forEach(btn => {
    const productName = btn.getAttribute("onclick").match(/'([^']+)'/)[1];

    const isInCart = cart.some(item => item.name === productName);

    if (isInCart) {
      btn.classList.add("added");
      btn.innerText = "Added";
      btn.disabled = true;
    } else {
      btn.classList.remove("added");
      btn.innerText = "Add to Cart";
      btn.disabled = false;
    }
  });
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

if (placeOrderBtn) {
  placeOrderBtn.addEventListener("click", () => {

    const name = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const address = document.getElementById("address").value.trim();
    const city = document.getElementById("city").value.trim();
    const pincode = document.getElementById("pincode").value.trim();

    // 🔹 Validation patterns
    const namePattern = /^[A-Za-z ]{3,}$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cityPattern = /^[A-Za-z ]+$/;
    const pincodePattern = /^[0-9]{6}$/;

    // 🔹 Empty check
    if (!name || !email || !address || !city || !pincode) {
      showError("Please fill in all required details.");
      return;
    }

    // 🔹 Name check
    if (!namePattern.test(name)) {
      showError("Name should contain only letters (min 3 characters).");
      return;
    }

    // 🔹 Email check
    if (!emailPattern.test(email)) {
      showError("Please enter a valid email address.");
      return;
    }

    // 🔹 Address check
    if (address.length < 10) {
      showError("Address must be at least 10 characters.");
      return;
    }

    // 🔹 City check
    if (!cityPattern.test(city)) {
      showError("City should contain only letters.");
      return;
    }

    // 🔹 Pincode check
    if (!pincodePattern.test(pincode)) {
      showError("Pincode must be exactly 6 digits.");
      return;
    }

    // ✅ SUCCESS
    localStorage.removeItem("cart");
    orderMsg.style.color = "green";
    orderMsg.innerText = "🎉 Order placed successfully!";
  });
}

// 🔹 Helper function
function showError(message) {
  orderMsg.style.color = "red";
  orderMsg.innerText = "❌ " + message;
}


if (orderItems && orderTotal) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  let total = 0;

  if (cart.length === 0) {
    orderItems.innerHTML = "<p>Your cart is empty 🛒</p>";
    orderTotal.innerText = "0";

    if (placeOrderBtn) {
      placeOrderBtn.disabled = true;
      placeOrderBtn.style.background = "#ccc";
      placeOrderBtn.style.cursor = "not-allowed";
    }
  } else {
    cart.forEach(item => {
      const div = document.createElement("div");
      div.innerText = `${item.name} × ${item.quantity} — ₹${item.price * item.quantity}`;
      orderItems.appendChild(div);

      total += item.price * item.quantity;
    });

    orderTotal.innerText = total;
  }
}









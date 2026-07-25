document.addEventListener("DOMContentLoaded", () => {
  let selectedColor = "Purple";
  let selectedColorImg = "./images/purple.png";
  let selectedSize = "M";
  let selectedPrice = 79;
  let currentQuantity = 0;
  let cart = [];

  const productImage = document.getElementById("product-image");
  const quantityDisplay = document.getElementById("quantity");
  const addToCartBtn = document.getElementById("add-to-cart");
  const checkoutContainer = document.getElementById("checkout-container");
  const checkoutBtn = document.getElementById("checkout-btn");
  const cartCountDisplay = document.getElementById("cart-count");
  const cartModal = document.getElementById("cart-modal");
  const cartItemsTable = document.getElementById("cart-items");
  const continueShoppingBtn = document.getElementById("continue-shopping");
  const finalCheckoutBtn = document.getElementById("checkOut");

  const colorBtns = {
    purple: {
      btn: document.getElementById("purple-color"),
      name: "Purple",
      img: "./images/purple.png",
    },
    teal: {
      btn: document.getElementById("teal-color"),
      name: "Teal",
      img: "./images/teal.png",
    },
    cyan: {
      btn: document.getElementById("cyan-color"),
      name: "Cyan",
      img: "./images/cyan.png",
    },
    gray: {
      btn: document.getElementById("gray-color"),
      name: "Space Gray",
      img: "./images/gray.png",
    },
  };

  const sizeBtns = {
    S: { btn: document.getElementById("size-S"), price: 69 },
    M: { btn: document.getElementById("size-M"), price: 79 },
    L: { btn: document.getElementById("size-L"), price: 89 },
    XL: { btn: document.getElementById("size-XL"), price: 99 },
  };

  Object.keys(colorBtns).forEach((key) => {
    const item = colorBtns[key];
    if (!item.btn) return;
    item.btn.addEventListener("click", () => {
      selectedColor = item.name;
      selectedColorImg = item.img;
      if (productImage) productImage.src = item.img;
      Object.values(colorBtns).forEach((c) => {
        if (c.btn) {
          c.btn.classList.remove(
            "ring-2",
            "ring-purple-500/50",
            "ring-offset-2",
            "border-purple-400",
          );
          c.btn.classList.add("border-slate-700");
        }
      });
      item.btn.classList.add(
        "ring-2",
        "ring-purple-500/50",
        "ring-offset-2",
        "border-purple-400",
      );
      item.btn.classList.remove("border-slate-700");
    });
  });

  Object.keys(sizeBtns).forEach((sizeKey) => {
    const item = sizeBtns[sizeKey];
    if (!item.btn) return;
    item.btn.addEventListener("click", () => {
      selectedSize = sizeKey;
      selectedPrice = item.price;
      Object.keys(sizeBtns).forEach((k) => {
        const b = sizeBtns[k].btn;
        if (b)
          b.className =
            "px-3 py-2.5 border border-white/10 bg-slate-800/40 rounded-xl text-xs font-bold text-slate-300 hover:border-amber-400/50 hover:text-amber-300 transition-all";
      });
      item.btn.className =
        "px-3 py-2.5 border border-amber-500/60 bg-amber-500/10 rounded-xl text-xs font-bold text-amber-300 shadow-sm shadow-amber-500/20 transition-all";
    });
  });

  const qtyBtns = document.querySelectorAll(".quantity-button");
  if (qtyBtns.length >= 2) {
    qtyBtns[0].addEventListener("click", () => {
      if (currentQuantity > 0) {
        currentQuantity--;
        quantityDisplay.innerText = currentQuantity;
      }
    });
    qtyBtns[1].addEventListener("click", () => {
      currentQuantity++;
      quantityDisplay.innerText = currentQuantity;
    });
  }

  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", () => {
      const qtyToAdd = currentQuantity === 0 ? 1 : currentQuantity;
      const existingIndex = cart.findIndex(
        (item) => item.color === selectedColor && item.size === selectedSize,
      );

      if (existingIndex > -1) {
        cart[existingIndex].quantity += qtyToAdd;
      } else {
        cart.push({
          name: "Classy Modern Smart Watch",
          color: selectedColor,
          size: selectedSize,
          price: selectedPrice,
          quantity: qtyToAdd,
          image: selectedColorImg,
        });
      }

      currentQuantity = 0;
      if (quantityDisplay) quantityDisplay.innerText = currentQuantity;
      updateCartUI();

      const origText = addToCartBtn.innerHTML;
      addToCartBtn.innerHTML = `<i class="fa-solid fa-check text-sm text-emerald-400"></i><span>Added to Cart!</span>`;
      setTimeout(() => {
        addToCartBtn.innerHTML = origText;
      }, 1500);
    });
  }

  function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCountDisplay) cartCountDisplay.innerText = totalItems;
    if (totalItems > 0 && checkoutContainer) {
      checkoutContainer.classList.remove("hidden");
    } else if (checkoutContainer) {
      checkoutContainer.classList.add("hidden");
    }
  }

  function renderCartModal() {
    if (!cartItemsTable) return;
    cartItemsTable.innerHTML = "";

    if (cart.length === 0) {
      cartItemsTable.innerHTML = `<tr><td colspan="5" class="py-8 text-center text-slate-500 font-medium">Your shopping cart is currently empty.</td></tr>`;
      return;
    }

    let grandTotal = 0;
    cart.forEach((item) => {
      const itemTotal = item.price * item.quantity;
      grandTotal += itemTotal;
      const row = document.createElement("tr");
      row.className = "hover:bg-white/5 transition-colors";
      row.innerHTML = `
                <td class="py-3 px-3 flex items-center space-x-3">
                    <img src="${item.image}" onerror="this.src='https://images.unsplash.com/photo-1579586337278-3ffaac4e3e69?w=100&auto=format&fit=crop&q=80'" class="w-10 h-10 object-contain rounded-lg bg-slate-800 p-1 border border-white/10" alt="${item.name}">
                    <div>
                    <div class="font-bold text-white text-xs sm:text-sm">${item.name}</div>
                    <div class="text-[10px] text-slate-400">$${item.price} each</div>
                    </div>
                </td>
                <td class="py-3 px-3 text-slate-300 text-xs sm:text-sm">${item.color}</td>
                <td class="py-3 px-3 text-slate-300 text-xs sm:text-sm">${item.size}</td>
                <td class="py-3 px-3 text-center text-slate-300 text-xs sm:text-sm font-bold">${item.quantity}</td>
                <td class="py-3 px-3 text-right text-amber-400 font-extrabold text-xs sm:text-sm">$${itemTotal.toFixed(2)}</td>
                `;
      cartItemsTable.appendChild(row);
    });

    const totalRow = document.createElement("tr");
    totalRow.className = "border-t border-white/10 font-bold";
    totalRow.innerHTML = `
                <td colspan="4" class="pt-4 px-3 text-right uppercase tracking-wider text-xs text-slate-400">Total Amount:</td>
                <td class="pt-4 px-3 text-right text-base text-amber-300 font-black">$${grandTotal.toFixed(2)}</td>
            `;
    cartItemsTable.appendChild(totalRow);
  }

  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      renderCartModal();
      if (cartModal) cartModal.classList.remove("hidden");
    });
  }

  if (continueShoppingBtn) {
    continueShoppingBtn.addEventListener("click", () => {
      if (cartModal) cartModal.classList.add("hidden");
    });
  }

  if (cartModal) {
    cartModal.addEventListener("click", (e) => {
      if (e.target === cartModal) cartModal.classList.add("hidden");
    });
  }

  if (finalCheckoutBtn) {
    finalCheckoutBtn.addEventListener("click", () => {
      if (cart.length === 0) return;
      alert("Order placed successfully! Thank you for purchasing.");
      cart = [];
      updateCartUI();
      if (cartModal) cartModal.classList.add("hidden");
    });
  }
});

document.addEventListener("DOMContentLoaded", () => {
  let cart = [];
  const cartItemsContainer = document.querySelector(".cart-items");
  const cartTotalContainer = document.querySelector(".order-total span");
  const cartCountContainer = document.querySelector(".order-review h2");
  const modal = document.getElementById("order-confirmation");
  const modalContentContainer = document.querySelector(
    ".order-summary .summary-items"
  );
  const modalTotalContainer = document.querySelector(
    ".order-summary .summary-total span"
  );
  let flipTimer;

  document.querySelectorAll(".add-to-cart-btn").forEach((button) => {
    button.addEventListener("click", (event) => {
      toggleCardFlip(event);
      addToCart(event);
      document.querySelector(".confirm-order-btn").style.visibility = "visible";
      document.querySelector(".items-to-show").style.visibility = "hidden"; 
      document.querySelector(".empty-cart-image").style.visibility = "hidden"; 
    });
  });

  document.querySelectorAll(".plus-btn, .minus-btn").forEach((button) => {
    button.addEventListener("click", (event) => {
      updateQuantity(event);
    });
  });

  document
    .querySelector(".confirm-order-btn")
    .addEventListener("click", showOrderConfirmation);
  document
    .querySelector(".new-order-btn")
    .addEventListener("click", startNewOrder);
  document.querySelector(".close").addEventListener("click", closeModal);

  function toggleCardFlip(event) {
    const productCard = event.currentTarget.closest(".product-card");
    productCard.classList.toggle("flipped");
  }

  function addToCart(event) {
    const menuCard = event.currentTarget.closest(".menu-card");
    const itemName = menuCard.getAttribute("data-name");
    const itemPrice = parseFloat(menuCard.getAttribute("data-price"));

    const existingItem = cart.find((item) => item.name === itemName);
    if (existingItem) {
      existingItem.quantity++;
      existingItem.totalPrice += itemPrice;
    } else {
      cart.push({
        name: itemName,
        price: itemPrice,
        quantity: 1,
        totalPrice: itemPrice,
      });
    }

    updateCart();
  }

  function updateQuantity(event) {
    const isAdding = event.currentTarget.classList.contains("plus-btn");
    const productCard = event.currentTarget.closest(".product-card");
    const menuCard = productCard.closest(".menu-card");
    const itemName = menuCard.getAttribute("data-name");
    const itemPrice = parseFloat(menuCard.getAttribute("data-price"));

    const existingItem = cart.find((item) => item.name === itemName);
    if (existingItem) {
      if (isAdding) {
        existingItem.quantity++;
        existingItem.totalPrice += itemPrice;
      } else if (existingItem.quantity > 1) {
        existingItem.quantity--;
        existingItem.totalPrice -= itemPrice;
      }
    }

    const quantityElement = productCard.querySelector(".quantity");
    quantityElement.textContent = existingItem.quantity;

    updateCart();

    clearTimeout(flipTimer);
    flipTimer = setTimeout(() => {
      productCard.classList.remove("flipped");
    }, 400);
  }

  function updateCart() {
    cartItemsContainer.innerHTML = "";
    let totalItems = 0;
    let totalPrice = 0;

    cart.forEach((item) => {
      totalItems += item.quantity;
      totalPrice += item.totalPrice;

      const cartItem = document.createElement("li");
      cartItem.innerHTML = `
            <span style="font-weight:600;">${item.name}</span><br>  <span style="color:var(--Red);">${item.quantity
      }x</span>&nbsp;&nbsp;   <span style="color:var(--Rose-400);"> @$${item.price.toFixed(
        2
      )}&nbsp;&nbsp; <span style="font-weight:600;">$${item.totalPrice.toFixed(
        2
      )}</span></span>
            <button class="remove-item-btn" data-name="${
              item.name
            }"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>close-circle-outline</title><path d="M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2C6.47,2 2,6.47 2,12C2,17.53 6.47,22 12,22C17.53,22 22,17.53 22,12C22,6.47 17.53,2 12,2M14.59,8L12,10.59L9.41,8L8,9.41L10.59,12L8,14.59L9.41,16L12,13.41L14.59,16L16,14.59L13.41,12L16,9.41L14.59,8Z" /></svg></button><hr>
        `;
      cartItemsContainer.appendChild(cartItem);
    });

    cartTotalContainer.innerHTML = `<span style=" position:absolute; padding:2rem 0 0 2.7rem;">Order Total: <span style='font-weight:900; margin-left:8rem'>$${totalPrice.toFixed(2)}</span></span>
    <br><p class="safe-paper" style='text-align:center; background-color:var(--Rose-50); width:max-content; padding:0.5rem; border-radius:10px; color:var(--Rose-900); margin:3rem auto -5rem;'><img style="width: 15px;  display:inline;" src="./assets/images/icon-carbon-neutral.svg" alt="icon carbon neutral"> This is a <b>carbon neutral</b> delivery</p>`;
    cartCountContainer.textContent = `Your Cart (${totalItems})`;

    document.querySelectorAll(".remove-item-btn").forEach((button) => {
      button.addEventListener("click", removeFromCart);
    });
  }

  function removeFromCart(event) {
    const itemName = event.currentTarget.getAttribute("data-name");
    const itemIndex = cart.findIndex((item) => item.name === itemName);

    if (itemIndex !== -1) {
      cart.splice(itemIndex, 1);
    }

    updateCart();
  }

  function showOrderConfirmation() {
    modal.style.display = "block";
    modalContentContainer.innerHTML = "";

    cart.forEach((item) => {
      const summaryItem = document.createElement("li");
      summaryItem.innerHTML = `
            <span style="font-weight:600;">${item.name}</span><br>  <span style="color:var(--Red);">${item.quantity
      }x</span>&nbsp;&nbsp;   <span style="color:var(--Rose-400);"> @$${item.price.toFixed(
        2
      )}&nbsp;&nbsp; <span style="font-weight:600; margin-left: 7rem;">$${item.totalPrice.toFixed(
        2
      )}</span></span><hr>`;
            summaryItem.style.listStyleType = 'none';
      modalContentContainer.appendChild(summaryItem);
    });

    const totalPrice = cart.reduce((sum, item) => sum + item.totalPrice, 0);
    modalTotalContainer.innerHTML = `Order Total: <span style='font-weight:900; font-size: 1.3rem; margin-left:9rem'>$${totalPrice.toFixed(2)}</span>`;
  }

  function startNewOrder() {
    cart = [];
    updateCart();
    closeModal();
  }

  function closeModal() {
    modal.style.display = "none";
  }
});

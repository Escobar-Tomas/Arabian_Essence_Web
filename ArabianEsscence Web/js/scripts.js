

document.addEventListener("DOMContentLoaded", () => {
  // --- CONFIGURACIÓN ---

  // Reemplaza esto con tu número de WhatsApp (incluyendo código de país, sin + o 00)
  const whatsappPhoneNumber = "543813524998";

  // Lista de productos
const products = [
    {
        id: 1,
        name: "Khamrah",
        price: 38500,
        description: "Aroma intenso y elegante. Para almas dominantes.",
        image: "../imgs/perfume1.webp"
    },
    {
        id: 2,
        name: "Badee Al Oud",
        price: 34900,
        description: "Oud intenso y misterio nocturno.",
        image: "../imgs/perfume2.webp"
    },
    {
        id: 3,
        name: "Asad",
        price: 41200,
        description: "Notas cálidas, dulces y sensuales.",
        image: "../imgs/perfume3.jpg"
    },
    {
        id: 4,
        name: "Layali",
        price: 29900,
        description: "Frescura oriental con un toque floral.",
        image: "../imgs/perfume3.webp"
    },
    {
        id: 5,
        name: "Zahra",
        price: 27500,
        description: "Esencia vibrante y juvenil.",
        image: "../imgs/perfume4.jpeg"
    },
    {
        id: 6,
        name: "Sultan's Dream",
        price: 45000,
        description: "Mezcla exótica de especias y maderas preciosas.",
        image: "../imgs/perfume6.webp"
    },
    {
        id: 7,
        name: "Nuit Mystique",
        price: 39000,
        description: "Aroma seductor para noches inolvidables.",
        image: "../imgs/perfume7.jpg"
    },
    {
        id: 8,
        name: "Desert Rose",
        price: 32000,
        description: "Fragancia fresca con toques florales y amaderados.",
        image: "../imgs/perfume8.jpeg"
    }
];

  // --- ESTADO DE LA APLICACIÓN ---

  let cart = []; // Array para guardar los items del carrito

  // --- SELECTORES DEL DOM ---

  const productsGrid = document.getElementById("products-grid");
  const cartModal = document.getElementById("cart-modal");
  const openCartBtn = document.getElementById("open-cart-btn");
  const closeCartBtn = document.getElementById("close-cart-btn");
  const cartItemsContainer = document.getElementById("cart-items");
  const cartEmptyMsg = document.getElementById("cart-empty-msg");
  const cartTotal = document.getElementById("cart-total");
  const checkoutBtn = document.getElementById("checkout-btn");
  const cartCountBadge = document.getElementById("cart-count-badge");

  // --- FUNCIONES ---

  /**
   * Formatea un número a moneda (ARS)
   */
  function formatCurrency(amount) {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(amount);
  }

  /**
   * Muestra los productos en la página
   */
function renderProducts() {
    productsGrid.innerHTML = ""; // Limpiar grilla

    products.forEach((product) => {
        const productCard = `
            <div class="group bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl">
                <div class="overflow-hidden h-64">
                    <img
                        src="${product.image}"
                        alt="${product.name}"
                        class="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                    />
                </div>

                <div class="p-6">
                    <h3 class="text-2xl font-semibold text-white mb-2">${product.name}</h3>
                    <p class="text-gray-400 text-sm mb-4">${product.description}</p>

                    <div class="flex items-center justify-between gap-4">
                        <span class="text-2xl font-bold text-yellow-400">${formatCurrency(product.price)}</span>

                        <button
                            class="add-to-cart-btn inline-flex items-center gap-2 px-4 py-2 bg-yellow-500 text-black font-semibold rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                            data-id="${product.id}"
                            aria-label="Agregar ${product.name} al carrito"
                        >
                            <span class="text-lg font-bold">+</span>
                            <span class="hidden sm:inline">Agregar</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
        productsGrid.innerHTML += productCard;
    });
}

  /**
   * Muestra los items en el modal del carrito
   */
  function renderCart() {
    cartItemsContainer.innerHTML = ""; // Limpiar items

    if (cart.length === 0) {
      cartEmptyMsg.classList.remove("hidden");
    } else {
      cartEmptyMsg.classList.add("hidden");
      cart.forEach((item) => {
        const cartItem = `
                            <div class="flex justify-between items-center text-white" data-id="${
                              item.id
                            }">
                                <div>
                                    <h4 class="font-semibold">${item.name}</h4>
                                    <p class="text-sm text-gray-400">${formatCurrency(
                                      item.price
                                    )} x ${
          item.quantity
        } = <span class="font-semibold">${formatCurrency(
          item.price * item.quantity
        )}</span></p>
                                </div>
                                <div class="flex items-center gap-2">
                                    <button class="text-gray-400 hover:text-white text-lg font-bold update-quantity-btn" data-action="decrease">-</button>
                                    <span class="w-6 text-center">${
                                      item.quantity
                                    }</span>
                                    <button class="text-gray-400 hover:text-white text-lg font-bold update-quantity-btn" data-action="increase">+</button>
                                    <button class="ml-2 text-red-500 hover:text-red-400 text-lg remove-from-cart-btn">&times;</button>
                                </div>
                            </div>
                        `;
        cartItemsContainer.innerHTML += cartItem;
      });
    }

    // Actualizar total
    const total = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    cartTotal.textContent = formatCurrency(total);

    // Actualizar contador del ícono
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (totalItems > 0) {
      cartCountBadge.textContent = totalItems;
      cartCountBadge.classList.remove("hidden");
    } else {
      cartCountBadge.classList.add("hidden");
    }

    // Habilitar/Deshabilitar botón de checkout
    checkoutBtn.disabled = cart.length === 0;
  }

  /**
   * Agrega un producto al carrito
   */
  function addToCart(productId) {
    const product = products.find((p) => p.id === productId);
    const existingItem = cart.find((item) => item.id === productId);

    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    renderCart();
  }

  /**
   * Actualiza la cantidad de un item o lo elimina
   */
  function updateCart(productId, action) {
    const itemIndex = cart.findIndex((item) => item.id === productId);
    if (itemIndex === -1) return;

    if (action === "increase") {
      cart[itemIndex].quantity++;
    } else if (action === "decrease") {
      cart[itemIndex].quantity--;
      if (cart[itemIndex].quantity <= 0) {
        cart.splice(itemIndex, 1); // Eliminar si la cantidad es 0
      }
    } else if (action === "remove") {
      cart.splice(itemIndex, 1); // Eliminar directamente
    }

    renderCart();
  }

  /**
   * Muestra u oculta el modal del carrito
   */
  function toggleCartModal(show) {
    if (show) {
      cartModal.classList.remove("hidden");
    } else {
      cartModal.classList.add("hidden");
    }
  }

  /**
   * Genera el mensaje de WhatsApp y redirige
   */
  function handleCheckout() {
    if (cart.length === 0) return;

    let message =
      "¡Hola Arabian Essence! ✨\n\nQuisiera hacer el siguiente pedido:\n\n";

    cart.forEach((item) => {
      message += `*${item.name}* (x${
        item.quantity
      })\nSubtotal: ${formatCurrency(item.price * item.quantity)}\n\n`;
    });

    const total = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    message += `*TOTAL DEL PEDIDO: ${formatCurrency(total)}*`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${whatsappPhoneNumber}?text=${encodedMessage}`;

    window.open(whatsappURL, "_blank");
  }

  // --- EVENT LISTENERS ---

  // Mostrar productos al cargar
  renderProducts();

  // Abrir modal
  openCartBtn.addEventListener("click", () => toggleCartModal(true));

  // Cerrar modal
  closeCartBtn.addEventListener("click", () => toggleCartModal(false));
  cartModal.addEventListener("click", (e) => {
    if (e.target === cartModal) {
      toggleCartModal(false);
    }
  });

  // Botón de Checkout
  checkoutBtn.addEventListener("click", handleCheckout);

  // Clics en la grilla de productos (delegación de eventos)
  productsGrid.addEventListener("click", (e) => {
    const btn = e.target.closest(".add-to-cart-btn");
    if (btn) {
      const id = parseInt(btn.dataset.id);
      addToCart(id);
      // toggleCartModal(true); // <-- Se eliminó esta línea que abría el modal
    }
  });

  // Clics en los items del carrito (delegación de eventos)
  cartItemsContainer.addEventListener("click", (e) => {
    const itemDiv = e.target.closest("[data-id]");
    if (!itemDiv) return;

    const id = parseInt(itemDiv.dataset.id);

    // Botón de remover (x)
    if (e.target.closest(".remove-from-cart-btn")) {
      updateCart(id, "remove");
    }

    // Botones de +/-
    if (e.target.closest(".update-quantity-btn")) {
      const action = e.target.closest(".update-quantity-btn").dataset.action;
      updateCart(id, action);
    }
  });
});

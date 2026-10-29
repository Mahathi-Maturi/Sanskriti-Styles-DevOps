document.addEventListener('DOMContentLoaded', () => {
    // Initialize cart from localStorage or as an empty array
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCountSpan = document.getElementById('cart-count'); // Element to display cart item count

    // Function to update the cart count in the navigation
    function updateCartCount() {
        // Calculate total number of items (considering quantity)
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCountSpan) { // Ensure the element exists before trying to update it
            cartCountSpan.textContent = totalItems;
        }
    }

    // Function to add a product to the cart
    function addToCart(productName, productPrice) {
        const product = {
            name: productName,
            price: productPrice,
            quantity: 1 // Start with quantity 1
        };

        // Check if the product already exists in the cart
        const existingProductIndex = cart.findIndex(item => item.name === productName);

        if (existingProductIndex > -1) {
            // If product exists, increment its quantity
            cart[existingProductIndex].quantity++;
        } else {
            // If product is new, add it to the cart
            cart.push(product);
        }

        // Save the updated cart to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount(); // Update the cart count in the navigation
        alert(`${productName} added to cart!`);
    }

    // Attach event listeners to all "Add to Cart" buttons on the page
    // This targets buttons with the class 'add-to-cart-btn'
    document.querySelectorAll('.product-card .add-to-cart-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const productName = event.target.dataset.productName;
            const productPrice = parseFloat(event.target.dataset.productPrice); // Ensure price is a number
            if (productName && productPrice) {
                addToCart(productName, productPrice);
            } else {
                console.error("Missing product data attributes on Add to Cart button.");
            }
        });
    });

    // Function to display cart items on the cart page (if the element exists)
    function displayCartItems() {
        const container = document.getElementById("cart-items");
        if (!container) return; // Exit if not on the cart page (i.e., not on cart.html)

        container.innerHTML = ''; // Clear previous content

        if (cart.length === 0) {
            container.innerHTML = "<p>Your cart is empty. Go back to <a href='index.html'>Home</a> to add items.</p>";
        } else {
            let totalCartPrice = 0;
            const ul = document.createElement('ul');
            ul.className = 'cart-list';

            cart.forEach((item) => {
                const li = document.createElement('li');
                const itemTotalPrice = item.price * item.quantity;
                totalCartPrice += itemTotalPrice;

                li.innerHTML = `
                    <div class="cart-item">
                        <span><strong>${item.name}</strong></span>
                        <span>Quantity: ${item.quantity}</span>
                        <span>Price: ₹${item.price.toLocaleString('en-IN')}</span>
                        <span>Total: ₹${itemTotalPrice.toLocaleString('en-IN')}</span>
                    </div>
                `;
                ul.appendChild(li);
            });
            container.appendChild(ul);

            const totalDiv = document.createElement('div');
            totalDiv.className = 'cart-total';
            totalDiv.innerHTML = `<h3>Total Cart Value: ₹${totalCartPrice.toLocaleString('en-IN')}</h3>`;
            container.appendChild(totalDiv);
        }
    }

    // Initial call to update cart count when any page loads
    updateCartCount();

    // Call displayCartItems only if on the cart page
    if (document.getElementById("cart-items")) {
        displayCartItems();
    }

    // Event listener for the "Clear Cart" button on cart.html
    const clearCartBtn = document.getElementById('clear-cart-btn');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', () => {
            localStorage.removeItem('cart'); // Remove cart data from localStorage
            cart = []; // Clear the local cart array
            updateCartCount(); // Update the nav count
            displayCartItems(); // Re-display cart (now empty)
            alert('Your cart has been cleared!');
        });
    }

    // Event listener for the "Proceed to Checkout" button on cart.html
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                alert('Your cart is empty. Please add items before checking out.');
                return;
            }
            alert('Proceeding to checkout! (This is a dummy action. In a real application, you would navigate to a checkout form.)');
            // In a real application, you might redirect to a checkout page:
            // window.location.href = 'checkout.html';
        });
    }

    // Login Form Submission Handler (for login.html)
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Prevent default form submission

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // Basic validation and dummy login
            if (email === 'user@example.com' && password === 'password123') {
                alert('Login successful! Welcome!');
                // In a real application, you would handle user session (e.g., set localStorage item)
                // and redirect: window.location.href = 'index.html';
            } else {
                alert('Invalid email or password. Please try again.');
            }
        });
    }

    // Register Form Submission Handler (for register.html)
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Prevent default form submission

            const fullName = document.getElementById('reg-fullname').value;
            const email = document.getElementById('reg-email').value;
            const password = document.getElementById('reg-password').value;
            const confirmPassword = document.getElementById('reg-confirm-password').value;

            // Basic validation
            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }

            if (password.length < 6) {
                alert('Password must be at least 6 characters long.');
                return;
            }

            // In a real application, you would send this data to a server for registration
            // For this example, we'll just show an alert
            alert(`Registration successful for ${fullName} (${email})! (This is a dummy registration.)`);

            // Optionally, clear the form or redirect to login page
            registerForm.reset();
            // window.location.href = 'login.html'; // Uncomment to redirect after dummy registration
        });
    }
});
const API_URL = 'https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json';
const productContainer = document.getElementById('productContainer');
const tabButtons = document.querySelectorAll('.tab-btn');

let products = [];

async function fetchProducts() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        products = data.categories;
        showProducts('men');
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

function showProducts(category) {
    const categoryProducts = products.find(cat => cat.category_name.toLowerCase() === category).category_products;
    productContainer.innerHTML = '';

    categoryProducts.forEach(product => {
        const discount = calculateDiscount(product.price, product.compare_at_price);
        const productCard = `
            <div class="product-card">
                <div class="product-image-container">
                    <img src="${product.image}" alt="${product.title}" class="product-image">
                    ${product.badge_text ? `<span class="product-badge">${product.badge_text}</span>` : ''}
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.title}</h3>
                    <p class="product-vendor">${product.vendor}</p>
                    <p class="product-price">
                        <span class="current-price">$${product.price}</span>
                        <span class="compare-price">$${product.compare_at_price}</span>
                    </p>
                    <p class="product-discount">${discount}% off</p>
                    <button class="add-to-cart-btn">Add to Cart</button>
                </div>
            </div>
        `;
        productContainer.innerHTML += productCard;
    });
}

function calculateDiscount(price, comparePrice) {
    const discount = ((comparePrice - price) / comparePrice) * 100;
    return Math.round(discount);
}

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        tabButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        const category = button.dataset.category;
        showProducts(category);
    });
});

fetchProducts();
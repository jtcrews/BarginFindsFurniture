document.addEventListener('DOMContentLoaded', async () => {
    try {
        const page = window.location.pathname; // Get the current page's path

        // If we're on the index page, apply the splash functionality
        if (page === '/index.html' || page === '/') {
            // Fetch product data from the backend
            const response = await fetch('/api/products');
            const products = await response.json();

            // Find the "White Couch" product for the splash image
            const whiteCouch = products.find(product => product.name === 'White Couch');

            const splash = document.querySelector('.splash');
            if (splash && whiteCouch) {
                splash.style.backgroundImage = `url(${whiteCouch.image_url})`;
                splash.style.backgroundSize = 'cover';
                splash.style.backgroundPosition = 'center';
            }
        }

        // If we're on the products page, apply the product listing functionality
        if (page === '/products.html') {
            // Fetch product data from the backend
            const response = await fetch('/api/products');
            const products = await response.json();

            // Featured items: Only show items with is_promoted set to 1
            const featuredItems = products.filter(product => product.is_promoted === 1);
            const featuredSection = document.querySelector('#featured-items');
            if (featuredSection) {
                featuredSection.innerHTML = ''; // Clear any previous featured items

                featuredItems.forEach(item => {
                    const itemDiv = document.createElement('div');
                    itemDiv.classList.add('item');
                    itemDiv.innerHTML = `
                        <img src="${item.image_url}" alt="${item.name}">
                        <h3>${item.name}</h3>
                        <p>$${item.price}</p>
                        <a href="details.html?id=${item.id}">View Item</a>
                    `;
                    featuredSection.appendChild(itemDiv);
                });
            }

            // Categories Section: Add hardcoded category images from the database
            const categories = [
                { category: 'Couches', image: '/images/grCouch.jpg' },
                { category: 'Chairs', image: '/images/chair.jpg' },
                { category: 'Lamps', image: '/images/lamp.jpg' }
            ];

            const categorySection = document.querySelector('#categories');
            if (categorySection) {
                categorySection.innerHTML = ''; // Clear existing categories if any

                categories.forEach(category => {
                    const categoryDiv = document.createElement('div');
                    categoryDiv.classList.add('category');
                    categoryDiv.innerHTML = `
                        <img src="${category.image}" alt="${category.category}">
                        <h3>${category.category}</h3>
                        <a href="#view">View ${category.category}</a>
                    `;
                    categorySection.appendChild(categoryDiv);
                });
            }
        }

        // Check if we're on the product details page by looking for the 'id' in the URL
if (window.location.pathname.includes('details.html')) {
    (async () => {
        try {
            // Get the product ID from the URL query string
            const urlParams = new URLSearchParams(window.location.search);
            const productId = urlParams.get('id');  // Get the 'id' query parameter

            if (!productId) {
                console.error('Product ID is missing from the URL');
                return;
            }

            // Fetch the product details from the backend using the product ID
            const response = await fetch(`/api/products/${productId}`);
            const product = await response.json();

            // Debugging: Check if the product is fetched correctly
            console.log('Fetched product:', product);

            if (!product) {
                console.error('Product not found');
                return;
            }

            // Populate the product details section with the fetched data
            const detailsPicture = document.querySelector('.details-picture');
            const productName = document.querySelector('.product-details h3');
            const productDescription = document.querySelector('.product-details p:nth-of-type(1)');
            const productPrice = document.querySelector('.product-details p:nth-of-type(2)');
            const productDimensions = document.querySelector('.product-details p:nth-of-type(3)');
            const productMaterial = document.querySelector('.product-details p:nth-of-type(4)');
            const productAvailability = document.querySelector('.product-details p:nth-of-type(5)');
            const productColorOptions = document.querySelector('.product-details p:nth-of-type(6)');

            // Debugging: Check if we have the correct elements
            console.log('Populating product details...');

            detailsPicture.src = product.image_url;
            detailsPicture.alt = product.name;
            productName.textContent = product.name;
            productDescription.textContent = product.description;
            productPrice.innerHTML = `<span id="descriptors">Price:</span> $${product.price}`;
            productDimensions.innerHTML = `<span id="descriptors">Dimensions:</span> ${product.dimensions}`;
            productMaterial.innerHTML = `<span id="descriptors">Material:</span> ${product.material}`;
            productAvailability.innerHTML = `<span id="descriptors">Availability:</span> ${product.availability}`;
            productColorOptions.innerHTML = `<span id="descriptors">Color Options:</span> ${product.color_options}`;

        } catch (error) {
            console.error('Error fetching product details:', error);
        }
    })();
}



    } catch (error) {
        console.error('Error fetching products:', error);
    }
});

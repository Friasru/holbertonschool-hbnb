// ===== API Configuration =====
const API_BASE_URL = 'http://localhost:5000/api/v1';

// ===== Cookie Management =====
function setCookie(name, value, days = 7) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    const expiresUTC = expires.toUTCString();
    document.cookie = `${name}=${value}; expires=${expiresUTC}; path=/`;
}

function getCookie(name) {
    const nameEQ = name + '=';
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.startsWith(nameEQ)) {
            return cookie.substring(nameEQ.length);
        }
    }
    return null;
}

function deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
}

// ===== Authentication Functions =====
async function loginUser(email, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const data = await response.json();
            setCookie('token', data.access_token, 7);
            return { success: true, data };
        } else {
            const errorData = await response.json();
            return { success: false, error: errorData.error || 'Login failed' };
        }
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, error: 'Network error. Please try again.' };
    }
}

function logoutUser() {
    deleteCookie('token');
}

function isUserLoggedIn() {
    return getCookie('token') !== null;
}

function getAuthToken() {
    return getCookie('token');
}

// ===== Login Form Handler =====
function setupLoginForm() {
    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const errorContainer = document.getElementById('error-message');

            if (errorContainer) {
                errorContainer.style.display = 'none';
                errorContainer.textContent = '';
            }

            const result = await loginUser(email, password);

            if (result.success) {
                window.location.href = 'index.html';
            } else {
                if (errorContainer) {
                    errorContainer.style.display = 'block';
                    errorContainer.textContent = result.error;
                } else {
                    alert('Login failed: ' + result.error);
                }
            }
        });
    }
}

// ===== Update Auth UI =====
function updateAuthUI() {
    const isLoggedIn = isUserLoggedIn();
    const loginLink = document.getElementById('login-link');
    const logoutButton = document.getElementById('logout-button');

    if (isLoggedIn) {
        if (loginLink) loginLink.style.display = 'none';
        if (logoutButton) logoutButton.style.display = '';
    } else {
        if (loginLink) loginLink.style.display = '';
        if (logoutButton) logoutButton.style.display = 'none';
    }
}

function handleLogout() {
    logoutUser();
    location.reload();
}

// ===== API Request Helper =====
async function fetchWithAuth(url, options = {}) {
    const token = getAuthToken();
    const headers = options.headers || {};

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    headers['Content-Type'] = 'application/json';

    return fetch(url, {
        ...options,
        headers
    });
}

// ===== Places Fetching and Display =====
let allPlaces = [];

async function fetchPlaces() {
    try {
        const response = await fetch(`${API_BASE_URL}/places/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            allPlaces = data;
            displayPlaces(allPlaces);
            return true;
        } else {
            console.error('Failed to fetch places');
            return false;
        }
    } catch (error) {
        console.error('Error fetching places:', error);
        return false;
    }
}

async function fetchPlaceDetails(placeId) {
    try {
        const response = await fetch(`${API_BASE_URL}/places/${placeId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            return await response.json();
        }
        return null;
    } catch (error) {
        console.error('Error fetching place details:', error);
        return null;
    }
}

function displayPlaces(places) {
    const placesList = document.getElementById('places-list');
    if (!placesList) return;

    placesList.innerHTML = '';

    if (places.length === 0) {
        placesList.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">No places found.</p>';
        return;
    }

    places.forEach(place => {
        const article = document.createElement('article');
        article.classList.add('place-card');
        article.id = `place-${place.id}`;
        
        const price = place.price || 'N/A';
        
        article.innerHTML = `
            <h3>${place.title || place.name || 'Untitled'}</h3>
            <div class="price">
                <span class="price-label">$ ${price}</span>
                <span> per night</span>
            </div>
            <a href="place.html?id=${place.id}" class="details-button">View Details</a>
        `;
        placesList.appendChild(article);
    });
}

// ===== Price Filtering =====
function setupPriceFilter() {
    const priceFilter = document.getElementById('price-filter');
    if (!priceFilter) return;

    priceFilter.addEventListener('change', (event) => {
        const selectedPrice = parseInt(event.target.value);
        filterPlacesByPrice(selectedPrice);
    });
}

function filterPlacesByPrice(maxPrice) {
    const placeCards = document.querySelectorAll('.place-card');

    placeCards.forEach(card => {
        const priceText = card.querySelector('.price-label').textContent;
        const price = parseInt(priceText.replace('$ ', ''));

        if (maxPrice === 0 || price <= maxPrice) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
}

// ===== Message Display Functions =====
function showErrorMessage(message) {
    const errorContainer = document.getElementById('error-message');
    if (errorContainer) {
        errorContainer.textContent = message;
        errorContainer.style.display = 'block';
    }
}

function showSuccessMessage(message) {
    const successContainer = document.getElementById('success-message');
    if (successContainer) {
        successContainer.textContent = message;
        successContainer.style.display = 'block';
    }
}

// ===== Initialize on DOMContentLoaded =====
document.addEventListener('DOMContentLoaded', async () => {
    setupLoginForm();
    updateAuthUI();
    setupPriceFilter();
    
    // Only load places if we're on the index page
    if (document.getElementById('places-list')) {
        const placesLoaded = await fetchPlaces();
        if (!placesLoaded) {
            console.log('Failed to load places from API');
        }
    }
});
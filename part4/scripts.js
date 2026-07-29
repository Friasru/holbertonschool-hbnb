// API Configuration
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
            // Store the JWT token in a cookie
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

            // Clear previous error messages
            if (errorContainer) {
                errorContainer.style.display = 'none';
                errorContainer.textContent = '';
            }

            const result = await loginUser(email, password);

            if (result.success) {
                // Redirect to main page
                window.location.href = 'index.html';
            } else {
                // Display error message
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

// ===== Update Auth Button =====
function updateAuthButton() {
    const authBtn = document.getElementById('authBtn');
    if (!authBtn) return;

    const isLoggedIn = isUserLoggedIn();

    if (isLoggedIn) {
        authBtn.textContent = 'Logout';
        authBtn.classList.add('logout');
        authBtn.onclick = handleLogout;
    } else {
        authBtn.textContent = 'Login';
        authBtn.classList.remove('logout');
        authBtn.onclick = () => {
            window.location.href = 'login.html';
        };
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

// ===== Sample Data Fallback =====
const placesData = {
    1: {
        id: 1,
        name: "Cozy Apartment",
        price: 100,
        host: "John Doe",
        description: "A comfortable and well-furnished apartment located in the heart of the city. Perfect for couples or solo travelers.",
        amenities: ["WiFi", "Air Conditioning", "Kitchen", "Parking"],
        reviews: [
            {
                id: 1,
                user: "Alice Johnson",
                rating: 5,
                comment: "Excellent place! Clean and comfortable."
            },
            {
                id: 2,
                user: "Bob Smith",
                rating: 4,
                comment: "Nice apartment, good location."
            }
        ]
    },
    2: {
        id: 2,
        name: "Modern Studio",
        price: 85,
        host: "Jane Smith",
        description: "A stylish studio apartment with modern amenities and great views.",
        amenities: ["WiFi", "TV", "Heating", "Washer"],
        reviews: [
            {
                id: 3,
                user: "Charlie Brown",
                rating: 5,
                comment: "Very modern and clean!"
            }
        ]
    },
    3: {
        id: 3,
        name: "Spacious House",
        price: 150,
        host: "Michael Johnson",
        description: "A spacious family house with multiple bedrooms and a garden.",
        amenities: ["WiFi", "Garden", "Garage", "Kitchen", "Heating"],
        reviews: []
    },
    4: {
        id: 4,
        name: "Beach Villa",
        price: 200,
        host: "Emma Wilson",
        description: "Luxurious villa with direct beach access and stunning ocean views.",
        amenities: ["WiFi", "Pool", "Patio", "Kitchen", "Air Conditioning", "Parking"],
        reviews: [
            {
                id: 4,
                user: "David Lee",
                rating: 5,
                comment: "Amazing place with beautiful views!"
            }
        ]
    }
};

const places = [
    {
        id: 1,
        name: "Cozy Apartment",
        price: 100,
        image: "apt1.jpg"
    },
    {
        id: 2,
        name: "Modern Studio",
        price: 85,
        image: "apt2.jpg"
    },
    {
        id: 3,
        name: "Spacious House",
        price: 150,
        image: "apt3.jpg"
    },
    {
        id: 4,
        name: "Beach Villa",
        price: 200,
        image: "apt4.jpg"
    }
];

// ===== Initialize on DOMContentLoaded =====
document.addEventListener('DOMContentLoaded', () => {
    setupLoginForm();
    updateAuthButton();
});
// ===== Get Place ID from URL =====
function getPlaceIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// ===== Fetch Place Details from API =====
async function fetchPlaceDetailsFromAPI(placeId) {
    try {
        const response = await fetch(`${API_BASE_URL}/places/${placeId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            return await response.json();
        } else {
            console.error('Failed to fetch place details:', response.status);
            return null;
        }
    } catch (error) {
        console.error('Error fetching place details:', error);
        return null;
    }
}

// ===== Display Place Details =====
function displayPlaceDetails(place) {
    const placeDetailsSection = document.getElementById('place-details');
    
    if (!place) {
        placeDetailsSection.innerHTML = '<p>Place not found.</p>';
        return;
    }

    const ownerName = place.owner ? `${place.owner.first_name} ${place.owner.last_name}` : 'Unknown';
    const price = place.price || 'N/A';
    const description = place.description || 'No description available';
    
    const amenitiesHTML = place.amenities && place.amenities.length > 0
        ? place.amenities.map(amenity => `<li>${amenity.name}</li>`).join('')
        : '<li>No amenities listed</li>';

    const placeHTML = `
        <article class="place-details">
            <h1>${place.title}</h1>
            
            <section class="place-info">
                <article class="place-info-item">
                    <h3>Price</h3>
                    <p>$${price} per night</p>
                </article>
                <article class="place-info-item">
                    <h3>Host</h3>
                    <p>${ownerName}</p>
                </article>
            </section>

            <section class="place-info-item">
                <h3>Description</h3>
                <p>${description}</p>
            </section>

            <section class="place-info-item">
                <h3>Amenities</h3>
                <ul>
                    ${amenitiesHTML}
                </ul>
            </section>
        </article>
    `;

    placeDetailsSection.innerHTML = placeHTML;
}

// ===== Display Reviews =====
function displayReviews(reviews) {
    const reviewsList = document.getElementById('reviews-list');

    if (!reviews || reviews.length === 0) {
        reviewsList.innerHTML = '<p class="no-reviews">No reviews yet. Be the first to review!</p>';
        return;
    }

    const reviewsHTML = reviews.map(review => `
        <article class="review-card">
            <div class="rating">★ ${review.rating}/5</div>
            <div class="user-name">User ${review.user_id}</div>
            <div class="comment">${review.text}</div>
        </article>
    `).join('');

    reviewsList.innerHTML = reviewsHTML;
}

// ===== Check Authentication and Show Add Review Form =====
function checkAuthenticationForAddReview() {
    const isLoggedIn = isUserLoggedIn();
    const addReviewSection = document.getElementById('add-review');

    if (isLoggedIn) {
        addReviewSection.style.display = 'block';
        setupReviewForm();
    } else {
        addReviewSection.style.display = 'none';
    }
}

// ===== Setup Review Form Handler =====
function setupReviewForm() {
    const reviewForm = document.getElementById('review-form');
    
    if (reviewForm) {
        reviewForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            
            const placeId = getPlaceIdFromURL();
            const rating = document.getElementById('rating').value;
            const comment = document.getElementById('comment').value;
            const token = getAuthToken();

            if (!token) {
                alert('You must be logged in to submit a review');
                return;
            }

            const result = await submitReview(placeId, rating, comment, token);
            
            if (result.success) {
                alert('Review submitted successfully!');
                reviewForm.reset();
                // Reload the page to show the new review
                location.reload();
            } else {
                alert('Failed to submit review: ' + result.error);
            }
        });
    }
}

// ===== Submit Review to API =====
async function submitReview(placeId, rating, text, token) {
    try {
        const response = await fetch(`${API_BASE_URL}/reviews/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                place_id: placeId,
                rating: parseInt(rating),
                text: text
            })
        });

        if (response.ok) {
            return { success: true };
        } else {
            const errorData = await response.json();
            return { success: false, error: errorData.error || 'Failed to submit review' };
        }
    } catch (error) {
        console.error('Error submitting review:', error);
        return { success: false, error: 'Network error' };
    }
}

// ===== Initialize Place Details Page =====
document.addEventListener('DOMContentLoaded', async () => {
    const placeId = getPlaceIdFromURL();

    if (!placeId) {
        document.getElementById('place-details').innerHTML = '<p>No place ID provided.</p>';
        return;
    }

    // Update authentication UI
    updateAuthUI();
    checkAuthenticationForAddReview();

    // Fetch and display place details
    const place = await fetchPlaceDetailsFromAPI(placeId);
    
    if (place) {
        displayPlaceDetails(place);
        displayReviews(place.reviews);
    } else {
        document.getElementById('place-details').innerHTML = '<p>Failed to load place details. Please try again later.</p>';
    }
});
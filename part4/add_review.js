// ===== Check Authentication and Redirect if Needed =====
function checkAuthenticationForAddReview() {
    const token = getCookie('token');
    
    if (!token) {
        // Redirect unauthenticated users to index page
        window.location.href = 'index.html';
        return null;
    }
    
    return token;
}

// ===== Get Place ID from URL =====
function getPlaceIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('place_id') || params.get('placeId') || params.get('id');
}

// ===== Setup Back Link =====
function setupBackLink(placeId) {
    const backLink = document.getElementById('back-link');
    if (backLink && placeId) {
        backLink.href = `place.html?id=${placeId}`;
    }
}

// ===== Setup Review Form Handler =====
function setupReviewForm(token, placeId) {
    const reviewForm = document.getElementById('review-form');
    
    if (!reviewForm) return;
    
    reviewForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const rating = document.getElementById('rating').value;
        const comment = document.getElementById('comment').value;
        
        // Validate form inputs
        if (!rating || !comment.trim()) {
            showErrorMessage('Please fill in all fields');
            return;
        }
        
        // Submit the review
        const result = await submitReviewToAPI(token, placeId, rating, comment);
        
        if (result.success) {
            showSuccessMessage('Review submitted successfully!');
            reviewForm.reset();
            
            // Redirect to place details after 2 seconds
            setTimeout(() => {
                window.location.href = `place.html?id=${placeId}`;
            }, 2000);
        } else {
            showErrorMessage('Failed to submit review: ' + result.error);
        }
    });
}

// ===== Submit Review to API =====
async function submitReviewToAPI(token, placeId, rating, text) {
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
            const data = await response.json();
            return { success: true, data };
        } else {
            const errorData = await response.json();
            const errorMessage = errorData.error || errorData.message || 'Failed to submit review';
            return { success: false, error: errorMessage };
        }
    } catch (error) {
        console.error('Error submitting review:', error);
        return { success: false, error: 'Network error. Please try again.' };
    }
}

// ===== Display Success Message =====
function showSuccessMessage(message) {
    const successContainer = document.getElementById('success-message');
    if (successContainer) {
        successContainer.textContent = message;
        successContainer.style.display = 'block';
    }
}

// ===== Display Error Message =====
function showErrorMessage(message) {
    const errorContainer = document.getElementById('error-message');
    if (errorContainer) {
        errorContainer.textContent = message;
        errorContainer.style.display = 'block';
    }
    
    // Clear error message after 5 seconds
    setTimeout(() => {
        if (errorContainer) {
            errorContainer.style.display = 'none';
        }
    }, 5000);
}

// ===== Clear Messages =====
function clearMessages() {
    const successContainer = document.getElementById('success-message');
    const errorContainer = document.getElementById('error-message');
    
    if (successContainer) successContainer.style.display = 'none';
    if (errorContainer) errorContainer.style.display = 'none';
}

// ===== Initialize Add Review Page =====
document.addEventListener('DOMContentLoaded', () => {
    // Check authentication first
    const token = checkAuthenticationForAddReview();
    
    if (!token) {
        // User will be redirected by checkAuthenticationForAddReview()
        return;
    }
    
    // Get place ID from URL
    const placeId = getPlaceIdFromURL();
    
    if (!placeId) {
        showErrorMessage('No place ID provided. Please go back to a place details page.');
        return;
    }
    
    // Update authentication UI
    updateAuthUI();
    
    // Setup back link
    setupBackLink(placeId);
    
    // Setup review form handler
    setupReviewForm(token, placeId);
});
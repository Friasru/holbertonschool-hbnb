// Add these functions if not already in scripts.js

// ===== Show/Hide Messages =====
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
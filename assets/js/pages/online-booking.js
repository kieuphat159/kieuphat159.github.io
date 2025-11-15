// Update guest select options based on language
function updateGuestOptions() {
    const guestSelect = document.getElementById('guestSelect');
    if (!guestSelect) return;

    const options = [
        { value: '', key: 'onlineBooking.form.guests.options.1' },
        { value: '1', key: 'onlineBooking.form.guests.options.1' },
        { value: '2', key: 'onlineBooking.form.guests.options.2' },
        { value: '3', key: 'onlineBooking.form.guests.options.3' },
        { value: '4', key: 'onlineBooking.form.guests.options.4' }
    ];

    // Save current selected value
    const currentValue = guestSelect.value;

    // Clear and rebuild options
    guestSelect.innerHTML = '';
    options.forEach(option => {
        const opt = document.createElement('option');
        opt.value = option.value;
        opt.textContent = window.i18n.t(option.key);
        guestSelect.appendChild(opt);
    });

    // Restore selected value
    guestSelect.value = currentValue;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    updateGuestOptions();
});

// Update on language change
window.addEventListener('languageChanged', () => {
    updateGuestOptions();
});

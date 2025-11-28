// HKO LIMO - BOOKING LOGIC V2
// Fresh Build - November 14, 2025
// Handles 3-step booking with dynamic pricing

let selectedVehicle = null;
let selectedService = null;

// Initialize Firebase
firebase.initializeApp(FIREBASE_CONFIG);
const auth = firebase.auth();
const db = firebase.database();
const stripe = Stripe(STRIPE_CONFIG.publishableKey);

// STEP 1: Update prices based on service type
function updateStep1() {
    const serviceType = document.querySelector('input[name="serviceType"]:checked')?.value;
    selectedService = serviceType;

    if (!serviceType) return;

    // Update prices in UI
    document.getElementById('price-sclass').textContent = `From $${getPriceForService('sclass', serviceType)}`;
    document.getElementById('price-vclass').textContent = `From $${getPriceForService('vclass', serviceType)}`;
    document.getElementById('price-alphard').textContent = `From $${getPriceForService('alphard', serviceType)}`;
}

function getPriceForService(vehicleId, serviceType) {
    const price = calculatePrice(vehicleId, serviceType);
    return price.toFixed(0);
}

// STEP 1: Select Vehicle
function selectVehicle(vehicleId) {
    selectedVehicle = vehicleId;
    document.getElementById('selectedVehicle').value = vehicleId;

    // Update UI
    document.querySelectorAll('.vehicle-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    event.target.closest('.vehicle-option').classList.add('selected');
}

// Go to Step 2
function goToStep2() {
    if (!selectedService) {
        alert('Please select a service type');
        return;
    }
    if (!selectedVehicle) {
        alert('Please select a vehicle');
        return;
    }

    showStep(2);
    document.getElementById('progressFill').style.width = '66%';

    // Show hours group if hourly charter selected
    if (selectedService === 'hourlyCharter') {
        document.getElementById('hoursGroup').style.display = 'block';
    } else {
        document.getElementById('hoursGroup').style.display = 'none';
    }
}

// STEP 2: Hours control for hourly charter
function increaseHours() {
    const hours = document.getElementById('bookingHours');
    hours.value = parseInt(hours.value) + 1;
    updateSummary();
}

function decreaseHours() {
    const hours = document.getElementById('bookingHours');
    if (parseInt(hours.value) > 3) {
        hours.value = parseInt(hours.value) - 1;
        updateSummary();
    }
}

// Validate booking lead time
function validateBookingDateTime() {
    const date = document.getElementById('bookingDate').value;
    const time = document.getElementById('bookingTime').value;

    if (!date || !time) {
        alert('Please enter date and time');
        return false;
    }

    const bookingDateTime = new Date(`${date}T${time}`);
    const now = new Date();
    const hoursUntilBooking = (bookingDateTime - now) / (1000 * 60 * 60);

    const minHours = BOOKING_RULES.minimumLeadTimeHours;
    const maxDays = BOOKING_RULES.maximumAdvanceDays;

    if (hoursUntilBooking < minHours) {
        document.getElementById('leadTimeWarning').textContent = 
            `⚠️ Booking must be at least ${minHours} hours in advance. Last-minute bookings may be approved manually.`;
        return false;
    }

    if (hoursUntilBooking > maxDays * 24) {
        document.getElementById('leadTimeWarning').textContent = 
            `⚠️ Booking cannot be more than ${maxDays} days in advance`;
        return false;
    }

    document.getElementById('leadTimeWarning').textContent = '';
    return true;
}

// Go to Step 3
function goToStep3() {
    if (!validateBookingDateTime()) {
        alert('Please check the date and time');
        return;
    }

    showStep(3);
    document.getElementById('progressFill').style.width = '100%';
    updateSummary();
}

// Update Summary
function updateSummary() {
    const vehicleName = VEHICLES[selectedVehicle]?.name || 'Unknown';
    const serviceName = SERVICE_TYPES[selectedService]?.name || 'Unknown';
    const date = document.getElementById('bookingDate').value;
    const time = document.getElementById('bookingTime').value;

    let totalPrice = calculatePrice(selectedVehicle, selectedService);

    if (selectedService === 'hourlyCharter') {
        const hours = parseInt(document.getElementById('bookingHours').value);
        totalPrice = calculatePrice(selectedVehicle, selectedService, hours);
        document.getElementById('summaryHoursItem').style.display = 'flex';
        document.getElementById('summaryHours').textContent = `${hours} hours`;
    } else {
        document.getElementById('summaryHoursItem').style.display = 'none';
    }

    document.getElementById('summaryVehicle').textContent = vehicleName;
    document.getElementById('summaryService').textContent = serviceName;
    document.getElementById('summaryDateTime').textContent = `${date} at ${time}`;
    document.getElementById('summaryTotal').textContent = `SGD $${totalPrice.toFixed(2)}`;
}

// Go back steps
function goToStep1() {
    showStep(1);
    document.getElementById('progressFill').style.width = '33%';
}

function goToStep2Back() {
    showStep(2);
    document.getElementById('progressFill').style.width = '66%';
}

// Show specific step
function showStep(stepNumber) {
    document.querySelectorAll('.booking-step').forEach(step => {
        step.classList.remove('active');
    });
    document.getElementById(`step${stepNumber}`).classList.add('active');
}

// STEP 3: Process Payment
async function processPayment() {
    // Validate all fields
    const name = document.getElementById('passengerName').value.trim();
    const email = document.getElementById('passengerEmail').value.trim();
    const phone = document.getElementById('passengerPhone').value.trim();
    const pickup = document.getElementById('pickupLocation').value.trim();
    const dropoff = document.getElementById('dropoffLocation').value.trim();

    if (!name || !email || !phone || !pickup || !dropoff) {
        alert('Please fill in all required fields');
        return;
    }

    // Calculate total price
    let totalPrice = calculatePrice(selectedVehicle, selectedService);
    if (selectedService === 'hourlyCharter') {
        const hours = parseInt(document.getElementById('bookingHours').value);
        totalPrice = calculatePrice(selectedVehicle, selectedService, hours);
    }

    // Disable button during processing
    const btn = event.target;
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

    try {
        // Create booking in Firebase first
        const bookingRef = db.ref('bookings').push();
        const bookingId = bookingRef.key;
        const date = document.getElementById('bookingDate').value;
        const time = document.getElementById('bookingTime').value;
        const bookingDateTime = new Date(`${date}T${time}`).toISOString();

        const bookingData = {
            id: bookingId,
            customerId: auth.currentUser?.uid || 'guest_' + Math.random(),
            customerName: name,
            customerEmail: email,
            customerPhone: phone,
            vehicle: VEHICLES[selectedVehicle].name,
            vehicleId: selectedVehicle,
            serviceType: SERVICE_TYPES[selectedService].name,
            serviceTypeId: selectedService,
            pickupLocation: pickup,
            dropoffLocation: dropoff,
            specialRequests: document.getElementById('specialRequests').value || '',
            bookingDateTime: bookingDateTime,
            totalAmount: totalPrice,
            currency: 'SGD',
            status: 'pending',
            paymentStatus: 'pending',
            createdAt: new Date().toISOString()
        };

        // If hourly, add hours
        if (selectedService === 'hourlyCharter') {
            bookingData.hours = parseInt(document.getElementById('bookingHours').value);
        }

        // Save to Firebase
        await bookingRef.set(bookingData);

        // Create Stripe payment
        const response = await fetch('/.netlify/functions/create-payment-intent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                bookingId: bookingId,
                amount: Math.round(totalPrice * 100), // in cents
                email: email,
                name: name
            })
        });

        const paymentData = await response.json();

        if (!paymentData.clientSecret) {
            throw new Error('Failed to create payment');
        }

        // Redirect to payment
        const { error } = await stripe.redirectToCheckout({
            sessionId: paymentData.sessionId
        });

        if (error) {
            throw error;
        }

        // Show success screen
        showStep('Success');
        document.getElementById('bookingRef').textContent = bookingId;
        document.getElementById('confirmEmail').textContent = email;

        // Send confirmation email
        await sendConfirmationEmail({
            email: email,
            name: name,
            bookingId: bookingId,
            bookingDetails: bookingData
        });

    } catch (error) {
        console.error('Payment error:', error);
        alert('Payment failed: ' + error.message);
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-credit-card"></i> Pay Now';
    }
}

// Send Confirmation Email
async function sendConfirmationEmail(data) {
    try {
        await fetch('/.netlify/functions/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                to: data.email,
                subject: 'Booking Confirmed - HKO LIMO',
                template: 'booking-confirmation',
                data: data
            })
        });
    } catch (error) {
        console.error('Email error:', error);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('bookingDate').min = today;
});

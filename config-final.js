// ==========================================
// HKO LIMO - FINAL CONFIGURATION
// Fresh Setup with Your Exact Pricing & Settings
// Version 2.0 - November 14, 2025
// ==========================================

// ==========================================
// STRIPE CONFIGURATION ✅ (Already Set Up)
// ==========================================

const STRIPE_CONFIG = {
    publishableKey: "pk_live_51SCj43L50cwAWABS3juapMu0ZaYEB3gBzIJGNczBdTRhPwegeN105GwHkv85db4Q1yTgL3Vcg6fOu3B5BzJcEipN00fUF8HPxL",
    currency: "SGD",
    accountEmail: "sales@hkolimo.com"
};

// ==========================================
// FIREBASE CONFIGURATION ✅ (Already Set Up)
// ==========================================

const FIREBASE_CONFIG = {
    apiKey: "AIzaSyDy7z9suF_bpLI7pW4X9ofsZpfmEMc7Eeo",
    authDomain: "hkolimo-firebase.firebaseapp.com",
    projectId: "hkolimo-firebase",
    storageBucket: "hkolimo-firebase.firebasestorage.app",
    messagingSenderId: "1012271101382",
    appId: "1:1012271101382:web:fc922a415deadf277a2ec7",
    databaseURL: "https://hkolimo-firebase-default-rtdb.asia-southeast1.firebasedatabase.app"
};

// ==========================================
// GOOGLE MAPS CONFIGURATION ✅ (Already Set Up)
// ==========================================

const GOOGLE_MAPS_CONFIG = {
    apiKey: "AIzaSyCIbXHAAlCYzhBnRf-napOU6e-ccJaD6Qo",
    mapDefaults: {
        center: { lat: 1.3521, lng: 103.8198 }, // Singapore
        zoom: 12
    },
    tracking: {
        updateInterval: 10000, // Update every 10 seconds
        showTraffic: true
    }
};

// ==========================================
// GOOGLE WORKSPACE ✅
// ==========================================

const GOOGLE_WORKSPACE_CONFIG = {
    adminEmail: "sales@hkolimo.com",
    domain: "hkolimo.com"
};

// ==========================================
// YOUR VEHICLES (3 Types)
// ==========================================

const VEHICLES = {
    sclass: {
        id: "sclass",
        name: "Mercedes S-Class",
        description: "Premium luxury sedan",
        capacity: {
            passengers: 3,
            luggage: 3
        },
        image: "mercedes-s-class.jpg",
        features: [
            "Premium leather seats",
            "Climate control",
            "WiFi available",
            "Chauffeur service"
        ]
    },
    vclass: {
        id: "vclass",
        name: "Mercedes V-Class",
        description: "Luxury MPV",
        capacity: {
            passengers: 6,
            luggage: 6
        },
        image: "mercedes-v-class.jpg",
        features: [
            "Spacious interior",
            "7-seater capacity",
            "Climate control",
            "Family-friendly"
        ]
    },
    alphard: {
        id: "alphard",
        name: "Toyota Alphard/Vellfire",
        description: "Premium MPV",
        capacity: {
            passengers: 6,
            luggage: 6
        },
        image: "toyota-alphard.jpg",
        features: [
            "Executive seating",
            "Rear entertainment",
            "Premium comfort",
            "VIP treatment"
        ]
    }
};

// ==========================================
// SERVICE TYPES (4 Types)
// ==========================================

const SERVICE_TYPES = {
    airportArrival: {
        id: "airportArrival",
        name: "Airport Arrival (Meet & Greet)",
        description: "Pickup from airport with meet and greet service",
        icon: "✈️ 📥"
    },
    airportDeparture: {
        id: "airportDeparture", 
        name: "Airport Departure",
        description: "Drop-off at airport",
        icon: "✈️ 📤"
    },
    hourlyCharter: {
        id: "hourlyCharter",
        name: "Hourly Charter",
        description: "Rent by the hour (minimum 3 hours)",
        icon: "⏰",
        minimumHours: 3
    },
    pointToPoint: {
        id: "pointToPoint",
        name: "Point-to-Point Transfer",
        description: "Direct transfer between two locations",
        icon: "📍"
    }
};

// ==========================================
// YOUR EXACT PRICING
// ==========================================

const PRICING = {
    // Mercedes S-Class Pricing
    sclass: {
        airportArrival: 180,      // SGD $180 (Meet & Greet)
        airportDeparture: 170,    // SGD $170
        pointToPoint: 170,        // SGD $170
        hourlyRate: 160           // SGD $160/hour (min 3 hours)
    },
    
    // Mercedes V-Class Pricing
    vclass: {
        airportArrival: 95,       // SGD $95 (Meet & Greet)
        airportDeparture: 75,     // SGD $75
        pointToPoint: 75,         // SGD $75
        hourlyRate: 75            // SGD $75/hour (min 3 hours)
    },
    
    // Toyota Alphard/Vellfire Pricing
    alphard: {
        airportArrival: 95,       // SGD $95 (Meet & Greet)
        airportDeparture: 75,     // SGD $75
        pointToPoint: 75,         // SGD $75
        hourlyRate: 75            // SGD $75/hour (min 3 hours)
    }
};

// ==========================================
// PRICE CALCULATION FUNCTION
// ==========================================

function calculatePrice(vehicleId, serviceType, hours = 3) {
    // Get vehicle pricing
    const vehiclePricing = PRICING[vehicleId];
    
    if (!vehiclePricing) {
        console.error("Invalid vehicle ID:", vehicleId);
        return 0;
    }
    
    // Calculate based on service type
    switch(serviceType) {
        case "airportArrival":
            return vehiclePricing.airportArrival;
            
        case "airportDeparture":
            return vehiclePricing.airportDeparture;
            
        case "pointToPoint":
            return vehiclePricing.pointToPoint;
            
        case "hourlyCharter":
            // Minimum 3 hours
            const actualHours = Math.max(hours, 3);
            return vehiclePricing.hourlyRate * actualHours;
            
        default:
            console.error("Invalid service type:", serviceType);
            return 0;
    }
}

// ==========================================
// BOOKING RULES
// ==========================================

const BOOKING_RULES = {
    // Lead time
    minimumLeadTimeHours: 2,     // 2 hours minimum
    maximumAdvanceDays: 90,      // 90 days maximum
    
    // Operating hours
    operatingHours: "24/7",      // Always available
    
    // Cancellation policy
    cancellation: {
        freeUntilHours: 4,           // Free cancellation 4+ hours before
        partialChargeHours: 2,       // 50% charge if 2-4 hours before
        partialChargePercentage: 0.50,
        fullChargeHours: 2,          // 100% charge if < 2 hours before
        fullChargePercentage: 1.00
    },
    
    // Hourly charter rules
    hourlyCharter: {
        minimumHours: 3,
        incrementHours: 1  // Can add hours in 1-hour increments
    }
};

// ==========================================
// USER ROLES (3 Roles)
// ==========================================

const USER_ROLES = {
    admin: {
        id: "admin",
        name: "Admin",
        description: "Business owner / Manager",
        permissions: [
            "view_all_bookings",
            "manage_drivers",
            "manage_customers",
            "manage_pricing",
            "view_revenue",
            "create_bookings",
            "cancel_bookings",
            "refund_payments",
            "override_rules",
            "view_analytics",
            "export_reports",
            "manage_promo_codes"
        ],
        dashboardUrl: "admin-dashboard-v2.html"
    },
    
    client: {
        id: "client",
        name: "Client / Corporate",
        description: "Individual or corporate customer",
        permissions: [
            "create_bookings",
            "view_own_bookings",
            "cancel_own_bookings",
            "track_trips",
            "manage_payment_methods",
            "download_receipts",
            "view_invoices"
        ],
        dashboardUrl: "client-dashboard-v2.html"
    },
    
    driver: {
        id: "driver",
        name: "Driver",
        description: "Vehicle operator",
        permissions: [
            "view_assigned_trips",
            "accept_trips",
            "reject_trips",
            "update_trip_status",
            "navigate_to_location",
            "chat_with_passenger",
            "call_passenger",
            "upload_photos",
            "view_earnings"
        ],
        dashboardUrl: "driver-dashboard-v2.html"
    }
};

// ==========================================
// BOOKING STATUSES
// ==========================================

const BOOKING_STATUSES = {
    pending: {
        id: "pending",
        name: "Pending Confirmation",
        color: "#FFA500" // Orange
    },
    confirmed: {
        id: "confirmed",
        name: "Confirmed",
        color: "#4CAF50" // Green
    },
    driverAssigned: {
        id: "driverAssigned",
        name: "Driver Assigned",
        color: "#2196F3" // Blue
    },
    enRoute: {
        id: "enRoute",
        name: "Driver En Route",
        color: "#9C27B0" // Purple
    },
    arrived: {
        id: "arrived",
        name: "Driver Arrived",
        color: "#00BCD4" // Cyan
    },
    inTransit: {
        id: "inTransit",
        name: "In Transit",
        color: "#FFD700" // Gold
    },
    completed: {
        id: "completed",
        name: "Completed",
        color: "#4CAF50" // Green
    },
    cancelled: {
        id: "cancelled",
        name: "Cancelled",
        color: "#F44336" // Red
    },
    noShow: {
        id: "noShow",
        name: "No Show",
        color: "#9E9E9E" // Gray
    }
};

// ==========================================
// APP CONFIGURATION
// ==========================================

const APP_CONFIG = {
    appName: "HKO LIMO",
    tagline: "WHERE LUXURY MEETS SERVICE",
    
    // Brand colors
    colors: {
        primary: "#000000",    // Black
        secondary: "#FFFFFF",  // White
        accent: "#FFD700"      // Gold
    },
    
    // URLs
    baseURL: "https://portal.hkolimo.com",
    websiteURL: "https://hkolimo.com",
    
    // Contact
    contact: {
        phone: "+65 XXXX XXXX",  // Update with your number
        email: "sales@hkolimo.com",
        whatsapp: "+65 XXXX XXXX" // Update with your WhatsApp
    },
    
    // Features enabled
    features: {
        realTimeTracking: true,
        digitalNameSign: true,
        chatWithDriver: true,
        pushNotifications: true,
        multiplePaymentMethods: true,
        corporateAccounts: true,
        promoCode: true,
        loyaltyProgram: false  // Future feature
    }
};

// ==========================================
// EMAIL TEMPLATES
// ==========================================

const EMAIL_TEMPLATES = {
    bookingConfirmation: {
        subject: "Booking Confirmed - HKO LIMO",
        from: "bookings@hkolimo.com"
    },
    driverAssigned: {
        subject: "Driver Assigned - HKO LIMO",
        from: "bookings@hkolimo.com"
    },
    tripReminder: {
        subject: "Upcoming Trip Reminder - HKO LIMO",
        from: "bookings@hkolimo.com"
    },
    paymentReceipt: {
        subject: "Payment Receipt - HKO LIMO",
        from: "payments@hkolimo.com"
    },
    cancellationConfirmation: {
        subject: "Booking Cancelled - HKO LIMO",
        from: "bookings@hkolimo.com"
    }
};

// ==========================================
// HELPER FUNCTIONS
// ==========================================

// Format price for display
function formatPrice(amount) {
    return `SGD $${amount.toFixed(2)}`;
}

// Get vehicle name
function getVehicleName(vehicleId) {
    return VEHICLES[vehicleId]?.name || "Unknown Vehicle";
}

// Get service type name
function getServiceTypeName(serviceTypeId) {
    return SERVICE_TYPES[serviceTypeId]?.name || "Unknown Service";
}

// Validate booking lead time
function validateBookingTime(bookingDateTime) {
    const now = new Date();
    const booking = new Date(bookingDateTime);
    const hoursDifference = (booking - now) / (1000 * 60 * 60);
    
    return hoursDifference >= BOOKING_RULES.minimumLeadTimeHours;
}

// Calculate cancellation charge
function calculateCancellationCharge(bookingPrice, hoursUntilTrip) {
    if (hoursUntilTrip >= BOOKING_RULES.cancellation.freeUntilHours) {
        return 0; // Free cancellation
    } else if (hoursUntilTrip >= BOOKING_RULES.cancellation.partialChargeHours) {
        return bookingPrice * BOOKING_RULES.cancellation.partialChargePercentage; // 50%
    } else {
        return bookingPrice * BOOKING_RULES.cancellation.fullChargePercentage; // 100%
    }
}

// ==========================================
// DIGITAL NAME SIGN CONFIGURATION
// ==========================================

const DIGITAL_NAME_SIGN = {
    enabled: true,
    defaultDisplay: {
        companyName: "HKO LIMO",
        tagline: "WHERE LUXURY MEETS SERVICE",
        backgroundColor: "#000000",  // Black
        textColor: "#FFD700",        // Gold
        fontSize: "48px",
        fontFamily: "'Segoe UI', Arial, sans-serif"
    }
};

// ==========================================
// EXPORT FOR USE IN OTHER FILES
// ==========================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        STRIPE_CONFIG,
        FIREBASE_CONFIG,
        GOOGLE_MAPS_CONFIG,
        GOOGLE_WORKSPACE_CONFIG,
        VEHICLES,
        SERVICE_TYPES,
        PRICING,
        BOOKING_RULES,
        USER_ROLES,
        BOOKING_STATUSES,
        APP_CONFIG,
        EMAIL_TEMPLATES,
        DIGITAL_NAME_SIGN,
        calculatePrice,
        formatPrice,
        getVehicleName,
        getServiceTypeName,
        validateBookingTime,
        calculateCancellationCharge
    };
}

// ==========================================
// USAGE EXAMPLES
// ==========================================

/*
EXAMPLE 1: Calculate price for S-Class airport arrival
const price = calculatePrice("sclass", "airportArrival");
console.log(formatPrice(price)); // Output: SGD $180.00

EXAMPLE 2: Calculate price for V-Class hourly (5 hours)
const price = calculatePrice("vclass", "hourlyCharter", 5);
console.log(formatPrice(price)); // Output: SGD $375.00

EXAMPLE 3: Calculate cancellation charge
const bookingPrice = 180;
const hoursUntilTrip = 3; // 3 hours before trip
const charge = calculateCancellationCharge(bookingPrice, hoursUntilTrip);
console.log(formatPrice(charge)); // Output: SGD $90.00 (50%)

EXAMPLE 4: Check if booking time is valid
const bookingDateTime = "2025-11-15T10:00:00";
const isValid = validateBookingTime(bookingDateTime);
console.log(isValid); // true or false
*/

// ==========================================
// READY TO USE!
// ==========================================

console.log("%c HKO LIMO Configuration Loaded Successfully! ", 
    "background: #FFD700; color: #000000; font-size: 16px; padding: 10px; font-weight: bold");
console.log("✅ Stripe configured");
console.log("✅ Firebase configured");
console.log("✅ Google Maps configured");
console.log("✅ 3 Vehicles configured");
console.log("✅ 4 Service types configured");
console.log("✅ Pricing configured");
console.log("✅ 3 Roles configured");
console.log("✅ Digital name sign enabled");
console.log("Ready to deploy!");

// HKO LIMO - PRICING CALCULATOR v2.1 (CORRECTED)
// WITH EXACT RATES AND CORRECTED WAIT TIME LOGIC

export const PRICING = {
  VEHICLES: {
    'mercedes-s-class': {
      name: 'Mercedes S-Class',
      code: 'S-Class',
      airportArrival: 180,      // ✅ Exact
      airportDeparture: 170,    // ✅ Exact (Transfer)
      hourlyRate: 160,          // ✅ Exact
      hourlyMinimum: 3,
      waitTimePerBlock: 50,     // $50 per 15 min block
      midnightCharge: 50        // ✅ Per job or per hour
    },
    'mercedes-v-class': {
      name: 'Mercedes V-Class',
      code: 'V-Class',
      airportArrival: 95,       // ✅ Exact
      airportDeparture: 80,     // ✅ Exact (Transfer)
      hourlyRate: 75,           // ✅ Exact
      hourlyMinimum: 3,
      waitTimePerBlock: 20,     // $20 per 15 min block
      midnightCharge: 20        // ✅ Per job or per hour
    },
    'toyota-alphard-vellfire': {
      name: 'Toyota Alphard/Vellfire',
      code: 'Alphard',
      airportArrival: 95,       // ✅ Exact
      airportDeparture: 80,     // ✅ Exact (Transfer)
      hourlyRate: 75,           // ✅ Exact
      hourlyMinimum: 3,
      waitTimePerBlock: 20,     // $20 per 15 min block
      midnightCharge: 20        // ✅ Per job or per hour
    },
    'toyota-hiace-13': {
      name: 'Toyota Hiace 13-Seater',
      code: 'Hiace',
      airportArrival: 100,      // ✅ Exact
      airportDeparture: 90,     // ✅ Exact (Transfer)
      hourlyRate: 85,           // ✅ Exact
      hourlyMinimum: 3,
      waitTimePerBlock: 20,     // $20 per 15 min block
      midnightCharge: 20        // ✅ Per job or per hour
    }
  },
  
  WAIT_TIME_FREE_MINUTES: {
    'airport-arrival': 45,        // 45 mins free after official flight land
    'airport-departure': 15,      // 15 mins free from BOOKING TIME
    'transfer': 15                // 15 mins free from BOOKING TIME
  },
  
  WAIT_TIME_BLOCK: 15,            // Block size: 15 minutes
  
  MIDNIGHT_HOURS: {
    start: 23,  // 23:00 (11 PM) - INCLUSIVE
    end: 7      // 07:00 (7 AM) - EXCLUSIVE (so 06:59 is included)
  }
};

/**
 * CALCULATE CHARGES FOR A BOOKING
 * 
 * @param {Object} params
 *   - serviceType: 'airport-arrival' | 'airport-departure' | 'transfer' | 'hourly'
 *   - vehicleId: 'mercedes-s-class' | 'mercedes-v-class' | 'toyota-alphard-vellfire' | 'toyota-hiace-13'
 *   - pickupTime: "HH:MM" (for midnight calculation - this is booking time for transfers)
 *   - hoursDuration: (only for hourly bookings, default 0)
 *   - waitTimeMinutes: (calculated from official flight land time for airport, or booking time for transfer)
 *   - waivedCharges: (admin override, default 0)
 *   
 * @returns {Object} { basePrice, waitTimeCharge, midnightCharge, total, breakdown }
 * 
 * ⚠️ CRITICAL RULES:
 * 1. For Airport Arrival: waitTimeMinutes = time from official flight land time to guest on board
 * 2. For Airport Departure/Transfer: waitTimeMinutes = time from BOOKING TIME to guest on board
 * 3. Driver arriving early = NO CHARGE (we never use driver arrival time as wait reference)
 * 4. Midnight window: 23:00 to 06:59 INCLUSIVE (06:59 has charge, 07:00 does not)
 * 5. Hourly bookings: NO wait charges, midnight is per hour
 */
export function calculateCharges(params) {
  const {
    serviceType,
    vehicleId,
    pickupTime,           // "HH:MM" format - this is booking time for transfers/departures
    hoursDuration = 0,
    waitTimeMinutes = 0,
    waivedCharges = 0
  } = params;

  const vehicle = PRICING.VEHICLES[vehicleId];
  if (!vehicle) {
    return { error: 'Invalid vehicle ID', success: false };
  }

  let breakdown = {
    basePrice: 0,
    waitTimeCharge: 0,
    midnightCharge: 0,
    waivedCharges: 0,
    total: 0
  };

  // ========================================
  // 1. CALCULATE BASE PRICE
  // ========================================
  if (serviceType === 'airport-arrival' || serviceType === 'airport-departure' || serviceType === 'transfer') {
    // Simplified: Airport Arrival/Departure and Transfer all use service-type rate
    if (serviceType === 'airport-arrival') {
      breakdown.basePrice = vehicle.airportArrival;
    } else if (serviceType === 'airport-departure' || serviceType === 'transfer') {
      breakdown.basePrice = vehicle.airportDeparture;
    }
  } else if (serviceType === 'hourly') {
    // Hourly: minimum 3 hours
    const hours = Math.max(hoursDuration, vehicle.hourlyMinimum);
    breakdown.basePrice = vehicle.hourlyRate * hours;
  }

  // ========================================
  // 2. CALCULATE WAIT TIME CHARGE
  // ========================================
  // ⚠️ CRITICAL: Hourly bookings have NO wait time charges (already paid hourly)
  if (serviceType !== 'hourly' && waitTimeMinutes > 0) {
    const freeMinutes = PRICING.WAIT_TIME_FREE_MINUTES[serviceType];
    const chargeableMinutes = waitTimeMinutes - freeMinutes;

    if (chargeableMinutes > 0) {
      // Round up to nearest 15-minute block
      // Example: 1-15 mins = 1 block, 16-30 mins = 2 blocks, etc.
      const blocks = Math.ceil(chargeableMinutes / PRICING.WAIT_TIME_BLOCK);
      breakdown.waitTimeCharge = blocks * vehicle.waitTimePerBlock;
    }
  }

  // ========================================
  // 3. CALCULATE MIDNIGHT CHARGE
  // ========================================
  // ⚠️ CRITICAL: Midnight window is 23:00 to 06:59 INCLUSIVE
  // 22:59 = NO charge
  // 23:00 = YES charge
  // 06:59 = YES charge
  // 07:00 = NO charge
  const pickupHour = parseInt(pickupTime.split(':')[0]);
  const isMidnight = pickupHour >= PRICING.MIDNIGHT_HOURS.start || 
                     pickupHour < PRICING.MIDNIGHT_HOURS.end;

  if (isMidnight) {
    if (serviceType === 'hourly') {
      // For hourly: midnight charge is PER HOUR
      const hours = Math.max(hoursDuration, vehicle.hourlyMinimum);
      breakdown.midnightCharge = vehicle.midnightCharge * hours;
    } else {
      // For other services: flat midnight charge per job
      breakdown.midnightCharge = vehicle.midnightCharge;
    }
  }

  // ========================================
  // 4. ADMIN WAIVERS
  // ========================================
  breakdown.waivedCharges = waivedCharges || 0;

  // ========================================
  // 5. CALCULATE TOTAL
  // ========================================
  breakdown.subtotal = breakdown.basePrice + breakdown.waitTimeCharge + breakdown.midnightCharge;
  breakdown.total = breakdown.subtotal - breakdown.waivedCharges;

  return {
    success: true,
    ...breakdown,
    total: parseFloat(breakdown.total.toFixed(2))
  };
}

/**
 * GET VEHICLE NAME BY ID
 */
export function getVehicleName(vehicleId) {
  return PRICING.VEHICLES[vehicleId]?.name || vehicleId;
}

/**
 * GET ALL VEHICLES
 */
export function getVehicles() {
  return Object.entries(PRICING.VEHICLES).map(([id, data]) => ({
    id,
    name: data.name,
    code: data.code
  }));
}

/**
 * GET SERVICE TYPES
 */
export function getServiceTypes() {
  return [
    { id: 'airport-arrival', name: 'Airport Arrival (Meet & Greet)', freeWait: 45 },
    { id: 'airport-departure', name: 'Airport Departure/Transfer', freeWait: 15 },
    { id: 'transfer', name: 'Transfer (Point-to-Point)', freeWait: 15 },
    { id: 'hourly', name: 'Hourly Booking (min 3 hrs)', freeWait: 0 }
  ];
}

/**
 * GET FREE WAIT TIME FOR SERVICE TYPE (IN MINUTES)
 */
export function getFreeWaitMinutes(serviceType) {
  return PRICING.WAIT_TIME_FREE_MINUTES[serviceType] || 0;
}

/**
 * CHECK IF TIME IS IN MIDNIGHT WINDOW (23:00 to 06:59)
 * @param {string} timeStr - "HH:MM" format
 * @returns {boolean}
 */
export function isMidnightHour(timeStr) {
  const hour = parseInt(timeStr.split(':')[0]);
  return hour >= PRICING.MIDNIGHT_HOURS.start || hour < PRICING.MIDNIGHT_HOURS.end;
}

/**
 * HELPER: FORMAT MONEY
 */
export function formatMoney(amount) {
  return `$${parseFloat(amount).toFixed(2)}`;
}

/**
 * HELPER: GET WAIT TIME BLOCKS DISPLAY
 */
export function getWaitTimeBlocksInfo(waitMinutes, serviceType) {
  const freeMinutes = PRICING.WAIT_TIME_FREE_MINUTES[serviceType] || 0;
  const chargeableMinutes = Math.max(0, waitMinutes - freeMinutes);
  const blocks = Math.ceil(chargeableMinutes / PRICING.WAIT_TIME_BLOCK);
  
  return {
    totalWait: waitMinutes,
    freeWait: freeMinutes,
    chargeableWait: chargeableMinutes,
    blocks: blocks,
    blockSize: PRICING.WAIT_TIME_BLOCK,
    display: `${blocks} × 15min blocks = ${chargeableMinutes} mins`
  };
}

/**
 * HELPER: VALIDATE PRICING CONFIGURATION
 * Run this in development to ensure all rates are set
 */
export function validatePricing() {
  const issues = [];
  
  Object.entries(PRICING.VEHICLES).forEach(([vehicleId, vehicle]) => {
    if (!vehicle.airportArrival) issues.push(`${vehicleId}: missing airportArrival`);
    if (!vehicle.airportDeparture) issues.push(`${vehicleId}: missing airportDeparture`);
    if (!vehicle.hourlyRate) issues.push(`${vehicleId}: missing hourlyRate`);
    if (!vehicle.waitTimePerBlock) issues.push(`${vehicleId}: missing waitTimePerBlock`);
    if (vehicle.midnightCharge === undefined) issues.push(`${vehicleId}: missing midnightCharge`);
  });
  
  if (issues.length === 0) {
    console.log('✅ Pricing configuration is valid');
    return true;
  } else {
    console.error('❌ Pricing configuration issues:', issues);
    return false;
  }
}

/**
 * HELPER: GET PRICING TABLE FOR UI DISPLAY
 */
export function getPricingTable() {
  return {
    airportArrival: Object.entries(PRICING.VEHICLES).map(([id, data]) => ({
      vehicleId: id,
      name: data.name,
      price: data.airportArrival
    })),
    airportDeparture: Object.entries(PRICING.VEHICLES).map(([id, data]) => ({
      vehicleId: id,
      name: data.name,
      price: data.airportDeparture
    })),
    hourly: Object.entries(PRICING.VEHICLES).map(([id, data]) => ({
      vehicleId: id,
      name: data.name,
      price: data.hourlyRate,
      minimum: data.hourlyMinimum
    })),
    waitTime: Object.entries(PRICING.VEHICLES).map(([id, data]) => ({
      vehicleId: id,
      name: data.name,
      pricePerBlock: data.waitTimePerBlock,
      blockSize: PRICING.WAIT_TIME_BLOCK
    })),
    midnight: Object.entries(PRICING.VEHICLES).map(([id, data]) => ({
      vehicleId: id,
      name: data.name,
      charge: data.midnightCharge,
      window: '23:00 to 06:59'
    }))
  };
}
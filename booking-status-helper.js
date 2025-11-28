// Booking Status Helper Utilities
// Manages status transitions and workflows

export const BOOKING_STATUSES = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  EN_ROUTE: 'en-route',
  ARRIVED: 'arrived',
  IN_TRANSIT: 'in-transit',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

export const STATUS_LABELS = {
  'pending': { label: 'Pending', color: '#f59e0b', icon: '📋' },
  'confirmed': { label: 'Confirmed', color: '#3b82f6', icon: '✓' },
  'en-route': { label: 'Driver En Route', color: '#06b6d4', icon: '🚗' },
  'arrived': { label: 'Arrived at Pickup', color: '#10b981', icon: '📍' },
  'in-transit': { label: 'In Transit', color: '#8b5cf6', icon: '🚕' },
  'completed': { label: 'Completed', color: '#6b7280', icon: '✓' },
  'cancelled': { label: 'Cancelled', color: '#ef4444', icon: '✕' }
};

// Status flow validation
export function canTransitionTo(currentStatus, newStatus) {
  const validTransitions = {
    'pending': ['confirmed', 'cancelled'],
    'confirmed': ['en-route', 'cancelled'],
    'en-route': ['arrived', 'cancelled'],
    'arrived': ['in-transit', 'cancelled'],
    'in-transit': ['completed', 'cancelled'],
    'completed': [],
    'cancelled': []
  };

  return validTransitions[currentStatus]?.includes(newStatus) || false;
}

// Get next available status
export function getNextStatus(currentStatus) {
  const nextStatusMap = {
    'pending': 'confirmed',
    'confirmed': 'en-route',
    'en-route': 'arrived',
    'arrived': 'in-transit',
    'in-transit': 'completed'
  };

  return nextStatusMap[currentStatus] || null;
}

// Format status for display
export function formatStatus(status) {
  return STATUS_LABELS[status] || { label: 'Unknown', color: '#6b7280', icon: '?' };
}

// Calculate ETA
export function calculateETA(pickupDateTime, serviceType) {
  const pickup = new Date(pickupDateTime);
  const now = new Date();

  if (pickup <= now) {
    return 'Overdue';
  }

  const diffMs = pickup - now;
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 60) {
    return `${diffMins} mins`;
  } else {
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    return `${hours}h ${mins}m`;
  }
}

// Calculate time elapsed since status change
export function getTimeInStatus(statusTimestamp) {
  if (!statusTimestamp) return '—';

  const now = new Date();
  const statusTime = new Date(statusTimestamp);
  const diffMs = now - statusTime;

  if (diffMs < 0) return '—';

  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 60) {
    return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
  } else {
    const hours = Math.floor(diffMins / 60);
    return `${hours}h ago`;
  }
}

// Check if booking can be cancelled
export function canCancelBooking(booking) {
  if (!['pending', 'confirmed'].includes(booking.status)) {
    return false;
  }

  const pickupTime = new Date(booking.pickup.date + 'T' + booking.pickup.time);
  const now = new Date();
  const hoursUntilPickup = (pickupTime - now) / (1000 * 60 * 60);

  // Allow cancellation up to 2 hours before, but try to accommodate if less
  return hoursUntilPickup > 0; // Always allow with accommodation note if less than 2 hours
}

// Get cancellation note
export function getCancellationNote(booking) {
  const pickupTime = new Date(booking.pickup.date + 'T' + booking.pickup.time);
  const now = new Date();
  const hoursUntilPickup = (pickupTime - now) / (1000 * 60 * 60);

  if (hoursUntilPickup > 2) {
    return 'Free cancellation (more than 2 hours before pickup)';
  } else if (hoursUntilPickup > 0) {
    return 'Late cancellation - we will try to accommodate. Contact support for details.';
  } else {
    return 'Booking has started - cannot be cancelled';
  }
}

// Service type display name
export function getServiceDisplayName(serviceType) {
  const names = {
    'airport-arrival': 'Airport Arrival (Meet & Greet)',
    'airport-departure': 'Airport Departure',
    'transfer': 'Transfer (Point-to-Point)',
    'hourly': 'Hourly Booking'
  };

  return names[serviceType] || serviceType;
}

// Vehicle display name
export function getVehicleDisplayName(vehicleType) {
  const names = {
    'mercedes-s-class': 'Mercedes S-Class',
    'mercedes-v-class': 'Mercedes V-Class',
    'toyota-alphard-vellfire': 'Toyota Alphard/Vellfire',
    'toyota-hiace-13': 'Toyota Hiace 13-Seater'
  };

  return names[vehicleType] || vehicleType;
}

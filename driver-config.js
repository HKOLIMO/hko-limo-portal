// Driver Portal Configuration
// Unique job link access system

export const DRIVER_CONFIG = {
  // Color scheme - HKO LIMO bright palette
  colors: {
    primary: '#0066cc',      // Bright blue
    secondary: '#00c4cc',    // Bright cyan
    accent: '#ff6b35',       // Bright orange
    success: '#10b981',      // Bright green
    warning: '#f59e0b',      // Bright amber
    danger: '#ef4444',       // Bright red
    light: '#f8fafc',        // Very light background
    dark: '#1f2937'          // Dark text
  },

  // Job link settings
  jobLink: {
    expiryHours: 48,         // Link expires after 48 hours
    allowMultipleAccess: true // Driver can click same link multiple times (for same job)
  },

  // Status sequence
  statusSequence: [
    { value: 'assigned', label: 'Assigned', icon: '📋' },
    { value: 'en-route', label: 'En Route', icon: '🚗', minHoursBefore: 1 },
    { value: 'arrived', label: 'Arrived at Pickup', icon: '📍' },
    { value: 'in-transit', label: 'In Transit', icon: '🚕' },
    { value: 'completed', label: 'Completed', icon: '✓' }
  ],

  // Location tracking
  location: {
    updateInterval: 10000,    // Update every 10 seconds
    enableBackgroundTracking: true,
    fallbackWhenGPSUnavailable: true
  },

  // Offline settings
  offline: {
    enableOfflineQueue: true,
    syncInterval: 5000,       // Try to sync every 5 seconds when network available
    maxQueueSize: 100
  },

  // Chat settings
  chat: {
    maxMessageLength: 500,
    enableNotifications: true,
    showTypingIndicator: true
  },

  // Photo/notes upload
  upload: {
    maxPhotoSize: 5242880,    // 5MB
    allowedFormats: ['image/jpeg', 'image/png'],
    required: false           // Optional, not required
  }
};

// Job link generator (for admin use)
export function generateJobLink(jobId, driverId, expiryHours = 48) {
  const timestamp = Date.now();
  const expiryTime = timestamp + (expiryHours * 60 * 60 * 1000);
  
  // Generate simple unique token
  const token = btoa(`${jobId}-${driverId}-${timestamp}`).replace(/[^a-zA-Z0-9]/g, '').substring(0, 20);
  
  // In production, this would be stored in Firestore
  const jobLink = `${window.location.origin}/driver-job?token=${token}&jobId=${jobId}`;
  
  return {
    link: jobLink,
    token: token,
    expiryTime: expiryTime,
    jobId: jobId,
    driverId: driverId
  };
}

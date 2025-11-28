// Email Configuration - Google Workspace SMTP
// Using nodemailer to send emails from bookings@hkolimo.com

export const EMAIL_CONFIG = {
  // Google Workspace Settings
  service: 'gmail',
  auth: {
    user: 'bookings@hkolimo.com',
    pass: 'tweo qdoj psvv twmc' // App Password (16 chars without spaces)
  },
  
  // Email Settings
  from: 'bookings@hkolimo.com',
  fromName: 'HKO LIMO Bookings',
  
  // Admin notification email
  adminEmail: 'bookings@hkolimo.com',
  
  // Email templates location
  templatesDir: './email-templates'
};

// Note: This is configured for backend/Cloud Functions
// For frontend-only, we'll use fetch to backend API endpoint

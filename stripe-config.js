// Stripe Configuration - TEST MODE
// These keys are for testing only (no real charges)

export const STRIPE_CONFIG = {
  // TEST MODE KEYS (Safe to use in public)
  publishableKey: 'pk_test_51SCj43L50cwAWABSBaIu3u1vxSnWdVPs5u5sSvTtJY7RDKYB1h9e6C7fVSOchf7LDbsCB1yWmpLyIXBHojOo41vh00ytl3dTRK',
  
  // TEST MODE SECRET KEY (Use environment variable - NEVER expose in code)
  secretKey: process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder_not_for_production',
  
  // Currency in cents (SGD)
  currency: 'sgd',
  
  // Test cards for testing
  testCards: {
    success: '4242 4242 4242 4242', // Successful charge
    decline: '4000 0000 0000 0341', // Card will be declined
    authentication: '4000 0025 0000 3155' // Requires authentication (3D Secure)
  }
};

export const STRIPE_MODE = 'test'; // 'test' or 'live'

// TO SWITCH TO LIVE MODE:
// 1. Get your live keys from Stripe dashboard (pk_live_... and sk_live_...)
// 2. Update environment variables with live keys
// 3. Change STRIPE_MODE to 'live'
// 4. Deploy
// That's it!
// netlify/functions/process-payment.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const data = JSON.parse(event.body);
    const { amount, paymentMethodId, email, bookingDetails } = data;

    if (!amount || amount <= 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid amount' })
      };
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'sgd',
      payment_method: paymentMethodId,
      confirm: true,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never'
      },
      metadata: {
        email: email,
        fullName: bookingDetails?.fullName || 'N/A',
        serviceType: bookingDetails?.serviceType || 'N/A',
        vehicleType: bookingDetails?.vehicleType || 'N/A'
      }
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        paymentIntentId: paymentIntent.id,
        status: paymentIntent.status,
        clientSecret: paymentIntent.client_secret
      })
    };

  } catch (error) {
    console.error('Payment error:', error);
    return {
      statusCode: 400,
      body: JSON.stringify({
        success: false,
        error: error.message || 'Payment processing failed'
      })
    };
  }
};

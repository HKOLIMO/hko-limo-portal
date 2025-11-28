const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const body = JSON.parse(event.body);
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: body.amount,
      currency: 'sgd',
      description: `${body.serviceType} - ${body.vehicleType}`,
      metadata: {
        fullName: body.fullName,
        phone: body.phone,
        serviceType: body.serviceType,
        vehicleType: body.vehicleType,
        pickupLocation: body.pickupLocation,
        dropoffLocation: body.dropoffLocation,
        pickupDate: body.pickupDate,
        pickupTime: body.pickupTime
      }
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        clientSecret: paymentIntent.client_secret
      })
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.message })
    };
  }
};

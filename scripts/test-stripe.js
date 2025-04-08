// Load environment variables
require('dotenv').config();

console.log('Testing Stripe connectivity...');
console.log('NODE_ENV:', process.env.NODE_ENV);

if (!process.env.STRIPE_SECRET_KEY) {
  console.error('Error: STRIPE_SECRET_KEY is missing. Please check your .env file.');
  process.exit(1);
}

// Initialize Stripe with secret key
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function testStripeConnection() {
  try {
    // Try to fetch Stripe account info (simple API call to test connection)
    const account = await stripe.account.retrieve();
    console.log('✓ Stripe connection successful!');
    console.log(`Connected to Stripe account: ${account.id}`);
    
    // Create a test PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1000, // $10.00
      currency: 'usd',
      description: 'Test payment from debug script',
      automatic_payment_methods: { enabled: true }
    });
    
    console.log('✓ Test PaymentIntent created successfully');
    console.log('PaymentIntent ID:', paymentIntent.id);
    console.log('Client Secret:', paymentIntent.client_secret ? '✓ Available' : '✗ Missing');
    
    return { success: true };
  } catch (error) {
    console.error('✗ Stripe API Error:', error.message);
    if (error.type === 'StripeAuthenticationError') {
      console.error('The provided API key is invalid. Please check your STRIPE_SECRET_KEY in the .env file.');
    }
    return { success: false, error };
  }
}

// Execute the test
testStripeConnection()
  .then(result => {
    if (!result.success) {
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('Unexpected error during test:', error);
    process.exit(1);
  }); 
// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
  // Check Stripe configuration
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_PUBLIC_KEY) {
    console.error('⚠️ WARNING: Stripe API keys are missing or invalid!');
    console.error('Payment functionality will not work properly.');
    console.error('Please set STRIPE_SECRET_KEY and STRIPE_PUBLIC_KEY in your .env file.');
  } else {
    console.log('💳 Stripe configuration detected.');
  }
}); 
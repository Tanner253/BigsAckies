const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const nodemailer = require('nodemailer');

/**
 * Payment Service
 * Handles post-order actions like confirmation emails.
 */

// The processPayment function previously here is no longer needed 
// as payment confirmation is handled via client_secret flow and 
// server-side verification in the POST /checkout route.

/**
 * Service for handling post-order actions like confirmation emails.
 */

// Send order confirmation email
const sendOrderConfirmationEmail = async (order, userEmail) => {
  try {
    // Configure email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    
    // Format order items for email
    const itemsList = order.items.map(item => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.product_name}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">$${item.price_at_time.toFixed(2)}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">$${(item.price_at_time * item.quantity).toFixed(2)}</td>
      </tr>
    `).join('');
    
    // Email content
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: userEmail,
      subject: `Order Confirmation #${order.id} - Reptile E-Commerce`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Order Confirmation</h2>
          <p>Thank you for your order!</p>
          
          <div style="background-color: #f5f5f5; padding: 15px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Order #${order.id}</h3>
            <p><strong>Date:</strong> ${new Date(order.created_at).toLocaleDateString()}</p>
            <p><strong>Status:</strong> ${order.status}</p>
          </div>
          
          <h3>Order Summary</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f5f5f5;">
                <th style="padding: 8px; text-align: left;">Product</th>
                <th style="padding: 8px; text-align: center;">Quantity</th>
                <th style="padding: 8px; text-align: right;">Price</th>
                <th style="padding: 8px; text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsList}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="padding: 8px; text-align: right; font-weight: bold;">Order Total:</td>
                <td style="padding: 8px; text-align: right; font-weight: bold;">$${order.total_amount.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
          
          <div style="background-color: #f5f5f5; padding: 15px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Shipping Address</h3>
            <p>${order.shipping_address.replace(/\n/g, '<br>')}</p>
          </div>
          
          <p>If you have any questions about your order, please contact us.</p>
          <p>Thank you for shopping with Reptile E-Commerce!</p>
        </div>
      `
    };
    
    await transporter.sendMail(mailOptions);
    console.log(`Order confirmation email sent to ${userEmail}`);
    
    return true;
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    return false;
  }
};

module.exports = {
  // processPayment, // Removed as it's no longer used
  sendOrderConfirmationEmail
}; 
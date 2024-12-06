// Initialize Stripe with your public key
const stripe = Stripe('pk_live_51NZi0EBZWBbGcBrWd9A4RCTc8eHBzUxUvTclFzNSAWNU7UmZcDsP8Qrfkaz8JWouZGXd1ZTlDFZmXYgtY0Tg5uWj00V7wm1RL2'); // Use your public key

// Create an instance of Elements.
const elements = stripe.elements();

// Create an instance of the card Element.
const card = elements.create("card");

// Add the card Element to the DOM.
card.mount("#card-element");

const form = document.getElementById('payment-form');
const submitButton = document.getElementById('submit-button');
const amountInput = document.getElementById('amount');
const currencySelector = document.getElementById('currency');
const errorMessage = document.getElementById('error-message');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  submitButton.disabled = true;

  // Get the amount and currency selected by the user
  const amount = amountInput.value;
  const currency = currencySelector.value;

  try {
    // Create a payment intent on the server
    const response = await fetch('/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, currency })
    });

    const { clientSecret } = await response.json();

    // Confirm the card payment using Stripe.js
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: card,
        billing_details: {
          name: 'Customer', // Replace with dynamic info if needed
        },
      },
    });

    if (error) {
      errorMessage.textContent = error.message; // Show error message if payment fails
    } else if (paymentIntent.status === 'succeeded') {
      alert('Payment succeeded!');
    }
  } catch (err) {
    errorMessage.textContent = 'An error occurred while processing your payment.';
    console.error(err);
  } finally {
    submitButton.disabled = false;
  }
});

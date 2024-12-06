// Required dependencies
const express = require("express");
const stripe = require("stripe")("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"); // Your secret key
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.static("public"));
app.use(express.json());

// Route to create a payment intent
app.post("/create-payment-intent", async (req, res) => {
    const { amount, currency } = req.body; // Get amount and currency from the request

    try {
        // Create a payment intent with the amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Stripe expects amount in the smallest currency unit
            currency: currency, // Use the selected currency
        });

        // Send the client secret to the frontend
        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.error("Error creating payment intent:", error);
        res.status(500).send({ error: error.message });
    }
});

// Start the server
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

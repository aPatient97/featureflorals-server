const express = require('express');
var cors = require('cors');
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_KEY)
const PORT = process.env.PORT || 4000;
const app = express();
app.use(cors());
app.use(express.static("public"));
app.use(express.json());
// app.use(express.json({
//   limit: '5mb',
//   verify: (req, res, buf) => {
//     req.rawBody = buf.toString();
//   }
// }));

//const endpointSecret = 'whsec_5ca578455e29aa1aa42df8a5894dafc5335ea3d425e6aae9ce872ecf9aac722b'

// const fulfillOrder = (lineItems) => {
//   // TODO: fill me in
//   console.log("Fulfilling order", lineItems);
// }

app.get('/', (req, res) => {
  res.send('Feature florals server.')
})

app.post("/checkout", async (req, res) => {
    console.log(req.body);
    const items = req.body.items;
    let lineItems = [];
    items.forEach((item)=> {
        lineItems.push(
            {
                price: item.id,
                quantity: item.quantity
            }
        )
    });

    const session = await stripe.checkout.sessions.create({
        shipping_address_collection: {allowed_countries: ['GB']},
        shipping_options: [ 
          {shipping_rate: 'shr_1MlxR0KHh276IJGLNQgKueVb'}, 
          {shipping_rate: 'shr_1MlxXxKHh276IJGLVA4cx4GS'}
        ],
        line_items: lineItems,
        mode: 'payment',
        allow_promotion_codes: true,
        success_url: "https://featureflorals.co.uk/success",
        cancel_url: "https://featureflorals.co.uk/cancel",
        custom_fields: [
            {
              key: 'message',
              label: {type: 'custom', custom: 'Personalized message '},
              type: 'text',
            },
        ],

    });

    res.send(JSON.stringify({
        url: session.url
    }));
});

const endpointSecret = "whsec_5ca578455e29aa1aa42df8a5894dafc5335ea3d425e6aae9ce872ecf9aac722b";

app.post('/webhook', express.raw({type: 'application/json'}), (request, response) => {
    const sig = request.headers['stripe-signature'];
  
    let event;
  
    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
  
    // Handle the event
    switch (event.type) {
        case 'billing_portal.session.created':
            const billingPortalSessionCreated = event.data.object;
            // Then define and call a function to handle the event billing_portal.session.created
            console.log(`${event.type} has been logged yee boiii`)
            break;
          case 'checkout.session.completed':
            const checkoutSessionCompleted = event.data.object;
            // Then define and call a function to handle the event checkout.session.completed
            break;
          case 'payment_intent.canceled':
            const paymentIntentCanceled = event.data.object;
            // Then define and call a function to handle the event payment_intent.canceled
            break;
          case 'payment_intent.created':
            const paymentIntentCreated = event.data.object;
            // Then define and call a function to handle the event payment_intent.created
            break;
          case 'payment_intent.payment_failed':
            const paymentIntentPaymentFailed = event.data.object;
            // Then define and call a function to handle the event payment_intent.payment_failed
            break;
          case 'payment_intent.succeeded':
            const paymentIntentSucceeded = event.data.object;
            // Then define and call a function to handle the event payment_intent.succeeded
            break;
          // ... handle other event types
          default:
            console.log(`Unhandled event type ${event.type}`);
        }
  
    // Return a 200 response to acknowledge receipt of the event
    response.send();
  });

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
  });

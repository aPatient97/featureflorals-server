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
                quantity: item.quantity,
                currency: 'gbp'
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
        cancel_url: "https://featureflorals.co.uk/cancel"

    });

    res.send(JSON.stringify({
        url: session.url
    }));
});

// app.post('/webhook', express.raw({type: 'application/json'}), (request, response) => {
//   const sig = request.headers['stripe-signature'];

//   let event;

//   try {
//     event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
//     console.log('Webhook verified!')
//   } catch (err) {
//     console.log(`Webhook Error: ${err.message}`)
//     response.status(400).send(`Webhook Error: ${err.message}`);
//     return;
//   }


//   // Return a 200 response to acknowledge receipt of the event
//   response.send().end;
// });

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
  });

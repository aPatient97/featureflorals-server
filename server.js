//sk_test_51MkbREKHh276IJGL4iJ7UwvweUisQnTdUoxt2R3BTxuqPmmekYmsnh6AHLBOUp5sNl9b4u0SpBlHQlUGAv7bmSGi000SLjmbS8
// tulips: price_1MkbmUKHh276IJGLypHLYnSh
// mixed: price_1MkbnUKHh276IJGLLLjEXu3V
const express = require('express')
const cors = require('cors')
const stripe = require('stripe')('sk_test_51MkbREKHh276IJGL4iJ7UwvweUisQnTdUoxt2R3BTxuqPmmekYmsnh6AHLBOUp5sNl9b4u0SpBlHQlUGAv7bmSGi000SLjmbS8')

const app = express()
app.use(cors)
app.use(express.static('public'))
app.use(express.json())

app.post('/checkout', async (req, res) => {
    console.log(req.body)
    const items = req.body.items
    let lineItems = []
    items.forEach((item) => {
        lineItems.push(
            {
                price: item.id,
                quantity: item.quantity
            }
        )
    });

    const session = await stripe.checkout.sessions.create({
        line_items: lineItems,
        mode: 'payment',
        success_url: 'http://localhost:3000/success',
        cancel_url: 'http://localhost:3000/cancel'
    });

    res.send(JSON.stringify({
        url: session.url
    }))
})
const port = 4000
app.listen(port, () => console.log(`Express sever started, listening on port ${port}`))

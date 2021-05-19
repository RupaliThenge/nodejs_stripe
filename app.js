const express = require('express');
const stripe = require('stripe')('sk_test_51Ejsy8JUsyKg6UFDKwuGDIy4XKgCLAfWp44J21LYoC8iBjfkuHQOorFOm3zcFIqJILhDDZKfi0TdLqK7n2Olpd3000SNeYMO7Z');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');

const app = express();

//Handlebars Middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(express.static(__dirname+'/public'));

//Body-parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));


app.post('/create-checkout-session', async (req, res) => {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Ebook'
              
            },
            unit_amount: 2000,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'http://localhost:5000/success',
      cancel_url: `http://localhost:5000/cancel`,
    });
    res.json({ id: session.id });
  });


app.get('/', (req, res) => {
    res.render('checkout');
});

app.get('/success', (req, res) => {
    res.render('success.handlebars');
});

app.get('/cancel', (req, res) => {
    res.render('cancel.handlebars');
});



const port = 5000;

app.listen(port,() => {
 console.log(`Server started on port ${port}`);
});
const express = require('express');
const app = express();
//const { resolve } = require('path');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

// Replace if using a different env file or config
require('dotenv').config({ path: './.env' });

// {{{ configuration checking
if (
  !process.env.STRIPE_SECRET_KEY ||
  !process.env.STRIPE_PUBLISHABLE_KEY ||
  !process.env.STATIC_DIR
) {
  console.log(
    'The .env file is not configured. Follow the instructions in the readme to configure the .env file. https://github.com/stripe-samples/subscription-use-cases'
  );
  console.log('');
  process.env.STRIPE_SECRET_KEY
    ? ''
    : console.log('Add STRIPE_SECRET_KEY to your .env file.');

  process.env.STRIPE_PUBLISHABLE_KEY
    ? ''
    : console.log('Add STRIPE_PUBLISHABLE_KEY to your .env file.');

  process.exit();
}
// }}}

// {{{ stripe api
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
  appInfo: { // For sample support and debugging, not required for production:
    name: "stripe-samples/subscription-use-cases/fixed-price",
    version: "0.0.1",
    url: "https://github.com/stripe-samples/subscription-use-cases/fixed-price"
  }
});
// }}}

// {{{ Use cookies to simulate logged in user.
app.use(cookieParser());
// }}}

// {{{ Use JSON parser for parsing payloads as JSON on all non-webhook routes.
app.use((req, res, next) => {
  if (req.originalUrl === '/webhook') {
    next();
  } else {
    bodyParser.json()(req, res, next);
  }
});
// }}}

// {{{ Use static to serve static assets.
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, 'public')))
// }}}

app.get('/', (req, res) => {
  console.log('here');
  res.render("index", {test: "Hello World!!!"});
});

app.listen(3000, () => console.log(`Node server listening on port http://localhost:${3000}!`));

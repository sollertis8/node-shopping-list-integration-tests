
const express = require('express');
const morgan = require('morgan');

const app = express();

const shoppingListRouter = require('./shoppingListRouter');
const recipesRouter = require('./recipesRouter');

// log the http layer
app.use(morgan('common'));

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});


// when requests come into `/shopping-list` or
// `/recipes`, we'll route them to the express
// router instances we've imported. Remember,
// these router instances act as modular, mini-express apps.
app.use('/shopping-list', shoppingListRouter);
app.use('/recipes', recipesRouter);

// this function connects to our database, then starts the server
function runServer() {
  const port = process.env.PORT || 8080;
  return new Promise((resolve, reject) => {
    app.listen(port, () => {
      console.log(`Your app is listening on port ${port}`);
      resolve();
    })
    .on('error', err => {
      mongoose.disconnect();
      reject(err);
    });
  });
}

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = {app, runServer};

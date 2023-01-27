const { db, syncAndSeed, Cat, Owner } = require('../db')
const express = require('express');

const morgan = require('morgan');

const app = express();
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));

// define your routes and which file the router for each path is coming from
app.use('/cats', require('./routes/cats')) // every route beginning with /cats/... will use this router
app.use('/owners', require('./routes/owners')) // every route beginning with /owners/... will use this router

// this needs to be defined before it's used in init(),
// but you can define it within the function or outside
// the function if you want.
const PORT = 3000;

const init = async() => {
  try{
    // establish a connection to the database
    await db.authenticate();
    // sync the database with our sequelize models and add seed data as defined in syncAndSeed
    await syncAndSeed();
    // listen for server requests
    app.listen(PORT, () => console.log(`Cat Shelter is Listening on port ${PORT}. Meow!`))
  }
  catch(err){
    console.log(err);
  }
}

init();

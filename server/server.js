const { db, syncAndSeed, Cat, Owner } = require('../db')
const express = require('express');
const router = require('express').Router();

const morgan = require('morgan');

const app = express();
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));

app.use('/cats', require('./routes/cats'))
app.use('/owners', require('./routes/owners'))

// this needs to be defined before it's used in init(),
// but you can define it within the function or outside
// the function if you want.
const PORT = 3000;

const init = async() => {
  try{
    await db.authenticate();
    await syncAndSeed();
    app.listen(PORT, () => console.log(`Cat Shelter is Listening on port ${PORT}. Meow!`))
  }
  catch(err){
    console.log(err);
  }
}

init();

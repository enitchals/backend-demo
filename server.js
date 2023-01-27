const { db, syncAndSeed, Cat, Owner } = require('./db')
const express = require('express');
const morgan = require('morgan');

const app = express();
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));

// this needs to be defined before it's used in init(),
// but you can define it within the function or outside
// the function if you want.
const PORT = 3000;

app.get('/cats', async(req, res, next)=> {
  try{
    const cats = await Cat.findAll();
    if (cats) {
      // 200 will be returned automatically --
      // but here's an example just to be explicit
      // more about HTTP codes: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
      res.status(200).json(cats);
      // more about JSON:
      // https://www.w3schools.com/js/js_json_intro.asp

    }
  }
  catch(err){
    next(err);
  }
})

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

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

app.post('/cats', async(req, res, next) => {
  try {
    const newCat = await Cat.create(req.body);
    res.status(201).send(newCat);
  }
  catch(err){
    next(err);
  }
})

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

app.get('/cats/details/:id', async(req, res, next) => {
  try {
    // req.params.id comes from the :id in the route above
    // all query params are available as properites of req.params
    const cat = await Cat.findByPk(req.params.id);
    res.send(cat);
  }
  catch(err){
    next(err);
  }
})

app.get('/cats/adoptable', async(req, res, next) => {
  try{
    const adoptableCats = await Cat.findAll({where: {adopted: false}})
    res.send(adoptableCats);
  }
  catch(err){
    next(err);
  }
})

app.get('/cats/adopted', async(req, res, next) => {
  try{
    const adoptedCats = await Cat.findAll({where: {adopted: true}})
    res.send(adoptedCats);
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

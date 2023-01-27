// the express router is what ties the routes below to the /cats/ path
// we also need to export the router at the bottom (after we have added our router.get, router.post, etc)
// AND we need to have a line like this in server.js:
// app.use('/cats', require('./routes/cats'))
const router = require('express').Router();

const {Cat} = require('../../db');

router.post('/', async(req, res, next) => {
  try {
    const newCat = await Cat.create(req.body);
    res.status(201).send(newCat);
  }
  catch(err){
    next(err);
  }
})

router.get('/', async(req, res, next)=> {
  try{
    // remember, findAll generates SQL like this:
    // SELECT * FROM database_name;
    const cats = await Cat.findAll();
    if (cats) {
      // 200 will be returned automatically --
      // but here's an example just to be explicit
      // more about HTTP codes: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
      res.status(200).json(cats);
      // more about JSON:
      // https://www.w3schools.com/js/js_json_intro.asp
      // more about res.send vs res.json:
      // https://medium.com/gist-for-js/use-of-res-json-vs-res-send-vs-res-end-in-express-b50688c0cddf
    }
  }
  catch(err){
    next(err);
  }
})

router.get('/details/:id', async(req, res, next) => {
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

router.get('/adoptable', async(req, res, next) => {
  try{
    // we can pass options to `findAll()` such as a `where` to add a WHERE clause to our SQL
    // there are lots of other ways to filter rows/instances -- see the sequelize docs for more:
    // https://sequelize.org/docs/v6/core-concepts/model-querying-basics/#applying-where-clauses
    const adoptableCats = await Cat.findAll({where: {adopted: false}})
    res.send(adoptableCats);
  }
  catch(err){
    next(err);
  }
})

router.get('/adopted', async(req, res, next) => {
  try{
    const adoptedCats = await Cat.findAll({where: {adopted: true}})
    res.send(adoptedCats);
  }
  catch(err){
    next(err);
  }
})

// don't forget to export your router! We'll need this in server.js
module.exports = router;

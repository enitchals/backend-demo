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

module.exports = router;

const router = require('express').Router();

const {Cat, Owner} = require('../../db');

router.get('/', async(req, res, next) => {
  try{
    const owners = await Owner.findAll({include: Cat});
    res.send(owners);
  }
  catch(err){
    next(err);
  }
})

router.get('/:id', async(req, res, next) => {
  try{
    const owner = await Owner.findByPk(req.params.id, {include: Cat});
    res.send(owner);
  }
  catch(err){
    next(err);
  }
})

module.exports = router;

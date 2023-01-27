const Sequelize = require('sequelize');
const {STRING, INTEGER, BOOLEAN} = Sequelize;
const db = new Sequelize('postgres://localhost/cat_shelter');

const Cat = db.define('cat', {
  name: {
    type: STRING,
    allowNull: false
  },
  age: INTEGER,
  adjective: STRING,
  adopted: {
    type: BOOLEAN,
    defaultValue: false
  },
  weeksInShelter: INTEGER
})

const syncAndSeed = async() => {
  await db.sync({force: true});
  await Cat.create({name: 'Mike', age: 5, adjective: 'friendly'});
  await Cat.create({name: 'Mustard', age: 2, adjective: 'skittish'});
  await Cat.create({name: 'Mary', age: 9, adjective: 'cuddly'});
  await Cat.create({name: 'Maxine', age: 4, adjective: 'playful'});
}

const init = async() => {
  try{
    await db.authenticate();
    await syncAndSeed();
  }
  catch(err){
    console.log(err);
  }
}

init();

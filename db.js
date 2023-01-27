const Sequelize = require('sequelize');
const {STRING, INTEGER, BOOLEAN, VIRTUAL} = Sequelize;
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
  weeksInShelter: INTEGER,
  description: {
    type: VIRTUAL,
    get(){
      return `${this.name} is a ${this.age} year old, ${this.adjective} cat who has been at the shelter for ${this.weeksInShelter} weeks.`
    }
  }
})

Cat.beforeCreate(
  cat => {
    if (cat.ownerId){
      cat.adopted = true;
    }
    if (!cat.ownerId){
      cat.weeksInShelter = Math.floor(Math.random()*10);
    }
  }
)

const Owner = db.define('owner', {
  name: {
    type: STRING,
    allowNull: false
  },
  email: {
    type: STRING,
    isEmail: true,
    allowNull: false
  }
})

Owner.hasMany(Cat);

const syncAndSeed = async() => {
  await db.sync({force: true});
  await Owner.create({name: 'Ellen', email: 'ellen@ilovecats.com'})
  await Cat.create({name: 'Mike', age: 5, adjective: 'friendly'});
  await Cat.create({name: 'Mustard', age: 2, adjective: 'skittish', ownerId: 1});
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

const Sequelize = require('sequelize');
const {STRING, INTEGER, BOOLEAN, VIRTUAL, Model} = Sequelize;
const db = new Sequelize('postgres://localhost/cat_shelter');

class Cat extends Model {
  static catMeow() {
    return 'meow';
  }
  sayMeow(){
    return 'this cat says meow!'
  }
}

Cat.init( {
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
}, {sequelize: db})

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
  const cat = await Cat.create({name: 'Maxine', age: 4, adjective: 'playful'});
  console.log(Cat.catMeow());
  console.log(cat.sayMeow());
  // can't call catMeow() on an instance because it's a class level method
  // console.log(cat.catMeow());
  // can't call sayMeow() on the class/Model because it's an instance-level method
  // console.log(Cat.sayMeow());
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

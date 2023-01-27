const Sequelize = require('sequelize');
const {STRING, INTEGER, BOOLEAN, VIRTUAL, Model} = Sequelize;
const db = new Sequelize('postgres://localhost/cat_shelter');

// define an Owner model -- the simplest way to define a model
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

// this is another way of defining a model - we create a class that extends Model,
// and then we add methods to it.
// a STATIC/CLASS method will be called from the class itself (i.e. Cat.method())
// other methods (INSTANCE methods) will be called from the class instance (i.e. cat.method())
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
      // note that we have a bit of a bug here!
      // if a cat has been adopted, then `this.weeksInShelter` will be null.
      // how would you fix this?
      return `${this.name} is a ${this.age} year old, ${this.adjective} cat who has been at the shelter for ${this.weeksInShelter} weeks.`
    }
  }
  // Make sure this second argument passed to `Model.init()` has `sequelize` as the key and your Sequelize instance as the value
}, {sequelize: db})

// Sequelize hook AKA 'lifecycle event' - this is for `beforeCreate` but there are many others
// See Sequelize docs for more info: https://sequelize.org/docs/v6/other-topics/hooks/
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

// Sequelize Assosication between tables -- this creates the `ownerId` key on the Cat model,
// which accepts the id for the Owner instance (table row) that is the owner of this cat.
Owner.hasMany(Cat);

const syncAndSeed = async() => {
  // db.sync makes sure that our database tables are set up according to the models we defined
  // `force: true` is an option that will drop existing tables, if they exist.
  await db.sync({force: true});
  // seed our database with instances of an owner and some cats
  await Owner.create({name: 'Ellen', email: 'ellen@ilovecats.com'})
  await Cat.create({name: 'Mike', age: 5, adjective: 'friendly'});
  await Cat.create({name: 'Mustard', age: 2, adjective: 'skittish', ownerId: 1});
  await Cat.create({name: 'Mary', age: 9, adjective: 'cuddly'});

  // I assigned one of these instances to a variable so I could demo instance methods in the console.log() below
  const cat = await Cat.create({name: 'Maxine', age: 4, adjective: 'playful'});

  // uncomment these to see instance and class methods being called when the db is seeded
  // console.log(Cat.catMeow());
  // console.log(cat.sayMeow());

  // can't call catMeow() on an instance because it's a class level method
  // console.log(cat.catMeow());

  // can't call sayMeow() on the class/Model because it's an instance-level method
  // console.log(Cat.sayMeow());
}

// export everything we'll need to use in our server.js and associated routes
module.exports = {
  db,
  syncAndSeed,
  Cat,
  Owner
}

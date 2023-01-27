const Sequelize = require('sequelize');
const db = new Sequelize('postgres://localhost/cat_shelter');

const syncAndSeed = async() => {
  await db.sync({force: true});
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

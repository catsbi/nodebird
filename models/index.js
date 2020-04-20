const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];

const sequelize = new Sequelize(config.database, config.username, process.env.DB_PASSWORD, config);
const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = require('./user')(sequelize, Sequelize);
db.Post = require('./post')(sequelize, Sequelize);
db.Hashtag = require('./hashtag')(sequelize, Sequelize);

/**
 * 주가되는 1이(1:N관계) 먼저 등록해줘야 한다.
 * user 하나가 여러개의 post를 가지고 있다. 1:N
 */
db.User.hasMany(db.Post);
db.Post.belongsTo(db.User);

db.Post.belongsToMany(db.Hashtag, { through: 'PostHashtag' });
db.Hashtag.belongsToMany(db.Post, { through: 'PostHashtag' });

db.User.belongsToMany(db.User, {
    through: 'Follow',
    as: 'Followers',
    foreignKey: 'followingId',
});
db.User.belongsToMany(db.User, {
    through: 'Follow',
    as: 'Followings',
    foreignKey: 'followerId',
});
db.User.belongsToMany(db.Post, { through: 'Like' });
db.Post.belongsToMany(db.User, { through: 'Like', as:'Liker'});

/*Object.keys(db).forEach(modelName=>{
  if(db[modelName].associate){
    db[modelName].associate(db);
  }
});*/
module.exports = db;
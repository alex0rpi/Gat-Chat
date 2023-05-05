import Sequelize, { DataTypes } from 'sequelize';
import mysqlConfig from '../db/configMysql';

import _Users from './Users';
import _Messages from './Messages';
import _Rooms from './Rooms'
import _UserRoom from './users_rooms'

import { designDB } from '../db/createMysqldb';

const sequelize = new Sequelize(mysqlConfig.name, mysqlConfig.user, mysqlConfig.password, {
  host: mysqlConfig.host,
  port: mysqlConfig.port,
  dialect: 'mysql',
  define: { freezeTableName: true },
  logging: false,
});

function initModels(sequelize) {
  const User = _Users(sequelize, DataTypes);
  const Message = _Messages(sequelize, DataTypes);
  const Room = _Rooms(sequelize, DataTypes);
  const UserRoom = _UserRoom(sequelize, User, Room);
  User.belongsToMany(Room, { through: UserRoom, foreignKey: 'userId', otherKey: 'roomId' });
  Room.belongsToMany(User, { through: UserRoom, foreignKey: 'roomId', otherKey: 'userId' });
  User.hasMany(Message, { foreignKey: 'UserId' });
  Room.hasMany(Message, { foreignKey: 'RoomId' }); // foreign key appears in the messages table.
  return {
    User,
    Message,
    Room,
    UserRoom
  };
}

const { User, Message, Room, UserRoom } = initModels(sequelize);

const initDB = async () => {
  try {
    await designDB();
    await sequelize.authenticate();
    await sequelize.sync({ force: false });
    console.log('Mysql DB successfully connected.');
  } catch (error) {
    console.log(error.message);
    console.log('There was an error connecting with the database');
    process.exit(1);
  }
};

export { User, Message, Room, UserRoom, initDB as default };

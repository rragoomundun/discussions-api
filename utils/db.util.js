import { Sequelize } from 'sequelize';
import colors from 'colors';
import net from 'net';

net.setDefaultAutoSelectFamily(false);

const isLocal = process.env.DATABASE_URL.includes('localhost');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: isLocal ? {} : { ssl: { require: true } },
  logging: false
});

try {
  await sequelize.authenticate();
  console.log(`[OK] Connected to database`.green);
} catch (error) {
  console.log('[FAILED] Connection to database failed'.red);
  console.log(error.message);
}

export default sequelize;

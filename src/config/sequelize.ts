import { Sequelize } from 'sequelize'
import { config } from 'dotenv'

config()
const sequelize = new Sequelize(`${process.env.MYSQL_DEFAUTL}`, {
  host: `${process.env.HOST}`,
  dialect: 'mysql',
})

export default sequelize

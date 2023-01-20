import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize";
import { UserSchema } from "./User";

export interface TodoSchema{
  id?: number,
  title?:string,
  content?:string,
  userId?: number,
  createdAt?: string,
  updatedAt?:string,
  save(): unknown,
  destroy(): unknown
}

const Todo= sequelize.define('todo', {
  id:{
    type: DataTypes.INTEGER,
    allowNull:false,
    autoIncrement:true,
    primaryKey:true
  },
  title:{
    type: DataTypes.STRING,
    allowNull: false,
    validate:{
      notNull:{
        msg: "Please input the title"
      }
    }
  },
  content:{
    type: DataTypes.STRING,
    allowNull:false,
    validate:{
      notNull:{
        msg: "Please input the content"
      }
    }
  }
}, {timestamps:true})

export default Todo
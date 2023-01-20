import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize";

export interface UserSchema{
  id?: number,
  name?: string,
  email?: string,
  password?: string,
  role?: string,
  isAdmin?: boolean,
  isActive?: boolean,
  token?:string,
  createdAt?: string,
  updatedAt?: string,
  save(): unknown,
  destroy():unknown
}

const User= sequelize.define('user', {
  id:{
    type: DataTypes.INTEGER,
    allowNull:false,
    autoIncrement:true,
    primaryKey:true
  },
  name:{
    type: DataTypes.STRING,
    allowNull:false,
    validate:{
      notNull:{
        msg: "Please input the name"
      }
    }
  },
  email:{
    type: DataTypes.STRING,
    allowNull:false,
    validate:{
      notNull:{
        msg: "Please input the email"
      }
    }
  },
  password:{
    type: DataTypes.STRING,
    allowNull:false,
    validate:{
      notNull:{
        msg: "Please input the password"
      }
    }
  },
  role:{
    type: DataTypes.STRING,
    allowNull:false,
    validate:{
      notNull:{
        msg: "Please input the role"
      },
      isIn:{
        args: [['user', 'admin']],
        msg: "Please input the correct role"
      }
    },
    defaultValue:'user'
  },
  isAdmin:{
    type: DataTypes.BOOLEAN,
    allowNull:false,
    defaultValue: false
  },
  isActive:{
    type: DataTypes.BOOLEAN,
    allowNull:false,
    defaultValue:true
  }
}, {timestamps:true})

export default User
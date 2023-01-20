import { Op } from "sequelize";
import User, { UserSchema } from "../../model/User";
import bcryptjs from "bcryptjs"
import generatedToken from "../../helper/generatedToken";
import { Context, TypeModelContext } from "../../utility/contextType";
import queryUser from "../../helper/queryUser";

export default {
  Query:{
    users: async (_:any, __:any, {user:auth}:Context): Promise<TypeModelContext> =>{
      if(!auth.id) return { errors: [ { message: "User not authorized" } ] }
      const user= await User.findAll({ order: [['createdAt', 'desc']] }) as UserSchema[]
      
      if(user.length === 0){
        return {
          errors:[
            { message: "Users not found" }
          ],
        }
      }
      return {
        errors:[
          { message: "" }
        ],
        data:user
      }
    },

    user: async (_:any, { id }: {id: number}, {user}:Context): Promise<TypeModelContext> =>{
      if(!user.id) return { errors: [ { message: "User not authorized" } ] }
      const auth= await queryUser(id)
      return auth
    },

    profile: async (_:any, __:any, {user}:Context): Promise<TypeModelContext> =>{
      if(!user.id) return { errors: [ { message: "User not authorized" } ] }      
      return {
        errors:[
          { message: "" }
        ],
        data: user
      }
    }

  },

  Mutation:{

    registerUser:async (_:any, {input}:{input: UserSchema}, _ctx:any): Promise<TypeModelContext> =>{
      const { name, email, password } = input

      if(!name){
        return { errors: [{ message: "Please input the name" }] }
      }
      if(!email){
        return { errors: [{ message: "Please input the email" }] }
      }
      if(!password){
        return { errors: [{ message: "Please input the password" }] }
      }
      if(password.length < 6){
        return { errors: [{ message: "Password should be atleast 6 characters" }] }
      }

      const checkName= await User.findOne({ where: { name: { [Op.like]: `%${name.toLowerCase()}%` } } })
      if(checkName){
        return { errors: [{ message: "Name was already exist" }] }
      }

      const checkEmail= await User.findOne({ where: { email: { [Op.like]: `%${email.toLowerCase()}%` } } })
      if(checkEmail){
        return { errors: [{ message: "Email was already exist" }] }
      }

      const genSalt= await bcryptjs.genSalt(10)
      const hash= await bcryptjs.hash(password, genSalt)

      const values={
        name: name.trim(),
        email: email.trim(),
        password: hash,
        role: 'user',
        isAdmin:false,
        isActive: true
      }
      const user= await User.create(values) as UserSchema

      return {
        errors: [
          { message: "" }
        ],
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          password: user.password,
          role: user.role,
          isAdmin: user.isAdmin,
          isActive: user.isActive,
          token: generatedToken(Number(user.id))
        },
      }
    },
    
    logInUser:async(_:any, {input}: {input: UserSchema}, {user}:Context): Promise<TypeModelContext> =>{
      
      const { email, password } = input

      if(!email){
        return { errors: [{ message: "Please input the email" }] }
      }
      if(!password){
        return { errors: [{ message: "Please input the password" }] }
      }
      if(password.length < 6){
        return { errors: [{ message: "Password should be atleast 6 characters" }] }
      }

      const userCheck= await User.findOne({ where: { email : { [Op.like]: `%${email.toLowerCase()}%` } } }) as UserSchema  
      if(!userCheck){
        return {
          errors:[
            { message: "Email is incorrect" }
          ],
        }
      }

      const passwordCheck = await bcryptjs.compare(password, userCheck.password!)
      if(!passwordCheck){
        return {
          errors: [
            { message: "Password is incorrect" }
          ]
        }
      }

      userCheck.isActive=true
      userCheck.save()
      // if(user.id){
      //   await User.update({ isActive: true }, {where: { id: user.id }})
      // }
      
      return {
        errors:[
          {message: ""}
        ],
        data: {
          id: userCheck.id,
          name: userCheck.name,
          email: userCheck.email,
          password: userCheck.password,
          role: userCheck.role,
          isAdmin: userCheck.isAdmin,
          isActive: true,
          token: generatedToken(Number(userCheck.id)),
        }
      }

    },

    logOutUser: async (_:any, __:any, {user}: Context): Promise<TypeModelContext> =>{
      if(!user.id) return { errors: [ { message: "User not authorized" } ] }
      // await User.update({ isActive: false }, { where: { id: user.id } })
      const auth= await User.findByPk(user.id) as UserSchema
      if(!auth){
        return {
          errors:[
            { message: "User not found" }
          ]
        }
      }
      auth.isActive=false
      auth.save()

      return {
        errors:[
          { message: "" }
        ],
        data: {
          id: auth.id,
          name: auth.name,
          email: auth.email,
          password: auth.password,
          role: auth.role,
          isAdmin: auth.isAdmin,
          isActive: auth.isActive,
          token: generatedToken(Number(auth.id)),
        }
      }
    }

  }
}
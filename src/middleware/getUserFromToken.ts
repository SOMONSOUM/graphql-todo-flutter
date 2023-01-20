import jsonwebtoken from "jsonwebtoken"
import { config } from "dotenv"
import User, { UserSchema } from "../model/User"

config()
interface Decoded{
  id: number
}

const getUserFromToken = async (token: string) =>{
  
  try{
    const decoded= jsonwebtoken.verify(token, `${process.env.JWT_SECRET_KEY}`) as Decoded
    const user= await User.findByPk(decoded.id) as UserSchema
    return user
    
  }catch(err:any){
    return err
  }

}
export default getUserFromToken
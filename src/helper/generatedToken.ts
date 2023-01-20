import jsonwebtoken from "jsonwebtoken"
import { config } from "dotenv"

config()
const generatedToken = (id: string | number) =>{
  return jsonwebtoken.sign({id}, `${process.env.JWT_SECRET_KEY}`, {expiresIn: `${process.env.JWT_EXPIRE_IN}`})
}

export default generatedToken
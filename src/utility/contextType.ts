import { TodoSchema } from "../model/Todo";
import { UserSchema } from "../model/User";

interface Message{
  message: string
}
export interface Context{
  user: UserSchema
}
export interface TypeModelContext{
  errors: Message[],
  data?: any,
  length?:number
}
import User, { UserSchema } from "../model/User";
import { TypeModelContext } from "../utility/contextType";

const queryUser = async (id: number): Promise<TypeModelContext> => {
  const user = (await User.findByPk(id)) as UserSchema;
  if (!user) {
    return {
      errors: [{ message: "User not found" }],
    };
  }
  return {
    errors: [{ message: "" }],
    data: user,
  };
};

export default queryUser

import queryUser from "../../helper/queryUser";
import Todo, { TodoSchema } from "../../model/Todo";
import { Context, TypeModelContext } from "../../utility/contextType";

export default {
  Todo: {
    user: async (_: any, __: any, { user }: Context) => {
      if (!user.id) return { errors: [{ message: "User not authorized" }] };
      const auth = await queryUser(user.id);
      return auth.data;
    },
  },
  Query: {
    todos: async (
      _: any,
      __: any,
      { user }: Context
    ): Promise<TypeModelContext> => {
      if (!user.id) return { errors: [{ message: "User not authorized" }] };
      const allTodo = await Todo.findAll({
        where: { userId: user.id },
        order: [["createdAt", "desc"]],
      });

      if (allTodo.length === 0) {
        return {
          errors: [{ message: "Todos not found" }],
          data: [],
        };
      }
      return {
        errors: [],
        data: allTodo,
        length: allTodo.length,
      };
    },
    todo: async (
      _: any,
      { id }: { id: string },
      { user }: Context
    ): Promise<TypeModelContext> => {
      if (!user.id) return { errors: [{ message: "User not authorized" }] };

      const todo = (await Todo.findByPk(id)) as TodoSchema;
      if (!todo) {
        return {
          errors: [{ message: "Todo not found" }],
        };
      }
      if (todo.userId !== user.id) {
        return {
          errors: [{ message: "User cannot access the todo" }],
        };
      }
      return {
        errors: [],
        data: todo,
      };
    },
  },
  Mutation: {
    createTodo: async (
      _: any,
      { input }: { input: TodoSchema },
      { user }: Context
    ): Promise<TypeModelContext> => {
      if (!user.id) return { errors: [{ message: "User not authorized" }] };

      const { title, content } = input;
      if (!title) {
        return {
          errors: [{ message: "Please input the title" }],
        };
      }
      if (!content) {
        return {
          errors: [{ message: "Please input the content" }],
        };
      }

      const values = {
        title,
        content,
        userId: user.id,
      };
      const todo = await Todo.create(values);

      return {
        errors: [],
        data: todo,
      };
    },

    updateTodo: async (
      _: any,
      { id, input }: { id: number; input: TodoSchema },
      { user }: Context
    ): Promise<TypeModelContext> => {
      const { title, content } = input;
      if (!user.id) return { errors: [{ message: "User not authorized" }] };
      const todo = (await Todo.findByPk(id)) as TodoSchema;

      if (!todo) {
        return {
          errors: [{ message: "Todo not found" }],
        };
      }
      if (todo.userId !== user.id) {
        return {
          errors: [{ message: "User cannot access the todo" }],
        };
      }

      todo.title = title;
      todo.content = content;
      todo.save();

      return {
        errors: [{ message: "" }],
        data: todo,
      };
    },

    deleteTodo: async (
      _: any,
      { id }: { id: number },
      { user }: Context
    ): Promise<TypeModelContext> => {
      if (!user.id) return { errors: [{ message: "User not authorized" }] };
      const todo = (await Todo.findByPk(id)) as TodoSchema;

      if (!todo) {
        return {
          errors: [{ message: "Todo not found" }],
        };
      }
      if (todo.userId !== user.id) {
        return {
          errors: [{ message: "User cannot access the todo" }],
        };
      }
      await todo.destroy();

      return {
        errors: [],
        data: todo,
      };
    },
  },
};

import getTodoService from "../services/todo/get-service";
import createTodoService from "../services/todo/create-service";
import updateTodoService from "../services/todo/update-service";
import { Request, Response } from "express";


class todoController {
  async getTodos(req: Request, res: Response): Promise<any> {
    console.log('todo controller()');
    try {
      const result = await getTodoService.handle(req.user?.userId, {...req.params, ...req.query});
      console.log('result:', result);
      return res.json(result);
    } catch (error) {
      console.error(error);
      res.status(400).json({ error: error.message });
    }
  }

  async createTodo(req: Request, res: Response): Promise<any> {
    console.log('todo controller()');
    try {
      const result = await createTodoService.handle(req.user?.userId, req.body);
      console.log('result:', result);
      return res.json(result);
    } catch (error) {
      console.error(error);
      return res.status(400).json({ error: error.message });
    }
  }

  async updateTodo(req: Request, res: Response): Promise<any> {
    console.log('todo controller()');
    try {
      const result = await updateTodoService.handle(req.user?.userId, {...req.body, ...req.params}, req.files);
      console.log('result:', result);
      return res.json(result);
    } catch (error) {
      console.error(error);
      return res.status(400).json({ error: error.message });
    }
  }
}

export default new todoController();

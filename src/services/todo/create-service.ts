import todoRepository from "../../repositories/todo-repository";


class CreateTodoService
{
  async handle(userId, request) {
    console.log("Creating todos");

    return await todoRepository.createTodo(userId, request);
  }
}

export default new CreateTodoService();

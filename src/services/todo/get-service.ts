import todoRepository from "../../repositories/todo-repository";

class GetTodoService
{
  async handle(userId, request) {
    console.log("Getting todos");

    const conditions: any = { userId }
    if (request?.id) {
      conditions.id = parseInt(request.id);
    }

    const todos = await todoRepository.getTodos(conditions);

    const formattedTodos = todos.map(todo => ({
      id: todo.id,
      title: todo.title,
      description: todo.description,
      startDate: todo.startDate,
      endDate: todo.endDate,
      completed: todo.completed,
      images: todo.images.map(image => ({
        id: image.id,
        url: image.imageUrl
      })),
      createdAt: todo.createdAt,
      updatedAt: todo.updatedAt,
    }));

    return request?.id ? formattedTodos[0] : formattedTodos;
  }
}

export default new GetTodoService();

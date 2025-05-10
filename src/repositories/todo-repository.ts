import { prisma } from "../utils/prisma";


class TodoRepository {
  async getTodos(conditions) {
    return prisma.todo.findMany({
      where: { ...conditions },
      include: {
        images: true,
      }
    });
  }

  async createTodo(userId, todoData) {
    return prisma.todo.create({
      data: {
        ...todoData,
        userId,
      },
    });
  }

  async updateTodo(userId, todoData, imageUrls) {
    return prisma.$transaction(async (tx) => {
      const updatedTodo = await tx.todo.update({
        where: {
          id: parseInt(todoData.id),
          userId: userId
        },
        data: {
          title: todoData.title,
          description: todoData.description,
          startDate: todoData.startDate ? new Date(todoData.startDate) : undefined,
          endDate: todoData.endDate ? new Date(todoData.endDate) : undefined,
          completed: todoData.completed !== undefined ? Boolean(todoData.completed) : undefined
        },
        include: {
          images: true
        }
      });

      // 画像URLがある場合、TodoImageテーブルに挿入
      if (Array.isArray(imageUrls) && imageUrls.length > 0) {
        // 新しい画像データを準備
        const imageData = imageUrls.map(url => ({
          todoId: updatedTodo.id,
          imageUrl: url
        }));

        // 複数の画像を一括で追加
        await tx.todoImage.createMany({
          data: imageData
        });
      }

      // 更新されたTodoを画像も含めて再取得
      return tx.todo.findUnique({
        where: {
          id: updatedTodo.id
        },
        include: {
          images: true
        }
      });
    });
  }
}

export default new TodoRepository();

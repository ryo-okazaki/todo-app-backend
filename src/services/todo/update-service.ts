import todoRepository from "../../repositories/todo-repository";
import s3Uploader from "../../utils/file-uploader";
import { userTodoImageUrl } from "../../utils/url-generator";


class UpdateTodoService
{
  async handle(userId, request, files?) {
    console.log("Updating todos");
    console.log('request:', request);

    let todoData = {...request, userId};
    let imageUrls = await this.#uploadFiles(userId, files);

    const todo = await todoRepository.updateTodo(userId, todoData, imageUrls);

    return {
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
    }
  }

  async #uploadFiles(userId, files) {
    // ファイルが配列の場合（複数ファイルアップロード）
    if (files && Array.isArray(files) && files.length > 0) {
      const uploadPromises = files.map(async (file) => {
        const result = await s3Uploader.uploadFile(file.buffer, {
          fileName: file.originalname,
          contentType: file.mimetype,
          prefix: userTodoImageUrl(userId),
        });
        return result.fileUrl;
      });

      // すべてのアップロードを並行処理
      return await Promise.all(uploadPromises);
    }
    // 単一ファイルの場合
    else if (files && files.buffer) {
      const result = await s3Uploader.uploadFile(files.buffer, {
        fileName: files.originalname,
        contentType: files.mimetype,
        prefix: userTodoImageUrl(userId),
      });

      return result.fileUrl;
    }

    return [];
  }
}


export default new UpdateTodoService();

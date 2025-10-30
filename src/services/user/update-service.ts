import userRepository from "../../repositories/user-repository";
import s3Uploader from "../../utils/file-uploader";
import { userAvatarUrl } from "../../utils/url-generator";


class UpdateService
{
  async handle(userId, request, file?) {
    console.log("updating user");
    console.log(`request.body}`, request);
    console.log(`request.file}`, file);

    // ファイルがある場合はアップロード処理
    let avatarUrl = null;
    if (file) {
      avatarUrl = await this.#uploadFile(userId, file);
    }

    let payload: { name: string; avatar_url?: string } = {
      name: request.name,
    }

    if (avatarUrl) {
      payload.avatar_url = avatarUrl;
    }

    // ユーザー更新
    const newUser = await userRepository.updateUser({
      id: userId,
      ...payload,
    });

    // パスワードを除外したユーザー情報を返す
    const { password: _, verificationToken: __, ...userWithoutPassword } = newUser;

    return userWithoutPassword;
  }

  async #uploadFile(userId, file) {
    // 単一ファイルのアップロード
    if (file && file.buffer) {
      const result = await s3Uploader.uploadFile(file.buffer, {
        fileName: file.originalname,
        contentType: file.mimetype,
        prefix: userAvatarUrl(userId),
      });

      return result.fileUrl;
    }

    return null;
  }
}

export default new UpdateService();

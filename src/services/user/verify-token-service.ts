import userRepository from "../../repositories/user-repository";

class VerifyTokenService
{
  async handle(request) {
    console.log("verify token user");
    console.log(`request: ${request.token}`);

    const token = request.token;

    if (!token) {
      throw new Error('無効なトークンです')
    }

    // トークンでユーザーを検索
    const user = await userRepository.findUserByToken(token);

    if (!user) {
      throw new Error('ユーザーが見つかりません')
    }

    // ユーザーをアクティブ化
    await userRepository.activateUser(user.id);

    // 成功メッセージを返す（またはリダイレクト）
    return {'message': 'メールアドレスが検証されました。'}
  }

}

export default new VerifyTokenService();

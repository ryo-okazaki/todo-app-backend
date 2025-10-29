import userRepository from "../../repositories/user-repository";
import bcrypt from 'bcryptjs';

class ResetPasswordConfirmService
{
  async handle(request) {
    console.log("reset password confirm service");

    const { token, password } = request;

    if (!token) {
      throw new Error('無効なトークンです');
    }

    if (!password || password.length < 8) {
      throw new Error('パスワードは8文字以上である必要があります');
    }

    // トークンでユーザーを検索
    const user = await userRepository.findUserByPasswordResetToken(token);

    if (!user) {
      throw new Error('無効または期限切れのトークンです');
    }

    // トークンの有効期限を確認
    if (user.resetTokenExpiry && new Date() > new Date(user.resetTokenExpiry)) {
      throw new Error('トークンの有効期限が切れています');
    }

    // パスワードをハッシュ化
    const hashedPassword = await bcrypt.hash(password, 10);

    // パスワードを更新し、リセットトークンをクリア
    await userRepository.updatePassword(user.id, hashedPassword);
    await userRepository.clearPasswordResetToken(user.id);

    return { 'message': 'パスワードが正常に更新されました。' };
  }
}

export default new ResetPasswordConfirmService();

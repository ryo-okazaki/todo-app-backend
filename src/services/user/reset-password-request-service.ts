import userRepository from "../../repositories/user-repository";
import mailService from "../../utils/mail-sender";
import crypto from "crypto";

class ResetPasswordRequestService
{
  async handle(request) {
    console.log("reset password request service");
    console.log(`request.body: ${request.email}`);

    const email = request.email;

    if (!email) {
      throw new Error('メールアドレスが必要です');
    }

    // メールアドレスでユーザーを検索
    const user = await userRepository.findUserByEmail(email);

    if (!user) {
      // セキュリティのため、ユーザーが存在しない場合も成功メッセージを返す
      console.warn(`User not found for email: ${email}`)
      return { 'message': 'パスワードリセット用のメールを送信しました。' };
    }

    // パスワードリセット用のトークンを生成(ランダムな32バイト)
    const resetToken = crypto.randomBytes(32).toString('hex');

    // トークンの有効期限(1時間後)
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1時間

    // トークンとその有効期限をDBに保存
    await userRepository.savePasswordResetToken(user.id, resetToken, resetTokenExpiry);

    // メール送信
    await mailService.sendPasswordResetEmail(
      user.email,
      resetToken,
    );

    return { 'message': 'パスワードリセット用のメールを送信しました。' };
  }

}

export default new ResetPasswordRequestService();

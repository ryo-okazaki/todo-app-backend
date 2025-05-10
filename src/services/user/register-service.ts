import userRepository from "../../repositories/user-repository";
import mailService from "../../utils/mail-sender";

import bcrypt from "bcryptjs";
import { UserStatus } from "../../enums/user-status";

class RegisterService
{
  async handle(request) {
    console.log("registering user");
    console.log(`request.body: ${request.email}`);

    // バリデーション
    if (!request.email || !request.password || !request.name) {
      throw new Error('フィールドが不足しています');
    }

    // メールアドレスのフォーマット確認
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(request.email)) {
      throw new Error('無効なメールアドレスです');
    }

    // ユーザーの重複チェック
    const existingUser = await userRepository.findUserByEmail(request.email);
    if (existingUser) {
      throw new Error('このメールアドレスは既に使用されています');
    }

    // パスワードのハッシュ化
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(request.password, salt);

    // ユーザー作成
    const newUser = await userRepository.createUser({
      email: request.email,
      password: hashedPassword,
      name: request.name,
      status: UserStatus.PENDING,
    });
    console.log("created user", newUser);
    console.log("token", newUser.token);

    // 確認メール送信
    await mailService.sendVerificationEmail(
      newUser.email,
      newUser.token.token,
    );

    // パスワードを除外したユーザー情報を返す
    const { password: _, verificationToken: __, ...userWithoutPassword } = newUser;

    return userWithoutPassword;
  }

}

export default new RegisterService();

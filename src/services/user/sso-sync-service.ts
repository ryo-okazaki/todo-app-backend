import userRepository from "../../repositories/user-repository";

class SsoSyncService
{
  async handle(request) {
    console.log("syncing sso user", request.user);
    const { sub, email, name, authType } = request.user;

    if (authType !== 'keycloak') {
      return { error: 'Keycloakトークンが必要です' };
    }

    // 1. sso_user_idで検索
    let user = await userRepository.findUserBySub(sub);

    if (user) {
      // 既に紐付け済み
      return {
        user: user,
        message: 'ログインしました',
      };
    }

    // 2. emailで既存のToDoアプリユーザーを検索
    user = await userRepository.findUserByEmail(email); // auth_typeでも検索する

    if (user) {
      // ★既存ユーザーが見つかった → 紐付け
      const existingUser = user;

      await userRepository.linkSsoToUser(existingUser.id, sub);

      // 監査ログ
      // await userRepository.createAuditLog({
      //   userId: existingUser.id,
      //   action: 'sso_link',
      //   description: `KeycloakユーザーID ${keycloakUserId} と連携`,
      // });

      const updatedUser = await userRepository.findUserById(existingUser.id);

      return {
        user: updatedUser,
        message: '既存のToDoアプリアカウントと連携しました',
      };
    }

    // 3. 新規ユーザー作成
    const newUser = await userRepository.createUserWithSso({
      email,
      name,
      sub,
      authType: 'keycloak',
    });

    return {
      user: newUser,
      message: '新規アカウントを作成しました',
    };

  }

}

export default new SsoSyncService();

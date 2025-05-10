import userRepository from "../../repositories/user-repository";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

class LoginService
{
  async handle(request) {
    console.log("logging in user");
    console.log(`request.body: ${request.email}`);

    const user = await userRepository.findUserByEmail(request.email);
    console.log('user', user);

    const isPasswordValid = await bcrypt.compare(request.password, user.password);
    if (!isPasswordValid) {
      throw new Error("パスワードが無効です");
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email
      },
      process.env.JWT_SECRET || "fallback_secret",
      { expiresIn: "24h" }
    );


    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    };

  }

}

export default new LoginService();

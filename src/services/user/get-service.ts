import userRepository from "../../repositories/user-repository";


class GetUserService
{
  async handle(request) {
    console.log("Getting user");

    const user = await userRepository.findUserByToken(request.token);

    const { password, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }
}

export default new GetUserService();

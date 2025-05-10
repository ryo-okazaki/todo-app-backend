import userRepository from "../../repositories/user-repository";


class GetUserService
{
  async handle(request) {
    console.log("Getting todos");

    return await userRepository.findUserByToken(request.token);
  }
}

export default new GetUserService();

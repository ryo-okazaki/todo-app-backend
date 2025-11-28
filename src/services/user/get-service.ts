import userRepository from "../../repositories/user-repository";


class GetUserService
{
  async handle(request) {
    console.log("Getting user");

    return request.user;
  }
}

export default new GetUserService();

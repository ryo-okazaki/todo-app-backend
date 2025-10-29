import loginService from "../services/user/login-service";
import getService from "../services/user/get-service";
import registerService from "../services/user/register-service";
import verifyTokenService from "../services/user/verify-token-service";
import resetPasswordRequestService from "../services/user/reset-password-request-service";
import resetPasswordConfirmService from "../services/user/reset-password-confirm-service";


class userController {
  async login(req, res) {
    console.log('user controller()');
    try {
      const result = await loginService.handle(req.body);
      console.log('result:', result);
      return res.json(result);
    } catch (error) {
      console.error(error);
      return res.status(400).json({ error: error.message });
    }
  }

  async register(req, res) {
    console.log('user controller()');
    try {
      const result = await registerService.handle(req.body);
      console.log('result:', result);
      return res.json(result);
    } catch (error) {
      console.error(error);
      return res.status(400).json({ error: error.message });
    }
  }

  async get(req, res) {
    console.log('user controller()');
    try {
      const result = await getService.handle(req.params);
      console.log('result:', result);
      return res.json(result);
    } catch (error) {
      console.error(error);
      return res.status(400).json({ error: error.message });
    }
  }

  async resetPasswordRequest(req, res) {
    console.log('user controller()');
    try {
      const result = await resetPasswordRequestService.handle(req.body);
      console.log('result:', result);
      return res.json(result);
    } catch (error) {
      console.error(error);
      return res.status(400).json({ error: error.message });
    }
  }

  async resetPasswordConfirm(req, res) {
    console.log('user controller()');
    try {
      const result = await resetPasswordConfirmService.handle(req.body);
      console.log('result:', result);
      return res.json(result);
    } catch (error) {
      console.error(error);
      return res.status(400).json({ error: error.message });
    }
  }

  async verifyToken(req, res) {
    console.log('user controller()');
    try {
      const result = await verifyTokenService.handle(req.params);
      console.log('result:', result);
      return res.json(result);
    } catch (error) {
      console.error(error);
      return res.status(400).json({ error: error.message });
    }
  }
}

export default new userController();

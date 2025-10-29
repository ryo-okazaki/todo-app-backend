import { Router } from 'express';
import todoController from "../controllers/todo-controller";
import userController from "../controllers/user-controller";
import { authenticateToken } from '../middleware/auth-middleware';
import { uploadMultiple } from '../middleware/upload-middleware';

const apiRoutes = Router();
const todoRoutes = Router();
const userRoutes = Router();

todoRoutes.get('', authenticateToken, todoController.getTodos);
todoRoutes.get('/:id', authenticateToken, todoController.getTodos);
todoRoutes.post('', authenticateToken, todoController.createTodo);
todoRoutes.put('/:id', authenticateToken, uploadMultiple, todoController.updateTodo);
// todoRoutes.delete('', todoController.deleteTodo);

userRoutes.post('/login', userController.login);
userRoutes.post('/register', userController.register);
userRoutes.post('/reset_password/request', userController.resetPasswordRequest);
userRoutes.post('/reset_password/confirm', userController.resetPasswordConfirm);
userRoutes.post('/verify/:token', userController.verifyToken);
userRoutes.get('', authenticateToken, userController.get);

apiRoutes.use('/todo', todoRoutes);
apiRoutes.use('/user', userRoutes);

export default apiRoutes;

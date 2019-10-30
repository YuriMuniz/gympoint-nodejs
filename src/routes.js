import { Router } from 'express';
import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import authMiddleware from './app/middlewares/auth';

const routes = new Router();

// Rota para autenticação
routes.post('/sessions', SessionController.store);

// Middleware global usada para todas rotas abaixo dela precisar estar autenticado
routes.use(authMiddleware);

// Rota para novo estudante
routes.post('/students', StudentController.store);

// Rota alterar estudante
routes.put('/students', StudentController.update);

export default routes;

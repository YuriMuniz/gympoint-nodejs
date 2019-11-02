import { Router } from 'express';
import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import authMiddleware from './app/middlewares/auth';
import PlanController from './app/controllers/PlanController';
import RegistrationController from './app/controllers/RegistrationController';
import CheckinController from './app/controllers/CheckinController';
import StudentHelpOrdersController from './app/controllers/StudentHelpOrdersController';
import GymHelpOrdersController from './app/controllers/GymHelpOrdersController';

const routes = new Router();

// Rota para autenticação
routes.post('/sessions', SessionController.store);

// Middleware global usada para todas rotas abaixo dela precisar estar autenticado
routes.use(authMiddleware);

// Rotas estudantes
routes.post('/students', StudentController.store);
routes.put('/students', StudentController.update);

// Rotas planos
routes.post('/plans', PlanController.store);
routes.get('/plans', PlanController.index);
routes.put('/plans', PlanController.update);
routes.delete('/plans/:id', PlanController.delete);

// Rotas matriculas
routes.post('/registrations', RegistrationController.store);
routes.put('/registrations', RegistrationController.update);
routes.get('/registrations', RegistrationController.index);
routes.delete('/registrations/:id', RegistrationController.delete);

// Rotas checkins
routes.post('/students/:id/checkins', CheckinController.store);
routes.get('/students/:id/checkins', CheckinController.index);

// Rota ajuda estudante
routes.post('/students/:id/help-orders', StudentHelpOrdersController.store);
routes.get('/students/:id/help-orders', StudentHelpOrdersController.index);

// Rota ajuda academia
routes.post('/help-orders/:id/answer', GymHelpOrdersController.store);
routes.get('/help-orders/:id/answer', GymHelpOrdersController.index);

export default routes;

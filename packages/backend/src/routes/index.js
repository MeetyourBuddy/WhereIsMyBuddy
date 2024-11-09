import express from 'express';
import homeRoute from './home-route.js';
import authRoute from './auth-route.js';
// import protectedRoute from './protected.js';
import bodyParser from 'body-parser';

const router = express.Router();

router.use(bodyParser.json());

const defaultRoutes = [
  {
    path: '/',
    route: homeRoute
  },
  {
    path: '/test',
    route: homeRoute
  },
  {
    path: '/auth',
    route: authRoute
  }
  // {
  //   path: '/protected',
  //   route: protectedRoute
  // }
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;

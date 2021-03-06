import { authController } from './controllers/authController.mjs';
import { loginController } from './controllers/loginController.mjs';
import { loginPageController } from './controllers/loginPageController.mjs';

const initLoginPage = () => {
  authController.init();
  loginPageController.init();
};

window.addEventListener('DOMContentLoaded', initLoginPage);

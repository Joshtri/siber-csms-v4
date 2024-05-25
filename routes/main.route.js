import express from 'express';
const router = express.Router();
import mainController from '../controllers/main.controller.js';
import { uploadMultiplePDF } from '../config/multer.js';
import { postFormHSEPlan } from '../controllers/hse.controller.js';
import  {createPINPage, CreatingPIN, loginUser} from '../controllers/divisi.controller.js';


router.get('/', mainController.mainPage);
router.get('/login_pertamina', mainController.loginPage);
router.get('/form_mitra', mainController.formMitraPage);


router.post('/postHSEPlan',uploadMultiplePDF ,postFormHSEPlan);


router.get('/create_user', createPINPage);
router.post('/api/create_user', CreatingPIN);

router.post('/post_loginUser', loginUser);
export default router;

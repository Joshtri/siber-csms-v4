import express from 'express';
const router = express.Router();
import mainController from '../controllers/main.controller.js';
import { uploadSinglePDF } from '../config/multer.js';
import { postFormHSEPlan } from '../controllers/hseplan.controller.js';
import  {createPINPage, CreatingPIN, loginUser} from '../controllers/divisi.controller.js';
import { postFormPSB } from '../controllers/psb.controller.js';
import { postFormPA } from '../controllers/pa.controller.js';
import { postFormPB } from "../controllers/pb.controller.js";



router.get('/', mainController.mainPage);
router.get('/login_pertamina', mainController.loginPage);
router.get('/form_mitra', mainController.formMitraPage);


//MITRA POST Data BERKAS.
router.post('/postHSEPlan',uploadSinglePDF ,postFormHSEPlan);
router.post('/postPSB', uploadSinglePDF, postFormPSB);
router.post('/postPA',uploadSinglePDF ,postFormPA);
router.post('/postPB',uploadSinglePDF ,postFormPB);

router.get('/create_user', createPINPage);
router.post('/api/create_user', CreatingPIN);

router.post('/post_loginUser', loginUser);
export default router;

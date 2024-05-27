import express from 'express';
const router = express.Router();
import { detailHSEData, editHSEData, postEditHSEData, readHSEData } from '../controllers/hseplan.controller.js';


router.get('/hseplan_data', readHSEData);

router.get('/detail_hse/:id', detailHSEData);
router.get('/update_hse/:id', editHSEData);
router.post('/post_hseplan/:id', postEditHSEData);
export default router;

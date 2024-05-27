import express from "express";
import { detailPAData, editPAData, postEditPAData, readPAData } from "../controllers/pa.controller.js";
const router = express.Router();



router.get('/pa_data',readPAData);
// router.post)

router.get('/detail_pa/:id', detailPAData);
router.get('/update_pa/:id', editPAData);

router.post('/postEdit_pa/:id', postEditPAData);
export default router;
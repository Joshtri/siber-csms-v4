import express from "express";
import { detailPSBData, editPSBData, readPSBData, postEditPsbData } from "../controllers/psb.controller.js";
const router = express.Router();



router.get('/psb_data',readPSBData);
// router.post)

router.get('/detail_psb/:id', detailPSBData);

router.get('/update_psb/:id', editPSBData);
router.post('/post_psb/:id', postEditPsbData);
export default router;
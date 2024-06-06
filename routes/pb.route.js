import express from "express";
import { detailPBData, editPBData, postEditPBData, readPBData } from "../controllers/pb.controller.js";
const router = express.Router();



router.get('/pb_data',readPBData);
// router.post) 

router.get('/detail_pb/:id', detailPBData);
router.get('/update_pb/:id', editPBData);

router.post('/postEdit_pb/:id', postEditPBData);
export default router;
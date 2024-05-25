import express from 'express';
const router = express.Router();

import protect from "../config/protect.js";


import { dashboardPage } from '../controllers/dashboard.controller.js';



router.get('/dashboard_divisi', protect, dashboardPage);


export default router;

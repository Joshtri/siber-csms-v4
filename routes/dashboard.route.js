import express from 'express';
const router = express.Router();

import protect from "../config/protect.js";


import { dashboardPage } from '../controllers/dashboard.controller.js';



router.get('/dashboard_divisi', protect, dashboardPage);


// Route untuk logout
router.get('/logout', (req, res) => {
    // Hapus sesi pengguna
    req.session.destroy((err) => {
        if (err) {
            console.error("Error saat menghapus sesi:", err);
        } else {
            console.log("Sesi pengguna berhasil dihapus.");
        }
        // Redirect ke halaman login setelah logout
        res.redirect('/');
    });
});
export default router;

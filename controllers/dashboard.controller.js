


export const dashboardPage = async (req, res) => {
    try {
        // Pastikan divisi_user sudah ada di dalam session sebelum mencoba mengaksesnya
        const divisi_user = req.session.divisi_user; 

        // Jika divisi_user sudah tersedia, lanjutkan dengan render halaman dashboard
        const title = "Dashboard Divisi";
        res.render('dashboardDivisi', {
            title,
            divisi_user
        });
    } catch (error) {
        console.error("Error rendering dashboard:", error);
        res.status(500).send("Internal Server Error");
    }
};

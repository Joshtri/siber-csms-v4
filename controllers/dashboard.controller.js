
import HSEplan from '../models/hsePlan.model.js';
import PSB from '../models/psb.model.js';
import PA from '../models/pa.model.js';
import PB from '../models/pb.model.js';


export const dashboardPage = async (req, res) => {
    try {
        // Pastikan divisi_user sudah ada di dalam session sebelum mencoba mengaksesnya
        const divisi_user = req.session.divisi_user; 


        const totalHSEPLAN = await HSEplan.countDocuments();
        const totalPSB = await PSB.countDocuments();
        const totalPA = await PA.countDocuments();
        const totalPB = await PB.countDocuments();

        // Jika divisi_user sudah tersedia, lanjutkan dengan render halaman dashboard
        const title = "Dashboard Divisi";
        res.render('dashboardDivisi', {
            title,
            divisi_user,
            totalHSEPLAN,
            totalPSB,
            totalPA,
            totalPB
        });
        

        // console.log(totalHSEPLAN);
    } catch (error) {
        console.error("Error rendering dashboard:", error);
        res.status(500).send("Internal Server Error");
    }
};

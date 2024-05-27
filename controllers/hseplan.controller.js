import { getStorage, ref, list, deleteObject ,uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../config/firebaseConfig.js'; // Sesuaikan dengan path modul Anda

const storageFB = getStorage();
import  HSEPlan from'../models/hsePlan.model.js';

// Fungsi untuk mengunggah file PDF ke Firebase Storage dan menyimpan data teks ke MongoDB
async function uploadMultiplePDF(files, HSEplanData) {
    try {
        // Sign in ke Firebase jika belum
        // eslint-disable-next-line no-undef
        await signInWithEmailAndPassword(auth, process.env.FIREBASE_USER, process.env.FIREBASE_AUTH);

        // Mendapatkan timestamp untuk nama file unik
        const dateTime = Date.now();

        // Membuat array untuk menyimpan nama file hasil upload
        const uploadedFileNames = [];

        // Loop melalui setiap file dan mengunggah ke Firebase Storage
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const fileName = `pdf/${dateTime}_${i + 1}`;
            const storageRef = ref(getStorage(), fileName);
            const metadata = {
                contentType: file.mimetype,
            };
            await uploadBytesResumable(storageRef, file.buffer, metadata);
            uploadedFileNames.push(fileName);
        }

        // Menyimpan data HSEPlan ke MongoDB dengan path file yang diunggah
        const newHSEPlan = new HSEPlan({
            risk_assessment_id: HSEplanData.risk_assessment_id,
            risk_level: HSEplanData.risk_level,
            nama_pekerjaan: HSEplanData.nama_pekerjaan,
            nama_mitra: HSEplanData.nama_mitra,
            tanggal_audit: HSEplanData.tanggal_audit,
            lokasi_kerja: HSEplanData.lokasi_kerja,
            no_hp: HSEplanData.no_hp,
            alamat_email: HSEplanData.alamat_email,
            file1: uploadedFileNames[0],
            file2: uploadedFileNames[1],
            file3: uploadedFileNames[2],
            file4: uploadedFileNames[3],
            file5: uploadedFileNames[4],
            file6: uploadedFileNames[5],
            file7: uploadedFileNames[6],
            file8: uploadedFileNames[7],
            status_mitra: 'Belum Diproses', // Atau sesuai dengan kebutuhan Anda
        });

        // Menyimpan data HSEPlan ke MongoDB
        await newHSEPlan.save();

        return uploadedFileNames;
    } catch (error) {
        console.error(error); // Mencetak kesalahan ke konsol
        throw error;
    }
}


export const postFormHSEPlan = async (req, res) => {
    try {
        // Validasi apakah semua properti yang diperlukan telah disertakan dalam request body
        const requiredFields = ['risk_assessment_id', 'risk_level', 'nama_pekerjaan', 'nama_mitra', 'tanggal_audit', 'lokasi_kerja', 'no_hp', 'alamat_email'];
        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).send(`Field '${field}' is required`);
            }
        }

        const hsePlanData = {
            risk_assessment_id: req.body.risk_assessment_id,
            risk_level: req.body.risk_level,
            nama_pekerjaan: req.body.nama_pekerjaan,
            nama_mitra: req.body.nama_mitra,
            tanggal_audit: req.body.tanggal_audit,
            lokasi_kerja: req.body.lokasi_kerja,
            no_hp: req.body.no_hp,
            alamat_email: req.body.alamat_email,
            fungsi_dituju1: req.body.fungsi_dituju1,
        };

        // Memanggil fungsi untuk mengunggah file PDF dan menyimpan data HSEPlan
        const uploadedFileNames = await uploadMultiplePDF(req.files, hsePlanData);
        await req.flash('successUpHse', 'Kelengkapan Berkas HSE PLAN berhasil di upload');

        // Redirect atau berikan respons sesuai kebutuhan Anda
        res.redirect('/'); // Ganti rute ini sesuai dengan kebutuhan Anda
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};



export const readHSEData = async (req, res) => {
    try {
        const userRole = req.session.divisi_user ? req.session.divisi_user.divisi_name : null;
        let title = "HSE PLAN Data";
        // Hanya menampilkan data jika peran pengguna adalah 'HSSE'
        if (userRole === 'HSSE') {
            const hseData = await HSEPlan.find();


            //mendapatkan pesan flash utkHSE
            const messageSuccessVerify = await req.flash('successVerifyHse');

            res.render('hseplan.data.ejs', {
                dataHse: hseData,
                title,
                messageSuccessVerify
            });
        } else {
            // Jika peran pengguna bukan 'HSSE', kembalikan ke halaman login
            return res.redirect('/login_pertamina');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};


export const detailHSEData = async (req, res) => {
    try {
        const userRole = req.session.divisi_user ? req.session.divisi_user.divisi_name : null;
        let title = "HSE PLAN - Detail Data";
        // Hanya menampilkan data jika peran pengguna adalah 'HSSE'
        if (userRole === 'HSSE') {
            // Ambil ID data dari parameter URL
            const hseId = req.params.id;

            // Cari data HSE berdasarkan ID
            const hseData = await HSEPlan.findById(hseId);

            if (!hseData) {
                return res.status(404).send('Data not found');
            }

            // Mendapatkan URL unduhan untuk setiap file dari Firebase Storage
            const fileURLs = await Promise.all([
                getDownloadURL(ref(storageFB, hseData.file1)),
                getDownloadURL(ref(storageFB, hseData.file2)),
                getDownloadURL(ref(storageFB, hseData.file3)),
                getDownloadURL(ref(storageFB, hseData.file4)),
                getDownloadURL(ref(storageFB, hseData.file5)),
                getDownloadURL(ref(storageFB, hseData.file6)),
                getDownloadURL(ref(storageFB, hseData.file7)),
                getDownloadURL(ref(storageFB, hseData.file8))
                // Lanjutkan untuk file lainnya...
            ]);

            res.render('hseplan.detail.ejs', {
                dataHse: hseData,
                title,
                fileURLs,
            });
        } else {
            // Jika peran pengguna bukan 'HSSE', kembalikan ke halaman login
            return res.redirect('/login_pertamina');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};


//GET DATA ONLY FOR EDIT
export const editHSEData = async (req, res) => {
    try {
        const userRole = req.session.divisi_user ? req.session.divisi_user.divisi_name : null;
        let title = "HSE PLAN - Detail Data";
        // Hanya menampilkan data jika peran pengguna adalah 'HSSE'
        if (userRole === 'HSSE') {
            // Ambil ID data dari parameter URL
            const hseId = req.params.id;

            // Cari data HSE berdasarkan ID
            const hseData = await HSEPlan.findById(hseId);

            if (!hseData) {
                return res.status(404).send('Data not found');
            }

            // Mendapatkan URL unduhan untuk setiap file dari Firebase Storage
            const fileURLs = await Promise.all([
                getDownloadURL(ref(storageFB, hseData.file1)),
                getDownloadURL(ref(storageFB, hseData.file2)),
                getDownloadURL(ref(storageFB, hseData.file3)),
                getDownloadURL(ref(storageFB, hseData.file4)),
                getDownloadURL(ref(storageFB, hseData.file5)),
                getDownloadURL(ref(storageFB, hseData.file6)),
                getDownloadURL(ref(storageFB, hseData.file7)),
                getDownloadURL(ref(storageFB, hseData.file8))
                // Lanjutkan untuk file lainnya...
            ]);

            res.render('hseplan.edit.ejs', {
                dataHse: hseData,
                title,
                fileURLs,
            });
        } else {
            // Jika peran pengguna bukan 'HSSE', kembalikan ke halaman login
            return res.redirect('/login_pertamina');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};


export const postEditHSEData = async (req, res) => {
    try {
        const userRole = req.session.divisi_user ? req.session.divisi_user.divisi_name : null;
        if (userRole === 'HSSE') {
            const hseId = req.params.id;
            const { status_mitra, nilai_total, keterangan_verifikasi } = req.body;
            
            const hseData = await HSEPlan.findByIdAndUpdate(hseId, {
                status_mitra,
                nilai_total,
                keterangan_verifikasi
            }, { new: true });

            if (!hseData) {
                return res.status(404).send('Data not found');
            }
            await req.flash('successVerifyHse', 'Proses Verifikasi Kelengkapan Berkas HSE PLAN berhasil!');

            res.redirect(`/data/hseplan_data`);
        } else {
            return res.redirect('/login_pertamina');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

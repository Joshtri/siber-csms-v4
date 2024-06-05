import { getStorage, ref, list, deleteObject ,uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../config/firebaseConfig.js'; // Sesuaikan dengan path modul Anda

const storageFB = getStorage();

import PSB from'../models/psb.model.js';


// Fungsi untuk mengunggah file PDF ke Firebase Storage dan menyimpan data teks ke MongoDB
async function uploadMultiplePDF(files, PSBData) {
    try {
        // Sign in ke Firebase jika belum
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

        // Menyimpan data PSB ke MongoDB dengan path file yang diunggah
        const newPSB = new PSB({
            risk_assessment_id: PSBData.risk_assessment_id,
            risk_level: PSBData.risk_level,
            nomor_kontrak: PSBData.nomor_kontrak,
            nama_pekerjaan: PSBData.nama_pekerjaan,
            nama_kontraktor: PSBData.nama_kontraktor,
            // nama_mitra: PSBData.nama_mitra,
            tanggal_penilaian: PSBData.tanggal_penilaian,
            // lokasi_kerja: HSEplanData.lokasi_kerja,
            no_hp: PSBData.no_hp,
            fungsi_dituju2: PSBData.fungsi_dituju2,
            alamat_email: PSBData.alamat_email,
            file1: uploadedFileNames[0],
            // file2: uploadedFileNames[1],
            // file3: uploadedFileNames[2],
            // file4: uploadedFileNames[3],
            // file5: uploadedFileNames[4],
            // file6: uploadedFileNames[5],
            // file7: uploadedFileNames[6], 
            // file8: uploadedFileNames[7],
            
            status_mitra: 'Belum Diproses', // Atau sesuai dengan kebutuhan Anda
        });

        // Menyimpan data HSEPlan ke MongoDB
        await newPSB.save();

        return uploadedFileNames;
    } catch (error) {
        console.error(error); // Mencetak kesalahan ke konsol
        throw error;
    }
}


export const postFormPSB = async (req, res) => {
    try {
        // Validasi apakah semua properti yang diperlukan telah disertakan dalam request body
        const requiredFields = ['risk_assessment_id', 'risk_level', 'nomor_kontrak', 'nama_pekerjaan', 'nama_kontraktor','tanggal_penilaian', 'no_hp', 'alamat_email', 'fungsi_dituju2'];
        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).send(`Field '${field}' is required`);
            }
        }

        const PSBData = {
            risk_assessment_id: req.body.risk_assessment_id,
            risk_level: req.body.risk_level,
            nomor_kontrak: req.body.nomor_kontrak,
            nama_pekerjaan: req.body.nama_pekerjaan,
            nama_kontraktor : req.body.nama_kontraktor,
            tanggal_penilaian: req.body.tanggal_penilaian,
            no_hp: req.body.no_hp,
            alamat_email: req.body.alamat_email,
            // lokasi_kerja: req.body.lokasi_kerja,
            fungsi_dituju2: req.body.fungsi_dituju2,
        };

        // Memanggil fungsi untuk mengunggah file PDF dan menyimpan data HSEPlan
        const uploadedFileNames = await uploadMultiplePDF(req.files, PSBData);
        await req.flash('successUpPsb', 'Kelengkapan Berkas PSB berhasil di upload');
        // Redirect atau berikan respons sesuai kebutuhan Anda
        res.redirect('/form_mitra');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};



export const readPSBData = async (req, res) => {
    try {
        const divisi_user = req.session.divisi_user; 
        // Periksa peran pengguna yang masuk
        const userRole = req.session.divisi_user ? req.session.divisi_user.divisi_name : null;
        const messageSuccessVerify = await req.flash('successVerifyPsb');
        let title = "PSB Data";
        if (!req.session.divisi_user || !req.session.divisi_user.divisi_name) {
            // Jika pengguna belum login, redirect ke halaman login
            return res.redirect('/login_pertamina');
        }



        const roleMapping = {
            'HSSE': {},
            'ICT': { fungsi_dituju2: 'ICT' },
            'WIWS': { fungsi_dituju2: 'WIWS' },
            'PE': { fungsi_dituju2: 'PE' },
            'RAM': { fungsi_dituju2: 'RAM' },
            'PRODUKSI': { fungsi_dituju2: 'PRODUKSI' },
            'SCM': { fungsi_dituju2: 'SCM' }
        };

        if (userRole in roleMapping) {
            const query = roleMapping[userRole];
            const readResults = await PSB.find(query);

            res.render('psb.data.ejs', {
                dataPSB: readResults,
                title,
                messageSuccessVerify,
                divisi_user
            });
        } else {
            // Tampilkan pesan atau lakukan sesuatu jika pengguna tidak memiliki peran yang sesuai
            res.status(403).send('Access Forbidden'); // Atau ganti dengan tindakan lain yang sesuai
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

export const detailPSBData = async (req, res) => {
    try {
        const divisi_user = req.session.divisi_user; 
        const userRole = req.session.divisi_user ? req.session.divisi_user.divisi_name : null;
        const psbId = req.params.id;

        // Cari data PSB berdasarkan ID
        const psbData = await PSB.findById(psbId);

        if (!psbData) {
            return res.status(404).send('Data not found');
        }

        // Periksa apakah pengguna memiliki akses ke data tersebut
        if (userRole === 'HSSE' || userRole === psbData.fungsi_dituju2) {
            // Mendapatkan URL unduhan untuk setiap file dari Firebase Storage
            const fileURLs = await Promise.all([
                getDownloadURL(ref(storageFB, psbData.file1)),
                // getDownloadURL(ref(storageFB, psbData.file2)),
                // getDownloadURL(ref(storageFB, psbData.file3)),
                // getDownloadURL(ref(storageFB, psbData.file4)),
                // getDownloadURL(ref(storageFB, psbData.file5)),
                // getDownloadURL(ref(storageFB, psbData.file6)),
                // getDownloadURL(ref(storageFB, psbData.file7)),
                // getDownloadURL(ref(storageFB, psbData.file8))
                // Lanjutkan untuk file lainnya...
            ]);

            return res.render('psb.detail.ejs', {
                dataPSB: psbData,
                title: "PSB Detail Data",
                fileURLs,
                divisi_user
            });
        } else {
            // Jika pengguna tidak memiliki akses, kembalikan ke halaman login
            return res.redirect('/login_pertamina');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};


export const editPSBData = async (req, res) => {
    try {
        const userRole = req.session.divisi_user ? req.session.divisi_user.divisi_name : null;
        const divisi_user = req.session.divisi_user; 
        const psbId = req.params.id;

        // Cari data PSB berdasarkan ID
        const psbData = await PSB.findById(psbId);

        if (!psbData) {
            return res.status(404).send('Data not found');
        }

        // Periksa apakah pengguna memiliki akses ke data tersebut
        if (userRole === 'HSSE' || userRole === psbData.fungsi_dituju2) {
            // Mendapatkan URL unduhan untuk setiap file dari Firebase Storage
            const fileURLs = await Promise.all([
                getDownloadURL(ref(storageFB, psbData.file1)),

                // Lanjutkan untuk file lainnya...
            ]);

            res.render('psb.edit.ejs', {
                dataPSB: psbData,
                title: "PSB Edit Data",
                fileURLs,
                divisi_user
            });
        } else {
            // Jika pengguna tidak memiliki akses, kembalikan ke halaman login
            return res.redirect('/login_pertamina');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};


export const postEditPsbData = async (req, res) => {
    try {
        const divisi_user = req.session.divisi_user; 
        const userRole = req.session.divisi_user ? req.session.divisi_user.divisi_name : null;
        if (userRole === 'HSSE' || userRole === (await PSB.findById(req.params.id)).fungsi_dituju2) {
            const psbId = req.params.id;
            const { status_mitra, status_mitra2, nilai_total, keterangan_verifikasi } = req.body;

            const psbData = await PSB.findByIdAndUpdate(psbId, {
                status_mitra,
                status_mitra2,
                nilai_total,
                keterangan_verifikasi,
                divisi_user
            }, { new: true });

            if (!psbData) {
                return res.status(404).send('Data not found');
            }

            res.redirect(`/data/psb_data`);
        } else {
            return res.redirect('/login_pertamina');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

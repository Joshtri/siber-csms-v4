import { getStorage, ref, list, deleteObject ,uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../config/firebaseConfig.js'; // Sesuaikan dengan path modul Anda
import PA from '../models/pa.model.js';

const storageFB = getStorage();

// Function to upload multiple PDFs to Firebase Storage and save text data to MongoDB
async function uploadMultiplePDF(files, PAData) {
    try {
        // Sign in to Firebase
        await signInWithEmailAndPassword(auth, process.env.FIREBASE_USER, process.env.FIREBASE_AUTH);

        // Get timestamp for unique filenames
        const dateTime = Date.now();

        // Array to store the names of uploaded files
        const uploadedFileNames = [];

        // Loop through each file and upload to Firebase Storage
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

        // Save PA data to MongoDB with the paths of the uploaded files
        const newPA = new PA({
            risk_assessment_id: PAData.risk_assessment_id,
            risk_level: PAData.risk_level,
            nama_pekerjaan: PAData.nama_pekerjaan,
            nomor_kontrak: PAData.nomor_kontrak,
            temuan: PAData.temuan,
            tanggal_penilaian: PAData.tanggal_penilaian,
            no_hp: PAData.no_hp,
            alamat_email: PAData.alamat_email,
            fungsi_dituju2: PAData.fungsi_dituju2,
            file1: uploadedFileNames[0],
            file2: uploadedFileNames[1],
            file3: uploadedFileNames[2],
            file4: uploadedFileNames[3],
            file5: uploadedFileNames[4],
            file6: uploadedFileNames[5],
            file7: uploadedFileNames[6],
            file8: uploadedFileNames[7],
            // status_mitra: 'Belum Diproses', // Or as per your needs
        });

        // Save PA data to MongoDB
        await newPA.save();

        return uploadedFileNames;
    } catch (error) {
        console.error('Error uploading files and saving PA data:', error);
        throw error;
    }
}

export const postFormPA = async (req, res) => {
    try {
        // Validate required fields in the request body
        const requiredFields = ['risk_assessment_id', 'risk_level', 'nomor_kontrak', 'nama_pekerjaan', 'tanggal_penilaian', 'temuan', 'no_hp', 'alamat_email', 'fungsi_dituju2'];
        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).send(`Field '${field}' is required`);
            }
        }

        const PAData = {
            risk_assessment_id: req.body.risk_assessment_id,
            risk_level: req.body.risk_level,
            nomor_kontrak: req.body.nomor_kontrak,
            nama_pekerjaan: req.body.nama_pekerjaan,
            temuan: req.body.temuan,
            tanggal_penilaian: req.body.tanggal_penilaian,
            no_hp: req.body.no_hp,
            alamat_email: req.body.alamat_email,
            fungsi_dituju2: req.body.fungsi_dituju2,
        };

        // Call the function to upload PDFs and save PA data
        const uploadedFileNames = await uploadMultiplePDF(req.files, PAData);
        await req.flash('successUpPa', 'Kelengkapan Berkas PA berhasil di upload');

        // Redirect or send a response as per your needs
        res.redirect('/'); // Change this route as per your needs
    } catch (error) {
        console.error('Error processing form submission:', error);
        res.status(500).send('Internal Server Error');
    }
};


export const readPAData = async (req, res) => {
    try {
        // Periksa peran pengguna yang masuk
        const userRole = req.session.divisi_user ? req.session.divisi_user.divisi_name : null;
        let title = "PA Data";
        if (!req.session.divisi_user || !req.session.divisi_user.divisi_name) {
            // Jika pengguna belum login, redirect ke halaman login
            return res.redirect('/login_pertamina');
        }
        const messageSuccessVerify = await req.flash('successVerifyPa');


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
            const readResults = await PA.find(query);

            res.render('pa.data.ejs', {
                dataPA: readResults,
                title,
                messageSuccessVerify
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



export const detailPAData = async (req, res) => {
    try {
        const userRole = req.session.divisi_user ? req.session.divisi_user.divisi_name : null;
        const paId = req.params.id;

        // Cari data PSB berdasarkan ID
        const paData = await PA.findById(paId);

        if (!paData) {
            return res.status(404).send('Data not found');
        }

        // Periksa apakah pengguna memiliki akses ke data tersebut
        if (userRole === 'HSSE' || userRole === paData.fungsi_dituju2) {
            // Mendapatkan URL unduhan untuk setiap file dari Firebase Storage
            const fileURLs = await Promise.all([
                getDownloadURL(ref(storageFB, paData.file1)),
                getDownloadURL(ref(storageFB, paData.file2)),
                getDownloadURL(ref(storageFB, paData.file3)),
                getDownloadURL(ref(storageFB, paData.file4)),
                getDownloadURL(ref(storageFB, paData.file5)),
                getDownloadURL(ref(storageFB, paData.file6)),
                getDownloadURL(ref(storageFB, paData.file7)),
                getDownloadURL(ref(storageFB, paData.file8))
                // Lanjutkan untuk file lainnya...
            ]);

            res.render('pa.detail.ejs', {
                dataPA: paData,
                title: "PA Detail Data",
                fileURLs,
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

export const editPAData = async (req, res) => {
    try {
        const userRole = req.session.divisi_user ? req.session.divisi_user.divisi_name : null;
        const divisi_user = req.session.divisi_user; 
        const paId = req.params.id;

        // Cari data PSB berdasarkan ID
        const paData = await PA.findById(paId);

        if (!paData) {
            return res.status(404).send('Data not found');
        }

        // Periksa apakah pengguna memiliki akses ke data tersebut
        if (userRole === 'HSSE' || userRole === paData.fungsi_dituju2) {
            // Mendapatkan URL unduhan untuk setiap file dari Firebase Storage
            const fileURLs = await Promise.all([
                getDownloadURL(ref(storageFB, paData.file1)),
                getDownloadURL(ref(storageFB, paData.file2)),
                getDownloadURL(ref(storageFB, paData.file3)),
                getDownloadURL(ref(storageFB, paData.file4)),
                getDownloadURL(ref(storageFB, paData.file5)),
                getDownloadURL(ref(storageFB, paData.file6)),
                getDownloadURL(ref(storageFB, paData.file7)),
                getDownloadURL(ref(storageFB, paData.file8))
                // Lanjutkan untuk file lainnya...
            ]);

            res.render('pa.edit.ejs', {
                dataPA: paData,
                title: "PA Edit Data",
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

export const postEditPAData = async (req, res) => {
    try {
        const userRole = req.session.divisi_user ? req.session.divisi_user.divisi_name : null;
        if (userRole === 'HSSE' || userRole === (await PA.findById(req.params.id)).fungsi_dituju2) {
            const paId = req.params.id;
            const { status_mitra, status_mitra2, nilai_total, keterangan_verifikasi } = req.body;

            const paData = await PA.findByIdAndUpdate(paId, {
                status_mitra,
                status_mitra2,
                nilai_total,
                keterangan_verifikasi
            }, { new: true });

            if (!paData) {
                return res.status(404).send('Data not found');
            }

            res.redirect(`/data/pa_data`);
        } else {
            return res.redirect('/login_pertamina');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};

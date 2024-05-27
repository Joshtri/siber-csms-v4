import { getStorage, ref, list, deleteObject ,uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../config/firebaseConfig.js'; // Sesuaikan dengan path modul Anda
import PB from '../models/pb.model.js';

const storageFB = getStorage();


// Function to upload multiple PDFs to Firebase Storage and save text data to MongoDB
async function uploadMultiplePDF(files, PBData) {
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

        // Save PB data to MongoDB with the paths of the uploaded files
        const newPB = new PB({
            risk_assessment_id: PBData.risk_assessment_id,
            risk_level: PBData.risk_level,
            nomor_kontrak: PBData.nomor_kontrak,
            nama_kontraktor: PBData.nama_kontraktor,
            tanggal_penilaian: PBData.tanggal_penilaian,
            temuan: PBData.temuan,
            kategori_pb:PBData.kategori_pb,
            no_hp: PBData.no_hp,
            alamat_email: PBData.alamat_email,
            fungsi_dituju2: PBData.fungsi_dituju2,
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
        await newPB.save();

        return uploadedFileNames;
    } catch (error) {
        console.error('Error uploading files and saving PB data:', error);
        throw error;
    }
}


export const postFormPB = async (req, res) => {
    try {
        // Validate required fields in the request body
        const requiredFields = ['risk_assessment_id', 'risk_level', 'nomor_kontrak', 'nama_kontraktor', 'kategori_pb', 'tanggal_penilaian', 'temuan', 'no_hp', 'alamat_email', 'fungsi_dituju2'];
        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).send(`Field '${field}' is required`);
            }
        }

        const PBData = {
            risk_assessment_id: req.body.risk_assessment_id,
            risk_level: req.body.risk_level,
            nomor_kontrak: req.body.nomor_kontrak,
            nama_kontraktor: req.body.nama_kontraktor,
            kategori_pb: req.body.kategori_pb,
            temuan: req.body.temuan,
            tanggal_penilaian: req.body.tanggal_penilaian,
            no_hp: req.body.no_hp,
            alamat_email: req.body.alamat_email,
            fungsi_dituju2: req.body.fungsi_dituju2,
        };

        // Call the function to upload PDFs and save PA data
        const uploadedFileNames = await uploadMultiplePDF(req.files, PBData);

        await req.flash('successUpPb', 'Kelengkapan Berkas PB berhasil di upload');
        // Redirect or send a response as per your needs
        res.redirect('/'); // Change this route as per your needs
    } catch (error) {
        console.error('Error processing form submission:', error);
        res.status(500).send('Internal Server Error');
    }
};



export const readPBData = async (req, res) => {
    try {
        // Periksa peran pengguna yang masuk
        const userRole = req.session.divisi_user ? req.session.divisi_user.divisi_name : null;
        let title = "PB Data";
        if (!req.session.divisi_user || !req.session.divisi_user.divisi_name) {
            // Jika pengguna belum login, redirect ke halaman login
            return res.redirect('/login_pertamina');
        }
        const messageSuccessVerify = await req.flash('successVerifyPb');


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
            const readResults = await PB.find(query);

            res.render('pb.data.ejs', {
                dataPB: readResults,
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


export const detailPBData = async (req, res) => {
    try {
        const userRole = req.session.divisi_user ? req.session.divisi_user.divisi_name : null;
        const pbId = req.params.id;

        // Cari data PSB berdasarkan ID
        const pbData = await PB.findById(pbId);

        if (!pbData) {
            return res.status(404).send('Data not found');
        }

        // Periksa apakah pengguna memiliki akses ke data tersebut
        if (userRole === 'HSSE' || userRole === pbData.fungsi_dituju2) {
            // Mendapatkan URL unduhan untuk setiap file dari Firebase Storage
            const fileURLs = await Promise.all([
                getDownloadURL(ref(storageFB, pbData.file1)),
                getDownloadURL(ref(storageFB, pbData.file2)),
                getDownloadURL(ref(storageFB, pbData.file3)),
                getDownloadURL(ref(storageFB, pbData.file4)),
                getDownloadURL(ref(storageFB, pbData.file5)),
                getDownloadURL(ref(storageFB, pbData.file6)),
                getDownloadURL(ref(storageFB, pbData.file7)),
                getDownloadURL(ref(storageFB, pbData.file8))
                // Lanjutkan untuk file lainnya...
            ]);

            res.render('pb.detail.ejs', {
                dataPB: pbData,
                title: "PB Detail Data",
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



export const editPBData = async (req, res) => {
    try {
        const userRole = req.session.divisi_user ? req.session.divisi_user.divisi_name : null;
        const divisi_user = req.session.divisi_user; 
        const pbId = req.params.id;

        // Cari data PB berdasarkan ID
        const pbData = await PB.findById(pbId);

        if (!pbData) {
            return res.status(404).send('Data not found');
        }

        // Periksa apakah pengguna memiliki akses ke data tersebut
        if (userRole === 'HSSE' || userRole === pbData.fungsi_dituju2) {
            // Mendapatkan URL unduhan untuk setiap file dari Firebase Storage
            const fileURLs = await Promise.all([
                getDownloadURL(ref(storageFB, pbData.file1)),
                getDownloadURL(ref(storageFB, pbData.file2)),
                getDownloadURL(ref(storageFB, pbData.file3)),
                getDownloadURL(ref(storageFB, pbData.file4)),
                getDownloadURL(ref(storageFB, pbData.file5)),
                getDownloadURL(ref(storageFB, pbData.file6)),
                getDownloadURL(ref(storageFB, pbData.file7)),
                getDownloadURL(ref(storageFB, pbData.file8))
                // Lanjutkan untuk file lainnya...
            ]);

            res.render('pb.edit.ejs', {
                dataPB: pbData,
                title: "PB Edit Data",
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

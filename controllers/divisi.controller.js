import divisiUser from '../models/divisi.model.js';

import bcrypt from 'bcrypt';


export const divisiLogin = async(req,res)=>{

};

export const CreatingPIN = async (req, res) => {
    try {
        // Variabel untuk input data PIN
        const password = req.body.password;

        // Generate salt untuk hashing PIN
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);

        // Mengenkripsi PIN menggunakan bcrypt
        const hashedPassword = await bcrypt.hash(password, salt);

        // Membuat instance model FungsiPertamina dengan data yang dienkripsi
        const fungsiPertaminaInstance = new divisiUser({
            divisi_name: req.body.divisi_name, // Pastikan username tersedia dalam request body
            password: hashedPassword,
        });

        // Menyimpan instance model ke MongoDB
        await fungsiPertaminaInstance.save();

        res.send(
            `${hashedPassword} <br> Buat PIN success. <br><a href="/TEBNiTYQrFFULHqFQluEuw==">Kembali</a>`
        );
    } catch (error) {
        console.error("Registration error:", error);
        res.send("Registration failed");
    }
};


export const loginUser = async (req, res) => {
    try {
        // Get the password and divisi_name from the request body
        const { password, divisi_name } = req.body;

        // Find the user in the database based on divisi_name
        const user = await divisiUser.findOne({ divisi_name });

        if (!user) {
            return res.status(404).send("User not found");
        }

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            // Save user information in session
            req.session.divisi_user = {
                id: user._id,
                divisi_name: user.divisi_name
            };

            res.redirect('/dashboard_divisi');
        } else {
            res.send("Invalid password");
        }
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).send("Login failed");
    }
};




export const createPINPage = async (req,res)=>{

    const title = "Create User Page";
    res.render('createUser',{
        title
    });
};
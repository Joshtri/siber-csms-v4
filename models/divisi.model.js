import mongoose from "mongoose";


const divisiSchema = new mongoose.Schema({

    divisi_name:{
        type: String,
        require:true
    },
    password:{
        type: String,
        require:true
    }


});




const divisi = mongoose.model('divisi', divisiSchema);
export default divisi;

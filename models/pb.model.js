import mongoose from "mongoose";

const PBSchema = new mongoose.Schema({

  // kategori PB

  /*

   */
  
  risk_assessment_id: {
    type: String,
    required: true,
  },
  risk_level: {
    type: String,
    required: true,
  },

  kategori_pb:{
    type: String,
    enum: ['PB1', 'PB2', 'PB3','PB4'],
    // default: 'Belum Diproses',
    require: true
  },

  nomor_kontrak: {
    type: String,
    required: true,
  },
  nama_pekerjaan: {
    type: String,
    required: true,
  },
  nama_kontraktor: {
    type: String,
    required: true,
  },

  tanggal_penilaian: {
    type: Date,
    required: true,
  },

  no_hp: {
    type: String,
    required: true,
  },
  alamat_email: {
    type: String,
    required: true,
  },

  nilai_total: {
    type: Number,

  },
  keterangan_verifikasi: {
    type: String,

  },
  status_mitra: {
    type: String,
    enum: ['Belum Diproses', 'Ditolak', 'Diterima'],
    default: 'Belum Diproses',
    require: true
  },

  status_mitra2: {
    type: String,
    enum: ['Belum Diproses', 'Ditolak', 'Diterima'],
    default: 'Belum Diproses',
  },

  file1: {
    type: String,
    required: true,
  },
  file2: {
    type: String,
    required: true,
  },
  file3: {
    type: String,
    required: true,
  },
  file4: {
    type: String,
    required: true,
  },
  file5: {
    type: String,
    required: true,
  },
  file6: {
    type: String,
    required: true,
  },
  file7: {
    type: String,
    required: true,
  },
  file8: {
    type: String,
    required: true,
  },

  fungsi_dituju1: {
    type: String,
    default: 'HSSE'

  },
  fungsi_dituju2: {
    type: String,
    enum: ['ICT', 'WIWS', 'PE', 'RAM',  'PRODUKSI', 'SCM']

  },

});

const Pb = mongoose.model('Pb', PBSchema);

export default Pb;
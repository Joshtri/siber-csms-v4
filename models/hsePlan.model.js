import mongoose from "mongoose";

const HSEPlanSchema = new mongoose.Schema({
  risk_assessment_id: {
    type: String,
    required: true,
  },
  risk_level: {
    type: String,
    required: true,
  },
  nama_pekerjaan: {
    type: String,
    required: true,
  },
  nama_mitra: {
    type: String,
    required: true,
  },
  tanggal_audit: {
    type: Date,
    required: true,
  },
  lokasi_kerja: {
    type: String,
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
  fungsi_dituju1: {
    type: String,
    default: 'HSSE'

  },
  keterangan_verifikasi: {
    type: String,

  },
  status_mitra: {
    type: String,
    enum: ['Belum Diproses', 'Ditolak', 'Diterima'],
    default: 'Belum Diproses',
  },
  file1: {
    type: String,
    required: true,
  },
  // file2: {
  //   type: String,
  //   required: true,
  // },
  // file3: {
  //   type: String,
  //   required: true,
  // },
  // file4: {
  //   type: String,
  //   required: true,
  // },
  // file5: {
  //   type: String,
  //   required: true,
  // },
  // file6: {
  //   type: String,
  //   required: true,
  // },
  // file7: {
  //   type: String,
  //   required: true,
  // },
  // file8: {
  //   type: String,
  //   required: true,
  // },
});

const HSEPlan = mongoose.model('HSEPlan', HSEPlanSchema);

export default HSEPlan;
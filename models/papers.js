//updated code 5SEp line 2 to 18
const mongoose = require('mongoose');

const paperSchema = new mongoose.Schema({
    title: { type: String, required: true },
    dept: { type: String, required: true },
    semester: { type: String, required: true },
    year: { type: String, required: true },
    subject: { type: String, required: true },
    filename: { type: String, required: true },
    fileData: { type: Buffer, required: true },
    contentType: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'Approved'], default: 'Pending' },
    uploader: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
    uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Paper', paperSchema);


// const mongoose = require('mongoose');

// const paperSchema = new mongoose.Schema({
//   title: String,
//   dept: String,
//   semester: String,
//   year: String,
//   subject: String,
//   filename: String, // stored in GridFS
//   status: { type: String, enum: ['Pending', 'Approved'], default: "Pending" },
//   uploader: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
//   uploadedAt: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model('Paper', paperSchema);


// const mongoose = require('mongoose');

// const paperSchema = new mongoose.Schema({
//   title: String,
//   dept: String,
//   semester: String,
//   year: String,
//   subject: String,
//   filename: String, // stored in GridFS
//   status: { type: String, enum: ['Pending', 'Approved'], default: 'Pending' },
//   uploader: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
//   uploadedAt: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model('Paper', paperSchema);

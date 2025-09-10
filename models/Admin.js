// const mongoose = require('mongoose');

// const adminSchema = new mongoose.Schema({
//   username: { type: String, required: true, unique: true },
//   password: { type: String, required: true }, // hashed password
//   createdAt: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model('Admin', adminSchema);
// const res = await fetch(`${apiBase}/papers`, {
//   method: 'POST',
//   headers: { Authorization: `Bearer ${token}` },
//   body: formData,  // FormData without manually setting Content-Type
// });

// const mongoose = require('mongoose');

// const adminSchema = new mongoose.Schema({
//   username: { type: String, required: true, unique: true },
//   password: { type: String, required: true }, // hashed
//   createdAt: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model('Admin', adminSchema);

const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Admin', adminSchema);

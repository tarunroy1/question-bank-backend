// updated server.js new 5 Sep line 2 to 58.....**upload new line 60 to 107.**
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error("❌ MongoDB connection error:", err));


// Fixed `server.js`:
require('dotenv').config();
const express = require('express');
// const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./Routes/auth');
const adminRoutes = require('./Routes/admins');
const paperRoutes = require('./Routes/papers');

const app = express();

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:5500', 'http://localhost:5500'],
    credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files
app.use(express.static('public'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/papers', paperRoutes);

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Connected to MongoDB');
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})
.catch(err => {
    console.error('MongoDB connection error:', err);
});

// server.js
// require('dotenv').config();
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const path = require('path');

// // Import routes
// const authRoutes = require('./Routes/auth');
// const adminRoutes = require('./Routes/admins');
// const paperRoutes = require('./Routes/papers');

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json({ limit: '50mb' }));
// app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// // API Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/admins', adminRoutes);
// app.use('/api/papers', paperRoutes);

// // Serve static frontend files
// const staticDir = path.join(__dirname, 'public');
// app.use(express.static(staticDir));

// // ✅ Fallback: any non-API route loads index.html
// app.get(/^\/(?!api).*/, (req, res) => {
//   res.sendFile(path.join(staticDir, 'index.html'));
// });

// // MongoDB connection + start server
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log('✅ MongoDB connected');
//     const PORT = process.env.PORT || 4000;
//     app.listen(PORT, () => {
//       console.log(`🚀 Server running on port ${PORT}`);
//     });
//   })
//   .catch(err => console.error('❌ MongoDB connection error:', err));





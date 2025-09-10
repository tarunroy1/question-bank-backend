// updated code5sep line 2 to 34
const express = require('express');
const Admin = require('../models/Admin');
const auth = require('../middleware/auth');

const router = express.Router();

// List all admins (protected)
router.get('/', auth, async (req, res) => {
    try {
        const admins = await Admin.find({}, { password: 0 }).sort({ createdAt: -1 });
        res.json(admins);
    } catch (error) {
        console.error('Error fetching admins:', error);
        res.status(500).json({ error: 'Failed to fetch admins' });
    }
});

// Delete admin by id (protected)
router.delete('/:id', auth, async (req, res) => {
    try {
        const admin = await Admin.findByIdAndDelete(req.params.id);
        if (!admin) {
            return res.status(404).json({ error: 'Admin not found' });
        }
        res.json({ message: 'Admin deleted successfully' });
    } catch (error) {
        console.error('Error deleting admin:', error);
        res.status(500).json({ error: 'Failed to delete admin' });
    }
});

module.exports = router;




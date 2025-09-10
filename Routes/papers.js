//updated code 5SEp line 2 to 156, 469
// const express = require('express');
// const multer = require('multer');
// const mongoose = require('mongoose');
// const Paper = require('../models/Paper');
// const auth = require('../middleware/auth');

// const router = express.Router();

// // Configure multer for file uploads
// const storage = multer.memoryStorage();
// const upload = multer({ 
//     storage: storage,
//     limits: {
//         fileSize: 10 * 1024 * 1024 // 10MB limit
//     },
//     fileFilter: (req, file, cb) => {
//         // Accept only PDF files
//         if (file.mimetype === 'application/pdf') {
//             cb(null, true);
//         } else {
//             cb(new Error('Only PDF files are allowed'), false);
//         }
//     }
// });

// // Upload paper (Protected)
// router.post('/', auth, upload.single('file'), async (req, res) => {
//     try {
//         console.log('Upload request received:', req.body);
//         console.log('File:', req.file ? 'File present' : 'No file');

//         const { title, dept, semester, year, subject } = req.body;
        
//         if (!title || !dept || !semester || !year || !subject) {
//             return res.status(400).json({ error: 'All fields are required' });
//         }

//         if (!req.file) {
//             return res.status(400).json({ error: 'No file uploaded' });
//         }

//         const paper = new Paper({
//             title,
//             dept,
//             semester,
//             year,
//             subject,
//             filename: req.file.originalname,
//             fileData: req.file.buffer,
//             contentType: req.file.mimetype,
//             uploader: req.user.id,
//             status: 'Pending'
//         });

//         await paper.save();
//         console.log('Paper saved successfully:', paper._id);

//         res.json({ 
//             message: 'Paper uploaded successfully', 
//             paper: {
//                 _id: paper._id,
//                 title: paper.title,
//                 dept: paper.dept,
//                 semester: paper.semester,
//                 year: paper.year,
//                 subject: paper.subject,
//                 status: paper.status,
//                 uploadedAt: paper.uploadedAt
//             }
//         });

//     } catch (err) {
//         console.error('Upload error:', err);
//         res.status(500).json({ error: 'Upload failed: ' + err.message });
//     }
// });

// // Get all papers (Protected)
// router.get('/', auth, async (req, res) => {
//     try {
//         const papers = await Paper.find()
//             .populate('uploader', 'username')
//             .select('-fileData') // Exclude file data from list view
//             .sort({ uploadedAt: -1 });
        
//         res.json(papers);
//     } catch (err) {
//         console.error('Fetch error:', err);
//         res.status(500).json({ error: 'Failed to fetch papers' });
//     }
// });

// // Approve paper (Protected)
// router.patch('/:id/approve', auth, async (req, res) => {
//     try {
//         const paper = await Paper.findByIdAndUpdate(
//             req.params.id,
//             { status: 'Approved' },
//             { new: true }
//         );

//         if (!paper) {
//             return res.status(404).json({ error: 'Paper not found' });
//         }

//         res.json({ message: 'Paper approved', paper });
//     } catch (err) {
//         console.error('Approve error:', err);
//         res.status(500).json({ error: 'Failed to approve paper' });
//     }
// });

// // Delete paper (Protected)
// router.delete('/:id', auth, async (req, res) => {
//     try {
//         const paper = await Paper.findByIdAndDelete(req.params.id);
        
//         if (!paper) {
//             return res.status(404).json({ error: 'Paper not found' });
//         }

//         res.json({ message: 'Paper deleted successfully' });
//     } catch (err) {
//         console.error('Delete error:', err);
//         res.status(500).json({ error: 'Failed to delete paper' });
//     }
// });

// // Download paper (Public for approved papers)
// router.get('/download/:id', async (req, res) => {
//     try {
//         const paper = await Paper.findById(req.params.id);
        
//         if (!paper) {
//             return res.status(404).json({ error: 'Paper not found' });
//         }

//         if (paper.status !== 'Approved') {
//             return res.status(403).json({ error: 'Paper not approved for download' });
//         }

//         res.set({
//             'Content-Type': paper.contentType,
//             'Content-Disposition': `attachment; filename="${paper.filename}"`
//         });

//         res.send(paper.fileData);
//     } catch (err) {
//         console.error('Download error:', err);
//         res.status(500).json({ error: 'Failed to download file' });
//     }
// });

// module.exports = router;
// next new code same day
const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const Paper = require('../models/Paper');
const auth = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        // Accept only PDF files
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed'), false);
        }
    }
});

// ============== PUBLIC ROUTES (No Authentication) ==============

// PUBLIC ROUTE - Search approved papers for students
router.get('/public', async (req, res) => {
    try {
        console.log('🔍 Public search request:', req.query);
        
        const { dept, semester, year, subject } = req.query;
        
        // Base filter - only approved papers
        const filter = { status: 'Approved' };
        
        // Add optional filters
        if (dept && dept !== '') filter.dept = dept;
        if (semester && semester !== '') filter.semester = semester;
        if (year && year !== '') filter.year = year;
        if (subject && subject !== '') {
            filter.subject = { $regex: subject, $options: 'i' };
        }
        
        const papers = await Paper.find(filter)
            .populate('uploader', 'username')
            .select('-fileData') // Don't send file data in search results
            .sort({ uploadedAt: -1 });
        
        console.log(`📋 Found ${papers.length} approved papers`);
        res.json(papers);
        
    } catch (error) {
        console.error('❌ Public search error:', error.message);
        res.status(500).json({ error: 'Search failed' });
    }
});

// PUBLIC ROUTE - Download approved paper
router.get('/public/download/:id', async (req, res) => {
    try {
        console.log('📥 Public download request for paper:', req.params.id);
        
        const paper = await Paper.findById(req.params.id);
        
        if (!paper) {
            return res.status(404).json({ error: 'Paper not found' });
        }
        
        if (paper.status !== 'Approved') {
            return res.status(403).json({ error: 'Paper not approved for download' });
        }
        
        console.log('✅ Downloading approved paper:', paper.title);
        
        res.set({
            'Content-Type': paper.contentType,
            'Content-Disposition': `attachment; filename="${paper.filename}"`
        });
        
        res.send(paper.fileData);
        
    } catch (error) {
        console.error('❌ Download error:', error.message);
        res.status(500).json({ error: 'Download failed' });
    }
});

// ============== PROTECTED ROUTES (Authentication Required) ==============

// Upload paper (Protected)
router.post('/', auth, upload.single('file'), async (req, res) => {
    try {
        console.log('📤 Upload request received from:', req.user.username);
        console.log('📋 Form data:', req.body);
        console.log('📄 File:', req.file ? 'File present' : 'No file');

        const { title, dept, semester, year, subject } = req.body;
        
        if (!title || !dept || !semester || !year || !subject) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const paper = new Paper({
            title,
            dept,
            semester,
            year,
            subject,
            filename: req.file.originalname,
            fileData: req.file.buffer,
            contentType: req.file.mimetype,
            uploader: req.user.id,
            status: 'Pending'
        });

        await paper.save();
        console.log('✅ Paper saved successfully:', paper._id);

        res.json({ 
            message: 'Paper uploaded successfully', 
            paper: {
                _id: paper._id,
                title: paper.title,
                dept: paper.dept,
                semester: paper.semester,
                year: paper.year,
                subject: paper.subject,
                status: paper.status,
                uploadedAt: paper.uploadedAt
            }
        });

    } catch (err) {
        console.error('❌ Upload error:', err);
        res.status(500).json({ error: 'Upload failed: ' + err.message });
    }
});

// Get all papers (Protected)
router.get('/', auth, async (req, res) => {
    try {
        console.log('📋 Fetching papers for admin:', req.user.username);
        
        const papers = await Paper.find()
            .populate('uploader', 'username')
            .select('-fileData') // Exclude file data from list view
            .sort({ uploadedAt: -1 });
        
        console.log(`✅ Fetched ${papers.length} papers`);
        res.json(papers);
        
    } catch (err) {
        console.error('❌ Fetch error:', err);
        res.status(500).json({ error: 'Failed to fetch papers' });
    }
});

// Approve paper (Protected) - FIXED VERSION
router.patch('/:id/approve', auth, async (req, res) => {
    try {
        console.log('✅ Approval request received');
        console.log('👤 Admin user:', req.user.username);
        console.log('📄 Paper ID:', req.params.id);

        // Validate paper ID
        if (!req.params.id || req.params.id === 'undefined') {
            console.log('❌ Invalid paper ID provided');
            return res.status(400).json({ error: 'Invalid paper ID' });
        }

        // Check if paper exists first
        const existingPaper = await Paper.findById(req.params.id);
        if (!existingPaper) {
            console.log('❌ Paper not found with ID:', req.params.id);
            return res.status(404).json({ error: 'Paper not found' });
        }

        console.log('📋 Paper found:', {
            title: existingPaper.title,
            currentStatus: existingPaper.status
        });

        // Update the paper status
        const updatedPaper = await Paper.findByIdAndUpdate(
            req.params.id,
            { status: 'Approved' },
            { new: true, runValidators: true }
        );

        console.log('✅ Paper approved successfully:', {
            id: updatedPaper._id,
            title: updatedPaper.title,
            newStatus: updatedPaper.status
        });

        res.json({ 
            message: 'Paper approved successfully', 
            paper: {
                _id: updatedPaper._id,
                title: updatedPaper.title,
                status: updatedPaper.status,
                dept: updatedPaper.dept,
                semester: updatedPaper.semester,
                year: updatedPaper.year,
                subject: updatedPaper.subject
            }
        });

    } catch (err) {
        console.error('❌ Approval error:', err);
        
        // Handle specific MongoDB errors
        if (err.name === 'CastError') {
            return res.status(400).json({ error: 'Invalid paper ID format' });
        }
        
        if (err.name === 'ValidationError') {
            return res.status(400).json({ error: 'Validation error: ' + err.message });
        }
        
        res.status(500).json({ error: 'Failed to approve paper: ' + err.message });
    }
});

// Alternative approval route using PUT method (backup)
router.put('/:id/approve', auth, async (req, res) => {
    try {
        console.log('✅ PUT Approval request for paper ID:', req.params.id);

        const paper = await Paper.findById(req.params.id);
        
        if (!paper) {
            console.log('❌ Paper not found');
            return res.status(404).json({ error: 'Paper not found' });
        }

        console.log('📋 Found paper:', paper.title, 'Current status:', paper.status);

        paper.status = 'Approved';
        await paper.save();

        console.log('✅ Paper approved via PUT method');
        res.json({ 
            message: 'Paper approved successfully', 
            paper: {
                _id: paper._id,
                title: paper.title,
                status: paper.status
            }
        });

    } catch (error) {
        console.error('❌ PUT Approval error:', error);
        res.status(500).json({ error: 'Failed to approve paper: ' + error.message });
    }
});

// Delete paper (Protected)
router.delete('/:id', auth, async (req, res) => {
    try {
        console.log('🗑️ Delete request for paper:', req.params.id);
        console.log('👤 Admin user:', req.user.username);

        const paper = await Paper.findByIdAndDelete(req.params.id);
        
        if (!paper) {
            console.log('❌ Paper not found for deletion');
            return res.status(404).json({ error: 'Paper not found' });
        }

        console.log('✅ Paper deleted successfully:', paper.title);
        res.json({ message: 'Paper deleted successfully' });
        
    } catch (err) {
        console.error('❌ Delete error:', err);
        res.status(500).json({ error: 'Failed to delete paper: ' + err.message });
    }
});

// Download paper for admin (Protected)
router.get('/download/:id', auth, async (req, res) => {
    try {
        console.log('📥 Admin download request for paper:', req.params.id);
        
        const paper = await Paper.findById(req.params.id);
        
        if (!paper) {
            return res.status(404).json({ error: 'Paper not found' });
        }

        console.log('✅ Admin downloading paper:', paper.title);

        res.set({
            'Content-Type': paper.contentType,
            'Content-Disposition': `attachment; filename="${paper.filename}"`
        });

        res.send(paper.fileData);
        
    } catch (err) {
        console.error('❌ Admin download error:', err);
        res.status(500).json({ error: 'Failed to download file: ' + err.message });
    }
});

module.exports = router;






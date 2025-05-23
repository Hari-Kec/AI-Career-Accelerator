import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import groqRouter from './routes/groq.js';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
//const { spawn } = require('child_process');
import child_process from 'child_process';
import { v4 as uuidv4 } from 'uuid';
import {exec } from 'child_process';
dotenv.config();

const app = express();
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());
app.use('/api/groq', groqRouter);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log(err));

// User Model
// Update your User model
const User = mongoose.model('User', new mongoose.Schema({
  uuid: { type: String, unique: true },
  name: { type: String, required: true },
  phone: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  firebaseUid: { type: String, unique: true, sparse: true }, // For Firebase users
  authProvider: { type: String, enum: ['email', 'google'], default: 'email' },
  avatar: { type: String }
}));
const jobApplicationSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  middleName: { type: String },
  lastName: { type: String, required: true },
  phone: { type: String, required: true },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, required: true },
  ethnicity: { type: String, required: true },
  gender: { type: String, required: true },
  disability: { type: String, required: true },
  veteran: { type: String, required: true },
  linkedinEmail: { type: String, required: true },
  linkedinPassword: { type: String, required: true },
  resumePath: { type: String, required: true },
  userId: String, 
},{ timestamps: true });

const JobApplication = mongoose.model('JobApplication', jobApplicationSchema);

// Google Auth Route
app.post('/api/auth/google', async (req, res) => {
  const { uid, email, name, photoURL } = req.body;

  try {
    // Check if user exists by Firebase UID or email
    let user = await User.findOne({ 
      $or: [{ firebaseUid: uid }, { email }] 
    });

    if (!user) {
      // Create new user for Google auth
      user = new User({
        uuid: uuidv4(),
        name,
        email,
        firebaseUid: uid,
        authProvider: 'google',
        avatar: photoURL
      });
      await user.save();
    } else if (!user.firebaseUid) {
      // Link existing account with Firebase
      user.firebaseUid = uid;
      user.authProvider = 'google';
      if (!user.avatar) user.avatar = photoURL;
      if (!user.uuid) user.uuid = uuidv4();
      await user.save();
    }

    // Generate JWT token (same as your regular auth)
    const token = jwt.sign({ userId: user.uuid }, process.env.JWT_SECRET);
    
    res.send({ 
      user: { 
        id: user.uuid,
        name: user.name, 
        email: user.email, 
        phone: user.phone,
        avatar: user.avatar
      }, 
      token 
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(400).send(error.message);
  }
});

// Register Route
app.post('/api/auth/register', async (req, res) => {
  const { name, phone, email, password } = req.body;

  const user = await User.findOne({ email });
  if (user) return res.status(400).send('User already exists');

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ 
    uuid: uuidv4(),
    name, 
    phone: phone || '', // Make phone optional
    email, 
    password: hashedPassword,
    authProvider: 'email'
  });

  await newUser.save();

  const token = jwt.sign({ userId: newUser.uuid}, process.env.JWT_SECRET);
  res.send({ 
    user: {
      id: newUser.uuid,  
      name: newUser.name, 
      email: newUser.email, 
      phone: newUser.phone 
    }, 
    token 
  });
});

// Login Route
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).send('User not found');

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(400).send('Invalid password');

  const token = jwt.sign({ userId: user.uuid}, process.env.JWT_SECRET);
  res.send({ 
    user: { 
      id: user.uuid,
      name: user.name,  // Add name to response
      email: user.email,
      phone: user.phone,
      avatar: user.avatar
    },
    token
  });
});

// Middleware to protect routes
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Protected Route
app.get('/api/auth/me', authMiddleware, async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).send('User not found');
  
  res.send({ 
    user: { 
      name: user.name, 
      email: user.email, 
      phone: user.phone,
      avatar: user.avatar,
      authProvider: user.authProvider
    } 
  });
});

// Configure multer for file upload
// const upload = multer({
//   storage: multer.diskStorage({
//     destination: function (req, file, cb) {
//       const resumePath = path.join(__dirname, '../JobApplyBot/resume');
//       // Create directory if it doesn't exist
//       if (!fs.existsSync(resumePath)) {
//         fs.mkdirSync(resumePath, { recursive: true });
//       }
//       cb(null, resumePath);
//     },
//     filename: function (req, file, cb) {
//       // Use original filename or generate a new one
//       cb(null, file.originalname);
//     }
//   }),
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype === 'application/pdf' || 
//         file.mimetype === 'application/msword' || 
//         file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
//       cb(null, true);
//     } else {
//       cb(new Error('Invalid file type. Only PDF, DOC, and DOCX are allowed.'));
//     }
//   },
//   limits: {
//     fileSize: 5 * 1024 * 1024 // 5MB limit
//   }
// });

// // Middleware to handle multipart/form-data
// app.use(express.urlencoded({ extended: true }));

// app.post('/api/update-personal-py', upload.single('resume'), (req, res) => {
//   try {
//     const formData = req.body;
//     const resumeFile = req.file;
    
//     // 1. Generate and save personal.py
//     const pythonContent = `# >>>>>>>>>>> Easy Apply Questions & Inputs <<<<<<<<<<<

// # Your legal name
// username = "${formData.linkedinEmail || ''}"
// password = "${formData.linkedinPassword || ''}"  
// first_name = "${formData.firstName || ''}"
// middle_name = "${formData.middleName || ''}"
// last_name = "${formData.lastName || ''}"

// # Phone number
// phone_number = "${formData.phone || ''}"

// # Location information
// current_city = "${formData.city || ''}"
// street = "${formData.street || ''}"
// state = "${formData.state || ''}"
// zipcode = "${formData.zipCode || ''}"
// country = "${formData.country || ''}"

// # Demographic information
// ethnicity = "${formData.ethnicity || ''}"
// gender = "${formData.gender || ''}"
// disability_status = "${formData.disability || ''}"
// veteran_status = "${formData.veteran || ''}"
// `;

//     const pythonPath = path.join(__dirname, '../JobApplyBot/config/personals.py');
//     const pythonDir = path.dirname(pythonPath);
    
//     if (!fs.existsSync(pythonDir)) {
//       fs.mkdirSync(pythonDir, { recursive: true });
//     }
    
//     fs.writeFileSync(pythonPath, pythonContent);
    
//     // 2. Prepare response
//     const responseData = {
//       success: true,
//       message: 'Files updated successfully',
//       pythonPath: pythonPath,
//       resumePath: resumeFile ? path.join(resumeFile.destination, resumeFile.filename) : 'No resume uploaded'
//     };
    
//     res.json(responseData);
//   } catch (error) {
//     console.error('Error:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: error.message || 'Error processing your request'
//     });
//   }
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//   if (err instanceof multer.MulterError) {
//     // A Multer error occurred when uploading
//     res.status(400).json({ 
//       success: false, 
//       message: err.message || 'File upload error' 
//     });
//   } else {
//     // Other errors
//     res.status(500).json({ 
//       success: false, 
//       message: err.message || 'Internal server error' 
//     });
//   }
// });

// // Add this endpoint to your server.js
// app.post('/api/clear-data', (req, res) => {
//   try {
//     // 1. Clear personals.py content
//     const pythonPath = path.join(__dirname, '../JobApplyBot/config/personals.py');
//     if (fs.existsSync(pythonPath)) {
//       fs.writeFileSync(pythonPath, '');
//     }

//     // 2. Clear resume directory
//     const resumeDir = path.join(__dirname, '../JobApplyBot/resume');
//     if (fs.existsSync(resumeDir)) {
//       // Delete all files in the directory
//       fs.readdirSync(resumeDir).forEach(file => {
//         fs.unlinkSync(path.join(resumeDir, file));
//       });
//     }

//     res.json({ success: true, message: 'Data cleared successfully' });
//   } catch (error) {
//     console.error('Error clearing data:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Error clearing data',
//       error: error.message 
//     });
//   }
// });

// // Remove just the resume file
// app.post('/api/remove-resume', async (req, res) => {
//   try {
//     const resumeDir = path.join(__dirname, '../JobApplyBot/resume');
//     if (fs.existsSync(resumeDir)) {
//       const files = fs.readdirSync(resumeDir);
//       files.forEach(file => {
//         fs.unlinkSync(path.join(resumeDir, file));
//       });
//     }

//     res.json({ success: true, message: 'Resume file removed' });
//   } catch (error) {
//     console.error('Error removing resume:', error);
//     res.status(500).json({ success: false, message: 'Failed to remove resume' });
//   }
// });

// app.post('/api/run-ai-bot', (req, res) => {
//   try {
//     const pythonScriptPath = path.join(__dirname, '../JobApplyBot/runAiBot.py');

//     console.log(`Running script: ${pythonScriptPath}`);

//     const pythonProcess = child_process.spawn('python', [pythonScriptPath]);


//     let output = '';
//     let errorOutput = '';

//     pythonProcess.stdout.on('data', (data) => {
//       output += data.toString();
//     });

//     pythonProcess.stderr.on('data', (data) => {
//       errorOutput += data.toString();
//     });

//     pythonProcess.on('close', (code) => {
//       if (code === 0) {
//         console.log('AI Bot completed successfully');
//         res.json({
//           success: true,
//           message: 'AI Bot executed successfully',
//           output: output
//         });
//       } else {
//         console.error('AI Bot failed with errors:', errorOutput);
//         res.status(500).json({
//           success: false,
//           message: 'AI Bot execution failed',
//           error: errorOutput
//         });
//       }
//     });
//   } catch (err) {
//     console.error('Server error while running bot:', err);
//     res.status(500).json({
//       success: false,
//       message: 'Server error while executing Python script',
//       error: err.message
//     });
//   }
// });

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /pdf|doc|docx/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only PDF, DOC, and DOCX files are allowed'));
  }
});

// Job Application Model

// Handle job application submission
app.post('/api/update-personal-py', authMiddleware, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Resume file is required' });
    }

    const {
      firstName,
      middleName,
      lastName,
      phone,
      street,
      city,
      state,
      zipCode,
      country,
      ethnicity,
      gender,
      disability,
      veteran,
      linkedinEmail,
      linkedinPassword
    } = req.body;

    // Create new job application
    const application = new JobApplication({
      firstName,
      middleName: middleName || '',
      lastName,
      phone,
      street,
      city,
      state,
      zipCode,
      country,
      ethnicity,
      gender,
      disability,
      veteran,
      linkedinEmail,
      linkedinPassword,
      resumePath: req.file.path,
      userId: req.userId
    });

    await application.save();

    // Here you could add additional processing like:
    // - Parsing the resume
    // - Connecting to LinkedIn
    // - Sending confirmation emails

    res.json({
      
      success: true,
      message: 'Application submitted successfully',
      applicationId: application._id
    });

  } catch (error) {
    console.error('Application submission error:', error);
    
    // Clean up uploaded file if there was an error
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }

    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to submit application' 
    });
  }
});

// Get user's applications
app.get('/api/applications', authMiddleware, async (req, res) => {
  try {
    const applications = await JobApplication.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .select('-linkedinPassword'); // Don't return the password

    res.json({ success: true, applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single application
app.get('/api/applications/:id', authMiddleware, async (req, res) => {
  try {
    const application = await JobApplication.findOne({
      _id: req.params.id,
      userId: req.userId
    }).select('-linkedinPassword');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    res.json({ success: true, application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Download resume
app.get('/api/applications/:id/resume', authMiddleware, async (req, res) => {
  try {
    const application = await JobApplication.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!application || !application.resumePath) {
      return res.status(404).json({ success: false, message: 'Resume not found' });
    }

    if (!fs.existsSync(application.resumePath)) {
      return res.status(404).json({ success: false, message: 'Resume file not found' });
    }

    res.download(application.resumePath);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});



// At top of server.js, add required imports



// Keep all your existing code above this line

// Sample test route
app.get('/api/test', (req, res) => {
  res.send("API is working!");
});

// NEW: Run AI Bot endpoint
app.post('/api/update-personals-py', authMiddleware, async (req, res) => {
  const userId = req.userId;

  try {
    // Find user's job application in DB
    const application = await JobApplication.findOne({ userId });

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    // Generate the complete personals.py content
    const personalsContent = `# Personal Information Configuration
first_name = "${application.firstName || ''}"                 # Your first name
middle_name = "${application.middleName || ''}"               # Middle name
last_name = "${application.lastName || ''}"                   # Your last name

phone_number = "${application.phone || ''}"                   # Phone number

current_city = "${application.city || ''}"                    # Current city
'''
Note: If left empty as "", the bot will fill in location of jobs location.
'''

street = "${application.street || ''}"
state = "${application.state || ''}"
zipcode = "${application.zipCode || ''}"
country = "${application.country || ''}"

ethnicity = "${application.ethnicity || ''}"                  # Ethnicity
gender = "${application.gender || ''}"                        # Gender
disability_status = "${application.disability || 'No'}"       # Disability status
veteran_status = "${application.veteran || 'No'}"            # Veteran status

username = "${application.linkedinEmail || ''}"               # LinkedIn email
password = "${application.linkedinPassword || ''}"            # LinkedIn password

resume_path = "${application.resumePath || ''}"               # Resume path
`;

    // Define path to personals.py
    const personalsPath = path.join(__dirname, '../JobApplyBot/config/personals.py');

    // Write the updated config file
    fs.writeFileSync(personalsPath, personalsContent);

    res.json({
      success: true,
      message: 'personals.py updated successfully!',
      filePath: personalsPath
    });

  } catch (err) {
    console.error('Update personals.py Error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update personals.py',
      error: err.message 
    });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const express = require('express');
const openpgp = require('openpgp');
const ethers = require('ethers');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

// Ensure the 'uploads' folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Set up a storage engine for multer to save files to the 'uploads' folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Set the destination folder where files will be uploaded
    cb(null, uploadsDir); // Ensure the correct path is used
  },
  filename: (req, file, cb) => {
    // Use the original file name as it is, no timestamp added
    cb(null, file.originalname); // Directly use the original filename
  }
});

// Initialize multer with the storage configuration
const upload = multer({ storage: storage });

// Serve static files from the "uploads" folder
app.use(express.static(uploadsDir));

// Serve the index.html content directly as the response
// NB in demo we will either:
//     replace the index.html with a react root and bundle
///    OR use a dev server on 8000 and run this server on 3000
app.get('/', (req, res) => {
  fs.readFile(path.join(__dirname, 'index.html'), 'utf8', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading HTML file\ If running locally, go to localhost:8000 . If running from build, you need to point the server to the index.html root file.');
    }
    res.send(data); // Send the HTML file to the user
  });
});

// Handle file upload at /upload route
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  // Log the uploaded file details for debugging
  console.log('Uploaded file details:', req.file);

  // Generate a shareable URL for the uploaded file
  const fileUrl = `/uploads/${req.file.filename}`;

  // Respond with a JSON object containing the download link
  res.json({
    message: 'File uploaded successfully',
    downloadLink: fileUrl, // Send the URL to the client
  });
});

// Handle file download at /uploads/:filename route
app.get('/uploads/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'uploads', filename);

  // Log the requested file path for debugging
  console.log('Requesting file:', filePath);

  // Check if the file exists in the 'uploads' folder
  fs.exists(filePath, (exists) => {
    if (!exists) {
      return res.status(404).send('File not found');
    }

    // Send the file for download
    res.download(filePath, filename, (err) => {
      if (err) {
        console.error('Error downloading the file:', err);
        res.status(500).send('Error downloading the file');
      }
    });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Storage server is running at http://localhost:${port}`);
});

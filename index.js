const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3001;

// Folder where files will be stored
const folderPath = path.join(__dirname, 'files');

// Ensure the folder exists
if (!fs.existsSync(folderPath)) {
  fs.mkdirSync(folderPath, { recursive: true });
}

// Endpoint to create a text file with the current timestamp
app.post('/create-file', (req, res) => {
  try {
    const timestamp = new Date().toISOString();
    const fileName = `${timestamp.replace(/[:.]/g, '-')}.txt`; // Replace characters not allowed in filenames
    const filePath = path.join(folderPath, fileName);

    fs.writeFileSync(filePath, timestamp);

    res.status(201).json({ message: 'File created successfully', fileName });
  } catch (error) {
    console.error('Error creating file:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Endpoint to retrieve all text files in the folder
app.get('/list-files', (req, res) => {
  try {
    const files = fs.readdirSync(folderPath).filter(file => file.endsWith('.txt'));

    res.status(200).json({ files });
  } catch (error) {
    console.error('Error reading files:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

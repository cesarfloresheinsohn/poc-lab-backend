const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3001;

const storage = multer.memoryStorage();
const upload = multer({ storage });

app.post('/upload', upload.single('file'), (req, res) => {
    const { chunkIndex, totalChunks } = req.body;
    const chunkIndexInt = parseInt(chunkIndex, 10);
    const totalChunksInt = parseInt(totalChunks, 10);
    const uploadDir = path.join(__dirname, 'uploads');

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
    }

    const filePath = path.join(uploadDir, req.file.originalname);

    fs.appendFileSync(filePath, req.file.buffer);

    console.log(`Received chunk ${chunkIndexInt + 1}/${totalChunksInt}`);

    if (chunkIndexInt + 1 === totalChunksInt) {
        console.log('All chunks uploaded successfully');
    }

    res.sendStatus(200);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
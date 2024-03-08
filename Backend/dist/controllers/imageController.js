"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = void 0;
const uploadImage = (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        const imagePath = req.file.path;
        return res.status(201).json({ message: 'Image uploaded successfully', imagePath });
    }
    catch (error) {
        console.error('Error uploading image:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.uploadImage = uploadImage;

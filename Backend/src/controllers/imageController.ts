import { Request, Response } from 'express';

export const uploadImage = (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const imagePath = req.file.path;
    return res.status(201).json({ message: 'Image uploaded successfully', imagePath });
  } catch (error) {
    console.error('Error uploading image:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

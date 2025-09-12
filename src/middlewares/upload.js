import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { cloudinary } from '../config/cloudinary.js';

const resumeStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'jobestate/resumes',
    resource_type: 'auto',
    access_mode: 'authenticated',
    allowed_formats: ['pdf', 'doc', 'docx', 'png', 'jpg', 'jpeg'],
  },
});

export const uploadResume = multer({ storage: resumeStorage });

// import multer from "multer";

// const storage = multer.memoryStorage(); // or your cloudinaryStorage

// export const uploadResume = multer({
//   storage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
// });

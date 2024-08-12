import multer from 'multer';
import path from 'path';
import uploadService from '../services/uploadService.js';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/uploads');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({storage: storage});

const uploadProfilePicture = async (req, res) => {
    upload.single('file')(req, res, async (err) => {
        if (err) {
            return res.status(500).send({message: err.message});
        }

        try {
            const result = await uploadService.handleProfilePictureUpload(req);
            res.status(200).send(result);
        } catch (error) {
            if (error.message === 'No file uploaded.') {
                res.status(400).send({message: error.message});
            } else {
                res.status(500).send({message: error.message});
            }
        }
    });
};

const uploadChurchProfilePicture = async (req, res) => {
    upload.single('file')(req, res, async (err) => {
        if (err) {
            return res.status(500).send({message: err.message});
        }

        try {
            const result = await uploadService.handleChurchProfileUpload(req);
            res.status(200).send(result);
        } catch (error) {
            if (error.message === 'No file uploaded.') {
                res.status(400).send({message: error.message});
            } else {
                res.status(500).send({message: error.message});
            }
        }
    });
};

const uploadPdf = async (req, res) => {
    upload.single('file')(req, res, async (err) => {
        if (err) {
            return res.status(500).send({message: err.message});
        }

        try {
            const {postId, groupId} = req.body;
            const result = await uploadService.handlePdfUpload(req.file, postId, groupId);
            res.status(200).send(result);
        } catch (error) {
            if (error.message === 'No file uploaded.') {
                res.status(400).send({message: error.message});
            } else {
                res.status(500).send({message: error.message});
            }
        }
    });
};

export default {
    uploadProfilePicture,
    uploadChurchProfilePicture,
    uploadPdf
};

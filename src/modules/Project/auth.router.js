import * as projectController from './controller/project.js'
import * as validators from './project.validation.js'
import { validation } from '../../middleware/validation.js';
import { fileUpload, fileValidation, myMulter } from '../../services/multer.js';
import { Router } from "express";
const router = Router()

//signup&confirmEmail
router.post('/cv',myMulter(fileValidation.image).array('image',2), projectController.cv)

export default router
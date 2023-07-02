import fs from 'fs'
import multer from 'multer';
import { nanoid } from 'nanoid';
import path from 'path';
import { fileURLToPath } from 'url'
const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const fileValidation = {
    image: ['image/png', 'image/jpeg', 'image/gif'],
    pdf: ['application/pdf'],

}


export function myMulter(customValidation=fileValidation.image) {
 
    const storage = multer.diskStorage({})

    function fileFilter(req, file, cb) {
        if (customValidation.includes(file.mimetype)) {
            cb(null, true)
        } else {
            cb('invalid format', false)
        }
    }
    const upload = multer({ fileFilter, storage })
    return upload
}


export function fileUpload(customPath = 'general', customValidation = []) {

    const fullPath = path.join(__dirname, `../uploads`)
    // if (!fs.existsSync(fullPath)) {
    //     fs.mkdirSync(fullPath, { recursive: true })
    // }

    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, fullPath)
        },
        filename: (req, file, cb) => {
            const uniqueFileName = nanoid() + "_" + file.originalname;
            file.dest = `/uploads/${uniqueFileName}`
            cb(null, uniqueFileName)
        }
    })

    function fileFilter(req, file, cb) {
        if (customValidation.includes(file.mimetype)) {
            cb(null, true)
        } else {
            cb('In-valid file Format', false)
        }
    }
    const upload = multer({ fileFilter, storage })
    return upload
}
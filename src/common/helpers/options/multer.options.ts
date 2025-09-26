import { BadRequestException } from "@nestjs/common";
import { MulterOptions } from "@nestjs/platform-express/multer/interfaces/multer-options.interface";

type Options = {
    allowedFields: string[]
    fileSize?: number
}

export const multerOptions = (options: Options): MulterOptions => {
    return {
        limits: { fileSize: options.fileSize ?? 5000000 },
        fileFilter: (req, file, callback) => {
            // allow only specific file types (e.g., images)
            const allowedTypes = /jpeg|jpg|png|gif/;
            const ext = file.originalname.split('.').pop().toLowerCase();
            const mimetype = allowedTypes.test(file.mimetype);
            if (ext && mimetype) {
                callback(null, true);
            } else {
                callback(new BadRequestException('Only images (jpg, jpeg, png, gif) are allowed'), false);
            }
            // validate field names
            if (options.allowedFields.length > 0 && !options.allowedFields.includes(file.fieldname)) {
                callback(new BadRequestException(`Invalid field name: ${file.fieldname}`), false);
            }
        },
    }
} 
import multer, {FileFilterCallback} from "multer";
import { bucket } from "../config/googleCloudStorage";
import{ Request, Response, NextFunction } from "express";

const storage = multer.memoryStorage();

export const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
        if(file.mimetype.startsWith('image/')){
            cb(null, true)
    }else{
        cb(null, false)
    }
}
}).array('images', 5)

export const uploadSingle = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
        if(file.mimetype.startsWith('image/')){
            cb(null, true)
    }else{
        cb(null, false)
    }
}
}).single('profilePic')

export const uploadToGCS = async (req: Request, res: Response, next: NextFunction) => {
    if(!req.files || req.files.length === 0) return next();
    const promises = (req.files as Express.Multer.File[]).map((file: Express.Multer.File) => {
        const blob = bucket.file(`${Date.now()}_${file.originalname}`);
        console.log(blob)
        const blobStream = blob.createWriteStream({
            resumable: false,
            gzip: true
        });
        return new Promise((resolve, reject) => {
            blobStream.on('error',err =>  reject(err))
            blobStream.on('finish', async() => {
                try{
                    await blob.makePublic();
                    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
                    (file as any).cloudStoragePublicUrl = publicUrl;
                    console.log(publicUrl)  
                    resolve(publicUrl)
                }catch(error){
                    reject(error)
                }  
            }); 
            blobStream.end(file.buffer)
        });
    });
    try{
        await Promise.all(promises);
        next();
    }catch(error){
        console.error(error);
        res.status(500).json({error: 'Failed to upload images'})
    }
}


export const uploadProfilePicToGCS = async (req: Request, res: Response, next: NextFunction) => {
    if(!req.file){
        return next();
    }
         
    const file = req.file as Express.Multer.File;
    console.log(file)
    const blob = bucket.file(`${Date.now()}_${file.originalname}`);
    console.log(blob)
    const blobStream = blob.createWriteStream({
        resumable: false,
        gzip: true
    });
    blobStream.on('error', (err) => {
        console.error(err);
        res.status(500).json({error: 'Failed to upload image'})
    });
    blobStream.on('finish', async() => {
        try{
            await blob.makePublic();
            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
            (file as any).cloudStoragePublicUrl = publicUrl;
            console.log(publicUrl)  
            next();
        }catch(error){
            console.error(error);
            res.status(500).json({error: 'Failed to upload image'})
        }
    });
    blobStream.end(file.buffer)
}
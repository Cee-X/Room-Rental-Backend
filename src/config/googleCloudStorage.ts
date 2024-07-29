import { Storage } from "@google-cloud/storage";

const storage = new Storage({
    projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
    keyFilename: process.env.GOOGLE_CLOUD_KEYFILE
})

export const bucket = storage.bucket(process.env.GOOGLE_CLOUD_STORAGE_BUCKET as string)


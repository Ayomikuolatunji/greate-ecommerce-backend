// CloudinaryFunctions.ts

import cloudinary, { UploadApiResponse } from "cloudinary";
import multer from "multer";
import { InternalServerError } from "../errors/InternalServerError";
import { ENVIRONMENT_VARIABLES } from "../configurations/config";
import { Readable } from "stream";

export abstract class CloudinaryFunctions {
  public async uploadFile(buffer: Buffer): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.v2.uploader.upload_stream(
        {
          folder: ENVIRONMENT_VARIABLES.CLOUDINARY_UPLOAD_PATH,
          resource_type: "auto",
        },
        (error, result) => {
          if (error || !result) {
            return reject(new InternalServerError("Error uploading file"));
          }
          resolve(result);
        }
      );

      // Convert buffer to a readable stream and pipe it to Cloudinary
      Readable.from(buffer).pipe(uploadStream);
    });
  }

  public async deleteFile(filePublicId: string) {
    const deleteFileResponse = await cloudinary.v2.uploader.destroy(filePublicId);
    if (!deleteFileResponse) {
      throw new InternalServerError("Error deleting file");
    }
    return true;
  }

  public getMulter() {
    const storage = multer.memoryStorage();
    const upload = multer({ storage });
    return upload;
  }
}

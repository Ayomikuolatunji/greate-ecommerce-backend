import cloudinary, { UploadApiResponse } from "cloudinary";
import multer from "multer";
import { InternalServerError } from "../errors/InternalServerError";
import { ENVIRONMENT_VARIABLES } from "../configurations/config";

export abstract class CloudinaryFunctions {
  public async uploadFile(path: string): Promise<UploadApiResponse> {
    const upload = await cloudinary.v2.uploader.upload(path, {
      folder: ENVIRONMENT_VARIABLES.CLOUDINARY_UPLOAD_PATH,
      resource_type: "auto",
    });
    if (!upload) {
      throw new InternalServerError("Error uploading file");
    }
    return upload;
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

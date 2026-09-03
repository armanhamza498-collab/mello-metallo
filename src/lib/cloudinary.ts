import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function uploadToCloudinary(
  fileBuffer: Buffer,
  folder: string = "laitonco"
): Promise<{ url: string; publicId: string }> {
  return new Promise((resolve) => {
    const fallback = () => {
      const base64 = fileBuffer.toString("base64");
      return resolve({
        url: `data:image/png;base64,${base64}`,
        publicId: `fallback_${Date.now()}`,
      });
    };

    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      process.env.CLOUDINARY_CLOUD_NAME === "dks10293"
    ) {
      return fallback();
    }

    try {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "image",
        },
        (error, result) => {
          if (error || !result) {
            console.warn("[CLOUDINARY API UPLOAD FAILED — FALLING BACK TO DATA URL]", error?.message || error);
            return fallback();
          }
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        }
      );

      uploadStream.on("error", (err) => {
        console.warn("[CLOUDINARY STREAM ERROR]", err?.message || err);
        fallback();
      });

      uploadStream.end(fileBuffer);
    } catch (err) {
      console.warn("[CLOUDINARY EXCEPTION]", err);
      fallback();
    }
  });
}

export default cloudinary;

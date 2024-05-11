import sharp from "sharp";

class ProfilePictureModel {
  constructor(
    originalImageBuffer,
    imageText = "placeholder text",
    thumbnailImageBuffer = undefined,
  ) {
    this.originalImageBuffer = originalImageBuffer;
    this.imageText = imageText;
    this.thumbnailImageBuffer = thumbnailImageBuffer;
  }

  async getThumbnailImage() {
    try {
      if (!this.thumbnailImageBuffer) {
        this.thumbnailImageBuffer = await sharp(this.originalImageBuffer)
          .resize(100, 100)
          .toBuffer();
      }
    } catch (error) {
      console.error(error);
      return {
        status: 500,
        message: "Internal server error",
        thumbnailImageBuffer: undefined,
      };
    }

    return {
      status: 200,
      message: "Image ready",
      thumbnailImageBuffer: this.thumbnailImageBuffer,
    };
  }
}

export default ProfilePictureModel;

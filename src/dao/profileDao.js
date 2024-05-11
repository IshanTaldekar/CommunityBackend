import db from "../../db.js";
import ProfilePictureModel from "../models/profilePictureModel.js";

class ProfileDao {
  static async updateUserBio(userId, bio) {
    try {
      const result = await db.none(
        `UPDATE public.User\
         SET bio=$1\
         WHERE user_id = $2`,
        [bio, userId],
      );

      return {
        status: 200,
        message: "User bio updated successfully",
      };
    } catch (err) {
      console.error(err);
    }

    return {
      status: 500,
      message: "Internal server error",
    };
  }

  static async updateUserProfilePicture(
    userId,
    originalImageBuffer,
    imageText,
  ) {
    const profilePicture = new ProfilePictureModel(
      originalImageBuffer,
      imageText,
    );

    try {
      return await db.tx(async (t) => {
        const thumbnailImage = await profilePicture.getThumbnailImage();

        const insertPicture = await t.one(
          `INSERT INTO public.ProfilePicture (image_text, original_image, thumbnail_image)\
          VALUES ($1, $2, $3)\
          RETURNING picture_id;`,
          [
            profilePicture.imageText,
            profilePicture.originalImageBuffer,
            thumbnailImage,
          ],
        );

        const newPictureId = insertPicture.picture_id;

        await t.none(
          `INSERT INTO public.UserProfilePictureUploadHistory (user_id, picture_id, timestamp)
           VALUES ($1, $2, current_timestamp)`,
          [userId, newPictureId],
        );
        return {
          status: 200,
          message: "Profile picture updated",
        };
      });
    } catch (error) {
      console.error(error);
    }

    return {
      status: 500,
      message: "Internal server error",
    };
  }

  static async updateUserAddress(userId, addressId) {
    try {
      const result = await db.none(
        `INSERT INTO public.UserAddressHistory (user_id, timestamp, address_id)
          VALUES ($1, current_timestamp, $2);`,
        [userId, addressId],
      );

      return {
        status: 200,
        message: "User address updated successfully",
      };
    } catch (err) {
      console.error(err);
    }

    return {
      status: 500,
      message: "Internal server error",
    };
  }

  static async getUserBio(userId) {
    try {
      const result = await db.one(
        `SELECT bio 
        FROM public.User 
        WHERE user_id = $1`,
        [userId],
      );

      return {
        status: 200,
        message: "User bio fetched successfully",
        bio: result.bio,
      };
    } catch (err) {
      console.error(err);
    }

    return {
      status: 500,
      message: "Internal server error",
    };
  }

  static async getUserProfilePicture(userId) {
    try {
      const result = await db.one(
        `SELECT original_image 
        FROM public.LatestUserProfilePicture as lupp
             JOIN public.ProfilePicture as p ON lupp.picture_id = p.picture_id
        WHERE user_id = $1`,
        [userId],
      );

      return {
        status: 200,
        message: "User picture fetched successfully",
        image: Buffer.from(result.original_image).toString("base64"),
      };
    } catch (err) {
      console.error(err);
    }

    return {
      status: 500,
      message: "Internal server error",
    };
  }

  static async getUserProfilePictureThumbnail(userId) {
    try {
      const result = await db.one(
        `SELECT thumbnail_image 
        FROM public.LatestUserProfilePicture as lupp
             JOIN public.ProfilePicture as p ON lupp.picture_id = p.picture_id
        WHERE user_id = $1`,
        [userId],
      );

      return {
        status: 200,
        message: "User picture fetched successfully",
        image: Buffer.from(result.thumbnail_image).toString("base64"),
      };
    } catch (err) {
      console.error(err);
    }

    return {
      status: 500,
      message: "Internal server error",
    };
  }

  static async getUserAddress(userId) {
    try {
      const result = await db.one(
        `SELECT street, city, state, zip_code, latitude, longitude\
        FROM public.LatestUserAddress as lua\
             JOIN public.Address as a ON lua.address_id = a.address_id\
        WHERE user_id = $1`,
        [userId],
      );

      return {
        status: 200,
        message: "User address fetched successfully",
        address: {
          street: result.street,
          city: result.city,
          state: result.state,
          zip_code: result.zip_code,
          latitude: result.latitude,
          longitude: result.longitude,
        },
      };
    } catch (err) {
      console.error(err);
    }

    return {
      status: 500,
      message: "Internal server error",
    };
  }

  static async getUserInformation(userId) {
    try {
      const result = await db.one(
        `SELECT first_name, last_name, email_address 
        FROM public.User 
        WHERE user_id = $1`,
        [userId],
      );

      return {
        status: 200,
        message: "User information fetched successfully",
        user: {
          firstName: result.first_name,
          lastName: result.last_name,
          email: result.email_address,
        },
      };
    } catch (err) {
      console.error(err);
    }

    return {
      status: 500,
      message: "Internal server error",
    };
  }
}

export default ProfileDao;

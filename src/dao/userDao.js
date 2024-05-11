import UserModel from "../models/userModel.js";
import db from "../../db.js";

class UserDao {
  static async userWithEmailAddressExists(email) {
    return (
      (await db.oneOrNone(
        `SELECT email_address 
         FROM public.User 
         WHERE email_address = $1`,
        [email],
      )) !== null
    );
  }

  static async registerNewUser(firstName, lastName, email, password) {
    try {
      if (await UserDao.userWithEmailAddressExists(email)) {
        return {
          status: 409,
          message: "User already exists",
        };
      }

      const hashedPassword = await UserModel.hashPassword(password);
      await db.one(
        `INSERT INTO public.User (first_name, last_name, email_address, password) 
        VALUES ($1, $2, $3, $4) 
        RETURNING user_id;`,
        [firstName, lastName, email, hashedPassword],
      );

      return {
        status: 201,
        message: "Successfully registered",
      };
    } catch (err) {
      console.error(err);
    }

    return {
      status: 500,
      message: "Internal server error",
    };
  }

  static async authenticateUser(email, password) {
    const result = await db.oneOrNone(
      `SELECT * FROM public.User 
      WHERE email_address = $1`,
      [email],
    );

    if (!result) {
      return {
        status: 404,
        message: "User not found",
        user: undefined,
      };
    }

    const user = UserModel.fromDb(result);

    if (!(await user.isPasswordMatch(password))) {
      return {
        status: 401,
        message: "Invalid user or password",
        user: undefined,
      };
    }

    return {
      status: 200,
      message: "User authenticated successfully",
      user: user,
    };
  }
}

export default UserDao;

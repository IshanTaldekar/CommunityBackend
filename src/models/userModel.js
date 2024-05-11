import bcrypt from "bcrypt";

class UserModel {
  constructor(user_id, firstName, lastName, email, password) {
    this.user_id = user_id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
  }

  static async hashPassword(plainTextPassword) {
    const saltRounds = 10;
    return await bcrypt.hash(plainTextPassword, saltRounds);
  }

  async isPasswordMatch(plainTextPassword) {
    return await bcrypt.compare(plainTextPassword, this.password);
  }

  static fromDb({ user_id, firstName, lastName, emailAddress, password }) {
    return new UserModel(user_id, firstName, lastName, emailAddress, password);
  }
}

export default UserModel;

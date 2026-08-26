import {
  hashPassword,
  comparePassword,
} from "../utils/password.js";

class PasswordService {
  async hash(password) {
    return hashPassword(password);
  }

  async compare(password, hashedPassword) {
    return comparePassword(password, hashedPassword);
  }
}

export default PasswordService;
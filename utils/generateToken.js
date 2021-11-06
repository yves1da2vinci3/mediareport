import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()
const generateToken = (id) => {
  return jwt.sign({ id }, "kenshinApp", {
    expiresIn: '30d',
  })
}

export default generateToken
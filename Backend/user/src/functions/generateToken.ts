import jwt from "jsonwebtoken"

const JWT_SECRET = "easyPay"
export const  GenerateToken = (userId : String) => {
 
    return jwt.sign(userId , JWT_SECRET )
    
}
import jwt from "jsonwebtoken"


const jwtToken = (userId, resp)=>{
    const token = jwt.sign({userId}, process.env.JWT_SECRET,{
        // expiry date of token
        expiresIn:"30d"
    })
    resp.cookie('jwt',token,{
    maxAge: 30 *24 *60 *60 *1000,   
    httpOnly: true,
    secure:process.env.SECURE !== "development"
    })
}
export default jwtToken
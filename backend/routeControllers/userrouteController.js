import User from "../Models/userModels.js";
import bcryptjs, { hashSync } from 'bcryptjs'
import jwtToken from '../utils/jwtwebToken.js'

export const userRegister = async (req, resp) => {

    try {
        const { fullname, username, email, gender, password, profilepic } = req.body;
        const user = await User.findOne({ username, email });
        if (user) return resp.status(500).send({ success: false, message: "Username or email all ready exist" });
        // here now we are hashing password of user 
        const hashPassword = bcryptjs.hashSync(password, 10);
        // now add profile pic
        const profileBoy = profilepic || `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const profileGirl = profilepic || `https://avatar.iran.liara.run/public/girl?username=${username}`;

        // to save aal data in DATABASE
        const newUser = new User({
            fullname,
            username,
            email,
            password: hashPassword,
            gender,
            profilepic: gender === "male" ? profileBoy : profileGirl
        })
        if (newUser) {

            await newUser.save();

            // create jwt token
            jwtToken(newUser._id, resp)

        } else {
            resp.status(500).send({ success: false, message: "Invalid user data" });

        }

        // frontend pe bhejne ke liye
        resp.status(200).send({
            _id: newUser._id,
            fullname: newUser.fullname,
            username: newUser.username,
            profilepic: newUser.profilepic,
            email: newUser.email
        })
    } catch (error) {
        resp.status(500).send({
            success: false,
            message: error
        })
        console.log(error);
    }
}



// now user route controller for login page



export const userLogin = async (req, resp) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email })
        if (!user) return resp.status(500).send({ success: false, message: "Email doesn't exist Register" });
        const comparePass = bcryptjs.compareSync(password, user.password || "");
        if (!comparePass) return resp.status(500).send({ success: false, message: "Email or Password doesn't matching" });

        // create jwt token
        jwtToken(user._id, resp)

        resp.status(200).send({

            _id: user._id,
            fullname: user.fullname,
            username: user.username,
            profilepic: user.profilepic,
            email: user.email,
            message: "successfully login"
        })

    } catch (error) {
        resp.status(500).send({
            success: false,
            message: error
        })
        console.log(error);
    }
}



// now logout page controller


export const userLogout = async(req,resp)=>{
    try {
        resp.cookie("jwt","",{
          maxAge:0  
        })
        resp.status(200).send({success:true, message:"Logout successfully"})
    } catch (error) {
        
        resp.status(500).send({
            success: false,
            message: error
        })
        console.log(error);
    }
}
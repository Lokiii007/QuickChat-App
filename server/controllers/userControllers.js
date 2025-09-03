import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs"; 



// signup a new user
export const signup = async (req, res) => {
    const { fullName, email, password, bio } = req.body;

    try{
        if(!fullName || !email || !password || !bio){
            return res.json({success: false, message: "Missing Details"})
        }
        // check if user already exists
        const user = await User.findOne({email})

        if(user){
            return res.json({success: false, message: "Account already exists"})
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            fullName, email, password: hashedPassword, bio
        })

        const token = generateToken(newUser._id);
        
        res.json({success: true, userData: newUser, token, 
        message: "Account Created Successfully" });

    }catch(error){
        console.log(error.message);
        res.json({success: false, message: error.message });
    }
}


// Controllers for login a user

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userData = await User.findOne({ email });

        const isPasswordCorrect = await bcrypt.compare(password, userData.password);
        
        if(!isPasswordCorrect){
            return res.json({success: false, message: "Invalid Credentials"});
        }

        const token = generateToken(userData._id);

        res.json({success: true, userData, token, message: "Account Created Successful"});

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message });
    }
}

// Controllers to check if user is authenticated

export const checkAuth = (req, res) => {
    res.json({success: true, user: req.user});
}

// Controller to update user profile
export const updateProfile = async (req, res) => {
    try {
        const { fullName, bio, profilePic } = req.body;
        const userId = req.user._id;

        let updateUser;

        if(!profilePic){
            updateUser = await User.findByIdAndUpdate(userId, {fullName, bio}, 
            {new: true});
        }else{
            const uploadedImage = await cloudinary.uploader.upload(profilePic);

            updateUser = await User.findByIdAndUpdate(userId, {profilePic: uploadedImage.secure_url, 
            fullName, bio},{new: true})
        }
        res.json({success: true, user: updateUser});
    } catch (error) {
        console.log(error.message);
        
        res.json({success: false, message: error.message});
        
    }
}


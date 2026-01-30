import { User } from "../model/user.model.js";
import bcrypt from 'bcryptjs';

// controller for register
export const register = async(req, res) => {
    try {
        const {username, email, password} = req.body;
        if(!username || !email || !password){
            return res.status(401).json({
                message: 'Please fill all details...',
                success: false
            });
        }
        const user = await User.findOne({email});
        if(user){
             return res.status(401).json({
                message: 'Try differnt email...',
                success: false
            });
        }
        // use safe password
        const hashedPassword = await bcrypt.hash(password, 8);
        await User.create({
            username, 
            email, 
            password:hashedPassword
        })
        return res.status(201).json({
            message: "Account created successfully...",
            status: true
        });
    } catch (error) {
        console.log('Register Error', error);
    }
}

// controller for login
export const login = async(req, res) => {
    try {
        const { email, password} = req.body;
        if(!email || !password){
            return res.status(401).json({
                message: 'Please fill all details...',
                success: false
            });
        }
        let user = await User.findOne({email});
        if(!user){
            return res.status(401).json({
                message: 'Invalid details...',
                success: false
            });
        }
        // check whether password is same
        const isPassword = await bcrypt.compare(password, user.password);
        if(!isPassword){
            return res.status(401).json({
                message: 'Invalid password...',
                success: false
            });
        }
        // create token
        
    } catch (error) {
        console.log('Login Error', error);
    }
}


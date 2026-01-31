import jwt from 'jsonwebtoken';

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if(!token){
            return res.send({success: false, message: "User not Authenticated!"});
        }
        const decode = await jwt.verify(token, process.env.SECRET_KET);
        if(!decode){
            return res.send({success: false, message: "Invalid token!"});
        }
        
        req.id = decode.userId; // decode.userId => it comes from token we were saved in userController [jwt.sign({userId: user._id},)]

        next();
    } catch (error) {
        console.log(error);
    }
}

export default isAuthenticated;
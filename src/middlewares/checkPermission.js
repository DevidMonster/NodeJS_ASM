import jwt from "jsonwebtoken"
import User from "../models/user"

const checkPermission = async (req, res, next) => {
    try {
        if(!req.headers.authorization) {
            return res.status(401).json({message: 'Unauthorized'})
        }
    
        const token = req.headers.authorization.split(" ")[1]
    
        const { _id } = jwt.verify(token, "devidmonster")
    
        const user = await User.findById(_id)
        if(user.role !== "admin") {
            return res.status(401).json({message: 'Not admin'})
        }
        req.user = user
        next()
    } catch (error) {
        res.status(500).json({
            message: error
        })   
    } 
}

export default checkPermission
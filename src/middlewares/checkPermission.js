import jwt from "jsonwebtoken"
import User from "../models/user"

const checkPermission = async (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            return res.status(401).send({ message: 'Unauthorized' })
        }

        const token = req.headers.authorization.split(" ")[1]
        console.log(token);
        jwt.verify(token, "devidmonster", async (err, payload) => {
            if (err) {
                if (err.name === 'JsonWebTokenError') {
                    return res.status(401).send({
                        message: 'JWT verification failed'
                    })
                }

                if (err.name === 'TokenExpiredError') {
                    return res.status(401).send({
                        message: 'JWT token has expired'
                    })
                }
            }

            const user = await User.findById(payload._id)
            console.log(token);
            if (user.role !== "admin") {
                return res.status(401).send({ message: 'Not admin' })
            }
            req.user = user
            next()
        })
    } catch (error) {
        res.status(500).send({
            message: error
        })
    }
}

export default checkPermission
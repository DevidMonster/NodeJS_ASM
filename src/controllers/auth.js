import User from '../models/user';
import { signupSchema } from '../schemas/auth';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const logIn = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email })

        if (!user) {
            return res.status(400).send({
                message: 'Email not exist'
            })
        }

        const isPassWordValid = await bcrypt.compare(req.body.password, user.password)
        console.log(isPassWordValid)
        if (!isPassWordValid) {
            return res.status(400).send({
                message: 'Wrong password'
            })
        }

        const accessToken = jwt.sign({ _id: user._id }, "devidmonster", { expiresIn: "1h" })
        user.password = undefined
        console.log(accessToken);
        res.status(200).json({
            message: 'Login successfully',
            accessToken,
            user
        })
    } catch (err) {
        res.status(400).send({ message: err.message })
    }
}

const signUp = async (req, res) => {
    try {
        const userExist = await User.findOne({ email: req.body.email })
        const { error } = signupSchema.validate(req.body, { abortEarly: false })

        if (error) {
            const errors = error.details.map((err) => err.message)
            return res.status(400).send({
                message: errors
            })
        }

        if (userExist) {
            return res.status(400).send({
                message: 'Email already exists'
            })
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            role: req.body.role
        })

        const accessToken = jwt.sign({ _id: user._id }, "devidmonster", { expiresIn: "1h" })
        user.password = undefined;

        res.status(200).json({
            message: 'Sign up successfully',
            accessToken,
            user
        })
    } catch (err) {
        res.status(400).send({ message: err.message })
    }
}

const auth = {
    logIn,
    signUp
}

export default auth
import User from '../models/user';
import { signupSchema } from '../schemas/auth';
import bcrypt from 'bcryptjs';

const logIn = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email })

        if (!user) {
            return res.status(400).send({
                message: 'Email not exist'
            })
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        console.log(hashedPassword)
        if (user.password !== hashedPassword) {
            return res.status(400).send({
                message: 'Wrong password'
            })
        }

        user.password = undefined
        res.status(200).json({
            message: 'Login successfully',
            user
        })
    } catch (err) {
        res.status(400).send({ message: err })
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
            res.status(400).send({
                message: 'Email already exists'
            })
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })

        user.password = undefined;
        res.status(200).json({
            message: 'Sign up successfully',
            user
        })
    } catch (err) {
        res.status(400).send({ message: err })
    }
}

const auth = {
    logIn,
    signUp
}

export default auth
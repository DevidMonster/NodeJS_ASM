import User from '../models/user';

const getUser = async (req, res) => {
    try {
        const userId = req.user._id
        const user = await User.findOne({_id: userId})
        if(!user) {
            return res.status(404).send({ message: 'User not found'})
        }

        return res.status(200).send({ 
            message: 'Getting user',
            data: user
        })

    } catch (err) {
        res.status(400).send({ message: err.message })
    }
}

const updateProfile = async (req, res) => {
    try {
        const { id } = req.params
        const userHasUpdated = await User.findOneAndUpdate(id, req.body, { new: true})

        return res.status(200).send({
            message: 'Profile updated successfully',
            userHasUpdated
        })
    } catch (error) {
        res.status(400).send({ message: err.message })
    }
}

export const user = {
    getUser,
    updateProfile
}
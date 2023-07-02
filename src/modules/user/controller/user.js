import { findById, findOne, findOneAndUpdate, updateOne, find } from "../../../../DB/DBMethods.js"
import userModel from "../../../../DB/model/User.model.js"
import cloudinary from "../../../services/cloudinary.js"
import { sendEmail, sendEmailFeedBack } from "../../../services/email.js"
import { asyncHandler } from "../../../services/errorHandling.js"
import bcrypt from 'bcryptjs'

export const sendMessage = asyncHandler(async (req, res, next) => {
    const { email, subject, message, name } = req.body;
    const emailMessage = `<!DOCTYPE html>
    <html>
    <head>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"></head>
    <style type="text/css">
    body{background-color: #88BDBF;margin: 0px;}
    </style>
    <body style="margin:0px;"> 
    <table border="0" width="50%" style="margin:auto;padding:30px;background-color: #F3F3F3;border:1px solid #630E2B;">
    <tr>
    <td>
    <table border="0" width="100%">
    <tr>
    <td>
    <h1>
        <img width="100px" src="${process.env.logo}"/>
    </h1>
    </td>
    <td>
    <p style="text-align: right;"><a href="${process.env.FEURL}" target="_blank" style="text-decoration: none;">View In Website</a></p>
    </td>
    </tr>
    </table>
    </td>
    </tr>
    <tr>
    <td>
    <table border="0" cellpadding="0" cellspacing="0" style="text-align:center;width:100%;background-color: #fff;">
    <tr>
    <td style="background-color:#630E2B;height:100px;font-size:50px;color:#fff;">
    <img width="50px" height="50px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703716/Screenshot_1100_yne3vo.png">
    </td>
    </tr>
    <tr>
    <td>
    <h1 style="padding-top:25px; color:#630E2B"></h1>
    </td>
    </tr>
    <tr>
    <td>
    <p style="padding:0px 100px;">
    </p>
    </td>
    </tr>
    <tr>
    <td>
    <h3>Sender Name: ${name}</h3>
    </td>
    </tr>
    <tr>
    <td>
    <p>${message}</p>
    </td>
    </tr>
    </table>
    </td>
    </tr>
    <tr>
    <td>
    <table border="0" width="100%" style="border-radius: 5px;text-align: center;">
    <tr>
    <td>
    <h3 style="margin-top:10px; color:#000">Stay in touch</h3>
    </td>
    </tr>
    <tr>
    <td>
    <div style="margin-top:20px;">

    <a href="${process.env.facebookLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
    <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35062_erj5dx.png" width="50px" hight="50px"></span></a>

    </div>
    </td>
    </tr>
    </table>
    </td>
    </tr>
    </table>
    </body>
    </html>`
   const emailResult = await sendEmailFeedBack(email , name, subject, emailMessage)
    return res.status(200).json({ message: `Done`  , emailResult}) 
})



















// export const profile = asyncHandler(async (req, res, next) => {
//     const user = await userModel.find({}).populate([{
//         path: 'contacts',
//         select: "userName email"
//     }])
//     return user ? res.status(200).json({ message: `Done`, user }) : next(new Error('In-valid user', { cause: 404 }))
// })
export const userProfile = asyncHandler(async (req, res, next) => {
    const user = await findById({
        model: userModel,
        filter: req.user._id,
        populate: [{
            path: 'contacts',
            select: "userName email firstName lastName image"
        }]
    })
    return user ? res.status(200).json({ message: `Done`, user }) : next(new Error('In-valid user', { cause: 404 }))
})
export const userSharedProfile = asyncHandler(async (req, res, next) => {
    const user = await findById({
        model: userModel,
        filter: req.params.id,
        select: "-password"
    })
    if (!user) {
        return next(new Error('In-valid user', { cause: 404 }))
    } else {
        if (req.query.to == 'FE') {
            return res.status(200).redirect(`${process.env.FEURL}#/user/${user._id}/shared`)
        } else {
            return res.status(200).json({ message: `Done`, user })
        }
    }
})

export const basicInfo = asyncHandler(async (req, res, next) => {

    if (req.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `NFC_CARD/user/${req.user._id}` })
        req.body.image = secure_url;
        req.body.imagePublicId = public_id
    }
    const user = await findOneAndUpdate({
        model: userModel,
        filter: req.user._id,
        data: req.body,
        options: { new: false }
    })
    if (!user) {
        await cloudinary.uploader.destroy(req.body.imagePublicId)
        return next(new Error('Fail to update', { cause: 400 }))
    } else {
        if (user.imagePublicId) {
            await cloudinary.uploader.destroy(user.imagePublicId)
        }
        return res.status(200).json({ message: `Done`, user })
    }

})

export const socialLinks = asyncHandler(async (req, res, next) => {

    const user = await findOneAndUpdate({
        model: userModel,
        filter: req.user._id,
        data: { socialLinks: req.body.links },
        options: { new: true }
    })
    if (!user) {
        return next(new Error('Fail to update', { cause: 400 }))
    } else {
        return res.status(200).json({ message: `Done`, user })
    }

})


export const updatePassword = asyncHandler(async (req, res, next) => {
    const { oldPassword, newPassword } = req.body
    const user = await findOne({
        model: userModel,
        filter: { _id: req.user._id }
    })
    if (!user) {
        return next(new Error('Not register user', { cause: 400 }))
    }

    const match = bcrypt.compareSync(oldPassword, user.password)
    if (!match) {
        return next(new Error('Wrong old Password', { cause: 400 }))
    }

    const hashPassword = bcrypt.hashSync(newPassword, parseInt(process.env.SaltRound))
    await updateOne({
        model: userModel,
        filter: { _id: user._id },
        data: { password: hashPassword }
    })
    return res.status(200).json({ message: "Done" })
})

export const addToContacts = asyncHandler(async (req, res, next) => {
    const { id } = req.body
    if (req.user._id.toString() == id.toString()) {
        return next(new Error('Sorry you can not add yourself to your contacts list', { cause: 409 }))
    }
    const user = await findOne({
        model: userModel,
        filter: { _id: id },
    })
    if (!user) {
        return next(new Error('In-valid Account', { cause: 400 }))
    }


    await updateOne({
        model: userModel,
        filter: { _id: req.user._id },
        data: { $addToSet: { contacts: user._id } }
    })
    return res.status(200).json({ message: "Done" })
})
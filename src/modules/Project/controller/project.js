import axios from 'axios'
import cloudinary from '../../../services/cloudinary.js'
import { asyncHandler } from '../../../services/errorHandling.js'
export const cv = asyncHandler(async (req, res, next) => {

    // const coverPic = []
    // for (const file of req.files) {
    //     const { secure_url } = await cloudinary.uploader.upload(file.path, { folder: `CV` })
    //     coverPic.push(secure_url)
    // }
    // const data = { Image1_link: coverPic[0], Image2_link: coverPic[1] }

    // const result = await axios.post(`${process.env.CV_AI_URL}`, {
    //     headers: {
    //         'content-type': 'application/json'
    //     },
    //     // data: {
    //     //     // Image1_link: `${req.protocol}://${req.headers.host}${req.files[0].dest}`,
    //     //     // Image2_link: `${req.protocol}://${req.headers.host}${req.files[1].dest}`,

    //     // }

    //     data: {
    //         "Image1_link": "https://res.cloudinary.com/dlfygxvvc/image/upload/v1688078333/CV/rxutkiduo6kfdbklqd0g.jpg",
    //         "Image2_link": "https://res.cloudinary.com/dlfygxvvc/image/upload/v1688078333/CV/rxutkiduo6kfdbklqd0g.jpg"
    //     }
    // })
    // console.log({ result });

    const data = {
        Image1_link: `${req.protocol}://${req.headers.host}${req.files[0].dest}`,
        Image2_link: `${req.protocol}://${req.headers.host}${req.files[1].dest}`,
    }
    return res.json({ message: "Done", data })
})

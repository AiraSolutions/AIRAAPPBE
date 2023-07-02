import authRouter from './auth/auth.router.js'
import projectRouter from './Project/auth.router.js'
import userRouter from './user/user.router.js'
import productRouter from './product/product.router.js'
import orderRouter from './order/order.router.js'
import cartRouter from './cart/cart.router.js'

import { fileURLToPath } from 'url'
import path from 'path';
const __dirname = path.dirname(fileURLToPath(import.meta.url))

import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import { globalErrorHandling } from '../services/errorHandling.js'
import connectDB from '../../DB/connection.js'
//convert Buffer Data

export const appRouter = (app) => {
    var whitelist = ['https://airadev.netlify.app', 'http://localhost:4200', 'https://sa-rkg8.onrender.com', 'https://image-matching-p1re.onrender.com'] //FE links


    app.use(async (req, res, next) => {
        console.log(req.header('origin'))
        if (whitelist.includes(req.header('origin'))) {
            await res.header('Access-Control-Allow-Origin', req.header('origin'));
            await res.header('Access-Control-Allow-Headers', '*')
            await res.header("Access-Control-Allow-Private-Network", 'true')
            await res.header('Access-Control-Allow-Methods', '*')
            console.log("Origin Work");
            return next();
        } else {
            return next(new Error('Not Allowed By CORS', { status: 403 }))
        }


    });
    //convert Buffer Data
    app.use(express.json())
    app.use("/uploads", express.static(path.join(__dirname, '../uploads/')))
    app.use(express.urlencoded({ extended: false }))

    // setup port and the baseUrl
    if (process.env.MOOD === 'DEV') {
        app.use(morgan("dev"))
    } else {
        app.use(morgan("combined"))
    }
    //Setup API Routing 

    app.get("/", (req, res, next) => {
        res.status(200).send("<h1>Welcome to AIRA for developer home Page.</h1>")
    })
    // app.use(`/auth`, authRouter)
    // app.use(`/product`, productRouter)
    // app.use(`/order`, orderRouter)
    // app.use(`/cart`, cartRouter)

    app.use(`/project`, projectRouter)
    app.use(`/user`, userRouter)
    app.use('*', (req, res, next) => {
        res.status(404).send("<h1>In-valid Routing Plz check url  or  method</h1>")
    })
    app.use(globalErrorHandling)
    connectDB()
}
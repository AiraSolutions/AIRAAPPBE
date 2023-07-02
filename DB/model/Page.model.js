import mongoose from "mongoose";
import { Schema, model, Types } from "mongoose";


const pageSchema = new Schema({
    sections: [{
        data: Object
    }]
}, {

    timestamps: true,
})

const pageModel = mongoose.models.page || model('page', pageSchema)
export default pageModel
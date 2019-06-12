import {Schema, model} from 'mongoose';


let ClientSchema = new Schema({
    createdAt: Date,
    updatedAt: Date,
    // timestamp:{
    //     type: Date,
    //     default:Date.now
    // },
    user: {
        type: Object,
        ref: 'User'
    },

    product_name:{
        type:String,
        required:true
    },
    inspection:{
        type:Date,

        required:true,

    },
    promo_code:{
        type:String,

        required:true,

    },




});
export default model('Client', ClientSchema);
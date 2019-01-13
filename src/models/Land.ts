import {Schema, model} from 'mongoose';
import DateTimeFormat = Intl.DateTimeFormat;

let LandSchema = new Schema({
    createdAt: Date,
    updatedAt: Date,
    // timestamp:{
    //     type: Date,
    //     default:Date.now
    // },

    priviledge:{
        type:Number,

    },
    product:{
        type:String,
        required:true
    },
    promo_code:{
        type:String,
    },
    site_visit:{
        type:String,
    },
    phone:{
        type:Number,
        required:true
    },



});

export default model('Land', LandSchema);

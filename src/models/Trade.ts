import {Schema, model} from 'mongoose';

let TradeSchema = new Schema({
    createdAt: Date,
    updatedAt: Date,
    // timestamp:{
    //     type: Date,
    //     default:Date.now
    // },
    product:{
        type:String,
        required:true

    },
    promo_code:{
        type:String,
        required:true
    },
    inspection:{
        type:String,

        required:true,
    },
    firstname:{
        type:String,
        required:true

    },
    lastname:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        default:'',
        required:true

    },
    // posts:[{
    //     type:Schema.Types.ObjectId,
    //     ref:'Post'
    // }]



});
model('Trade', TradeSchema);

export default model('Trade');
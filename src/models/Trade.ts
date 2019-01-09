import {Schema, model} from 'mongoose';

let TradeSchema = new Schema({
    createdAt: Date,
    updatedAt: Date,
    // timestamp:{
    //     type: Date,
    //     default:Date.now
    // },
    name:{
        type:String,
        default:'',
        required:true

    },
    developer:{
        type:String,
        default:'',
        required:true

    },
    plot_size:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:'Role',
    },

    amount:{
        type:String,
        default:'',
        required:true,
        unique:true
    },
    fullname:{
        type:String,
        default:'',
        required:true

    },
    email:{
        type:String,
        default:'',
        required:true,
        unique:true
    },
    password:{
        type:String,
        default:'',
        required:true
    },
    // password_confirmation:{
    //     type:String,
    //     default:'',
    //     required:true
    // },
    forget_pass_token:{
        type:String,
        default:null
    },
    who_are_you:{
        type:String,
        default:''

    },

    product:{
        type:String,
        default:'',
        required:true
    },
    promo_code:{
        type:String,
        default:'',
        required:true
    },
    site_visit:{
        type:String,
        default:'',
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
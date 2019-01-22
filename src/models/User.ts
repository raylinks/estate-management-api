import {Schema, model} from 'mongoose';
import DateTimeFormat = Intl.DateTimeFormat;

export const payStatus = {
    paid: 1,
    unpaid: 10,
}
let UserSchema = new Schema({
    createdAt: Date,
    updatedAt: Date,
    // timestamp:{
    //     type: Date,
    //     default:Date.now
    // },
    firstname:{
        type:String,
        required:true
    
    },
    lastname:{
        type:String,
        default:'',
        required:true
    
    },
    role_id:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:'Role',
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

    is_payed:{
        type:Number,
        default: payStatus.unpaid,
        
    },
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
    refelname:{
        type:String,
    },
    refelemail:{
        type:String,
    },
    refelphone:{
        type:Number,
    },

    // posts:[{
    //     type:Schema.Types.ObjectId,
    //     ref:'Post'
    // }]
    


});
model('User', UserSchema);

export default model('User');
import {Schema, model} from 'mongoose';

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
        default:'',
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
    who_are_you:{
        type:String,
        default:''
        
    },
    is_payed:{
        type:Number,
        default: payStatus.unpaid,
        
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
model('User', UserSchema);

export default model('User');
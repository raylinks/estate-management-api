import {Schema, model} from 'mongoose';


let PaidSchema = new Schema({
    createdAt: Date,
    updatedAt: Date,
    
    payment:{
        type:Number,
        default:'',
        required:true
    },
    bonus:{
        type:String,
        default:'',
        required:true
    },
    allocation:{
        type:String,
        default:'',
        required:true
    },
    user_id:{
        type:String,
        default:'',
        required:true
    },

});
model('Paid', PaidSchema);

export default model('Paid');
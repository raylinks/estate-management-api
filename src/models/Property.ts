import {Schema, model} from 'mongoose';


let PropertySchema = new Schema({
    createdAt: Date,
    updatedAt: Date,
    
    description:{
        type:String,

        required:true
    },
    fullname:{
        type:String,
        default:'',
        required:true
    },
    email:{
        type:String,
        default:'',
        required:true
    
    },
    identity:{
        type:Number,

    
    },
    phone:{
        type:String,
        default:'',
        required:true
    
    },
    
    

});
model('Property', PropertySchema);

export default model('Property');
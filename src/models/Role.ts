import {Schema, model} from 'mongoose';


let RoleSchema = new Schema({
    createdAt: Date,
    updatedAt: Date,
    // timestamp:{
    //     type: Date,
    //     default:Date.now
    // },
    name:{
        type:String,
        default:'',
        required:true,
        unique:true
    },
    
   
    


});
export default model('Role', RoleSchema);
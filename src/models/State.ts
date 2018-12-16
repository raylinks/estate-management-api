import {Schema, model} from 'mongoose';


let StateSchema = new Schema({
    createdAt: Date,
    updatedAt: Date,
    // timestamp:{
    //     type: Date,
    //     default:Date.now
    // },
    state:{
        type:String,
        default:'',
        required:true
    },
    slug:{
        type:String,
        default:'',
        required:true,
        unique:true,
    },
   
    


});
export default model('State', StateSchema);
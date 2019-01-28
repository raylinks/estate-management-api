import {Schema, model} from 'mongoose';


let EstateSchema = new Schema({
    createdAt: Date,
    updatedAt: Date,
    // timestamp:{
    //     type: Date,
    //     default:Date.now
    // },
    state_id:{
        type:Schema.Types.ObjectId,
        ref: 'State',
        required:true
    },
    name:{
        type:String,
        required:true
    },
    slug:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },



});
export default model('Estate', EstateSchema);
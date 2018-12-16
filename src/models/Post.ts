import {Schema, model} from 'mongoose';


let PostSchema = new Schema({
    createdAt: Date,
    updatedAt: Date,
    // timestamp:{
    //     type: Date,
    //     default:Date.now
    // },
    title:{
        type:String,
        default:'',
        required:true
    },
    slug:{
        type:String,
        default:'',
        required:true,
        unique:true,
        lowercase:true

    },
    content:{
        type:String,
        default:'',
        required:true
    },
    featuredImage:{
        type:String,
        default:''
    }


});
export default model('Post', PostSchema);
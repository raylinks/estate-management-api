import {Schema, model} from 'mongoose';


let LocationSchema = new Schema({
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
        default:'',
        required:true
    },
    developer:{
        type:String,
        default:'',
        required:true
    },
    plot_size:{
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
    amount:{
        type:String,
        default:'',
        required:true
    },
    bonus:{
        type:String,
        default:''
    }

});
export default model('Location', LocationSchema);
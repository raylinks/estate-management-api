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
        required:true
    },
    developer:{
        type:String,
        required:true
    },
    plot_size:{
        type:String,
        required:true
    },
    slug:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    amount:{
        type:String,
        required:true
    },
    bonus:{
        type:String,
        required:true
    },
    image:{
        type:String,
        //required:true
    },
    

});
export default model('Location', LocationSchema);
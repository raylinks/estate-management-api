import {Schema, model} from 'mongoose';


let EstatedevSchema = new Schema({
    createdAt: Date,
    updatedAt: Date,
    // timestamp:{
    //     type: Date,
    //     default:Date.now
    // },
     location_id:[{
         type:Schema.Types.ObjectId,
         ref:'Location'
    }],

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
export default model('Estatedev', EstatedevSchema);
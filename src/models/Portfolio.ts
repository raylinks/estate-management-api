import {Schema, model} from 'mongoose';


let PortfolioSchema = new Schema({
    createdAt: Date,
    updatedAt: Date,
    // timestamp:{
    //     type: Date,
    //     default:Date.now
    // },
    date:{
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
    details:{
        type:String,
        default:'',
        required:true
    },
    purchase_price:{
        type:String,
        default:'',
        required:true
    },
    current_value:{
        type:String,
        default:'',
        required:true
    },
    featuredImage:{
        type:String,
        default:''
    }


});
export default model('Post', PortfolioSchema);
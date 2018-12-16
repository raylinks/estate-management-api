import {Schema, model} from 'mongoose';


let EstateleagueSchema = new Schema({
    createdAt: Date,
    updatedAt: Date,
    // timestamp:{
    //     type: Date,
    //     default:Date.now
    // },
    product:{
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
    inspection_date:{
        type:String,
        default:'',
        required:true
    },
    
});
export default model('Estateleague', EstateleagueSchema);
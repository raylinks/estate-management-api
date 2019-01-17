import {Schema, model} from 'mongoose';


let BoughtLandSchema = new Schema({
    createdAt: Date,
    updatedAt: Date,
    // timestamp:{
    //     type: Date,
    //     default:Date.now
    // },


    userId:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:'User',
    },
    paymentDate:{
        type:String,
        required:true
    },
    allocation:{
        type:String,
    },
    bonus:{
        type:String,
    },

});

export default model('BoughtLand', BoughtLandSchema);

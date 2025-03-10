import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
content:{
    type:String,
    required: true,
    minLength:1,
    maxLength:1000
},
userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
}
},{
    timestamps: true
})

const messageModel = mongoose.models.Message || mongoose.model("Message",messageSchema)

export default messageModel;
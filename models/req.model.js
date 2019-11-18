const mongoose= require('mongoose');

//Creation schema for  request model to  API 
const recordSchema= mongoose.Schema({
   key:String,
   value:String,
   createdDate:Date,
   counts:{type:Array,"default":[]}
},
{
   //It may help because Mongoose uses this option to automatically add two new fields - createdAt and updatedAt to the schema.
    timestamps:true
})

//Export for using 
module.exports=mongoose.model('Record',recordSchema);
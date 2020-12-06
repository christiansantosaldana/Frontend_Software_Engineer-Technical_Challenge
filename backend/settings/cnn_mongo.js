const mongoose = require('mongoose');
const URI='mongodb://localhost/DB_Local';
mongoose.connect(URI, {useNewUrlParser: true,useUnifiedTopology:true,useFindAndModify:false})
.then((bd)=>{
    console.log(`MONGODB connected`)
})
.catch(err=>{
    console.log(`MONGODB fail connection`,error.message)
});
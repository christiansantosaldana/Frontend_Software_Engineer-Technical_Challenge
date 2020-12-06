const path=require('path');
const express = require('express');
const http=require('http');
const morgan = require('morgan');
const app = express();
const server=http.Server(app);
const bodyParser=require('body-parser');
const cors = require('cors');
app.set('PORT',4000);
app.use(express.static(path.join(__dirname,'..','frontend','build')));
require('./settings/cnn_mongo');
app.disable('x-powered-by');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());
app.use('/api/cliente',require('./routes/index'));
app.use((req,res,next)=>{
    if(req.originalUrl==='/favicon.ico'){
        res.status(204).json({status: true});
    }else{
        res.status(200).sendFile(path.join(__dirname,'..','frontend','build','index.html'))
    }
})
server.listen(app.get('PORT'),function(){
    console.log(`Server running on port ${app.get('PORT')}`)
})
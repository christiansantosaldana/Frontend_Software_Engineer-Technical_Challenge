const mongoose = require('mongoose');
const {Schema} = mongoose;
const Cliente = new Schema({
    _id:mongoose.Types.ObjectId,	
    cedula:String,
    nombres:String,
    apellidoPaterno:String,
    apellidoMaterno:String,
    celular:String,
    direccion:String,
    ingresos:Number,                
    nombreUsuario:String,
    comentario: String,
    tipocredito:{
        id:{type:Number,default:0},
        descripcion:{type:String,default:''}
    },
    status:{
        id:{type:Number,default:1}, //1:Registrado;2:Verificado,3:Aprovado
        descripcion:{type:String,default:'Registrado'},
        resultJudicial:{type:Boolean,default:false},
        resultRegistraduria:{type:Boolean,default:false},    
        calificacion:Number,

    },
    testing:{type:Boolean,default:false}   
},{versionKey:false});
module.exports = mongoose.model('clientes',Cliente,'clientes')
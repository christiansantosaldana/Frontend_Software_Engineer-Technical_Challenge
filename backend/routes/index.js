const express = require('express');
const mongoose  = require('mongoose');
const r = express.Router();
const cliente=require('../models/cliente');
r.get('/select_funnel',async (req,res)=>{        
    let data=await Promise.all([
        cliente.find({}),
        cliente.find({"status.id":{$in:[1.5,2]}}),
        cliente.find({"status.id":3}),
        cliente.find({"status.id":3,"status.calificacion":{$gt:60}})
    ])
    let dataRegistrados={
        total:0,
        cntTipoCreditoPersonal:0,
        cntTipoCreditoInmobiliario:0,
        cntTipoCreditoEducativo:0
    }
    let dataVerificados={
        total:0,
        cntTipoCreditoPersonal:0,
        cntTipoCreditoInmobiliario:0,
        cntTipoCreditoEducativo:0
    }
    let dataCalificados={
        total:0,
        cntTipoCreditoPersonal:0,
        cntTipoCreditoInmobiliario:0,
        cntTipoCreditoEducativo:0
    }
    let dataAprovados={
        total:0,
        cntTipoCreditoPersonal:0,
        cntTipoCreditoInmobiliario:0,
        cntTipoCreditoEducativo:0
    }
    data[0].map(a=>{
        dataRegistrados.total++;
        a.tipocredito.id==1?dataRegistrados.cntTipoCreditoEducativo++:undefined;
        a.tipocredito.id==2?dataRegistrados.cntTipoCreditoInmobiliario++:undefined;
        a.tipocredito.id==3?dataRegistrados.cntTipoCreditoPersonal++:undefined;
    })
    data[1].map(a=>{
        dataVerificados.total++;
        a.tipocredito.id==1?dataVerificados.cntTipoCreditoEducativo++:undefined;
        a.tipocredito.id==2?dataVerificados.cntTipoCreditoInmobiliario++:undefined;
        a.tipocredito.id==3?dataVerificados.cntTipoCreditoPersonal++:undefined;
    })
    data[2].map(a=>{
        dataCalificados.total++;
        a.tipocredito.id==1?dataCalificados.cntTipoCreditoEducativo++:undefined;
        a.tipocredito.id==2?dataCalificados.cntTipoCreditoInmobiliario++:undefined;
        a.tipocredito.id==3?dataCalificados.cntTipoCreditoPersonal++:undefined;
    })
    data[3].map(a=>{
        dataAprovados.total++;
        a.tipocredito.id==1?dataAprovados.cntTipoCreditoEducativo++:undefined;
        a.tipocredito.id==2?dataAprovados.cntTipoCreditoInmobiliario++:undefined;
        a.tipocredito.id==3?dataAprovados.cntTipoCreditoPersonal++:undefined;
    })
    dataVerificados.cntTipoCreditoEducativo=dataVerificados.cntTipoCreditoEducativo+dataCalificados.cntTipoCreditoEducativo
    dataVerificados.cntTipoCreditoInmobiliario=dataVerificados.cntTipoCreditoInmobiliario+dataCalificados.cntTipoCreditoInmobiliario
    dataVerificados.cntTipoCreditoPersonal=dataVerificados.cntTipoCreditoPersonal+dataCalificados.cntTipoCreditoPersonal
    res.send({msg:'success',data:{
        dataRegistrados,
        dataVerificados,
        dataCalificados,
        dataAprovados
    }})
})
r.get('/select_all',async (req,res)=>{     
    let data=await cliente.find();
    res.send({msg:'success',data})
})
r.get('/delete_all',async (req,res)=>{     
    let data=await cliente.deleteMany({testing:true});
    res.send({msg:'success',data})
})
r.get('/force_delete_all',async (req,res)=>{     
    let data=await cliente.deleteMany({});
    res.send({msg:'success',data})
})
r.post('/select_one',async (req,res)=>{     
    let data=await cliente.find({cedula:req.body.cedula});
    if(data.length!=0){
        res.send({success:true,msg:'success',modelo:data[0]})
    }else{
        res.send({success:false,msg:'success',modelo:{}})
    }
})
r.post('/verificar',async (req,res)=>{    
    let {cedula,resultJudicial,resultRegistraduria}=req.body;
    let status={
        id:(resultRegistraduria&&resultJudicial)?2:1.5,
        descripcion:(resultRegistraduria&&resultJudicial)?'Verificación completa':'Verificación parcial',
        resultJudicial,
        resultRegistraduria
    }
    let findCedula=await cliente.find({cedula});
    if(findCedula.length){
        findCedula=findCedula[0];
        if(findCedula.status.id<2){
            let clienteUpdated=await cliente.findByIdAndUpdate(findCedula._id,{$set:{"status":status}}); 
            let clienteSaved=await cliente.findById(findCedula._id);
            res.send({success:true,clienteEncontrado:true,modelo:clienteSaved})
        }else{
            res.send({
                success:false,
                clienteEncontrado:true,
                modelo:findCedula
            })
        }
    }else{
        res.send({
            success:false,
            clienteEncontrado:false
        })
    }
    // let cedula=req.body.cedula; 
    // let resultJudicial=req.body.resultJudicial;
    // let resultRegistraduria=req.body.resultRegistraduria;
    // let status={}
    // if(resultJudicial&&resultRegistraduria){
    //     status={
    //         id:2,
    //         descripcion:"Verificación completa"
    //     }
    // }else{
    //     status={
    //         id:1.5,
    //         descripcion:"Verificación parcial"
    //     }
    // }
    // let data=await cliente.find({cedula});    
    // if(data.length!=0){
    //     if(data[0].status.id<2){
    //         let clienteUpdated=await cliente.findByIdAndUpdate(data[0]._id,{$set:{"status":status}}); 
    //         let clienteSaved=await cliente.findById(data[0]._id);
    //         res.send({success:true,clienteEncontrado:true,currentStatusId:clienteSaved.status.id})           
    //     }else{
    //         let clienteSaved=await cliente.findById(data[0]._id);
    //         res.send({success:false,clienteEncontrado:true,currentStatusId:clienteSaved.status.id})
    //     }
       
    // }else{
    //     res.send({success:false,clienteEncontrado:false})
    // }
})
r.post('/calificar',async (req,res)=>{  
    let {cedula}=req.body;
    let status={
        id:3,
        descripcion:'Calificado',
        calificacion:randomNumber(),
    }
    let findCedula=await cliente.find({cedula});
    if(findCedula.length){
        findCedula=findCedula[0];
        if(findCedula.status.id==2){
            let clienteUpdated=await cliente.findByIdAndUpdate(findCedula._id,{$set:{"status.id":status.id,"status.descripcion":status.descripcion,"status.calificacion":status.calificacion}}); 
            let clienteSaved=await cliente.findById(findCedula._id);
            res.send({success:true,clienteEncontrado:true,modelo:clienteSaved})
        }else{           
            res.send({
                success:false,
                clienteEncontrado:true,
                modelo:findCedula
            })
        }
    }else{
        res.send({
            success:false,
            clienteEncontrado:false
        })
    }  
    // let cedula=req.body.cedula; 
    // let data=await cliente.find({cedula});    
    // if(data.length!=0){
    //     if(data[0].status.id==2||data[0].status.id==3){
    //         if(data[0].status.id==2){
    //             let clienteUpdated=await cliente.findByIdAndUpdate(data[0]._id,{$set:{"status.id":3,"status.descripcion":"Calificado","calificacion":randomNumber()}});
    //         }            
    //         let clienteSaved=await cliente.findById(data[0]._id);
    //         res.send({success:true,clienteEncontrado:true,modelo:clienteSaved})
    //     }else{

    //         res.send({success:false,clienteEncontrado:true,currentStatusId:data[0].status.id})
    //     }
    // }else{
    //     res.send({success:false,clienteEncontrado:false})
    // }
})
r.post('/save',async (req,res)=>{
    let modelo=req.body.modelo;
    const newCliente= new cliente({
        _id:mongoose.Types.ObjectId(), 
        ...modelo       
    })
    const modeloSaved = await newCliente.save();
    res.send({msg:'success',modelo:modeloSaved})
})
r.post('/validar-cedula',async (req,res)=>{
    let cedula=req.body.cedula;
    let result=await cliente.find({cedula});
    if(result.length==0){
        res.send({msg:'success',repetido:false})
    }else{
        res.send({msg:'success',repetido:true});
    }
})
function randomNumber(min=0,max=100){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
module.exports = r
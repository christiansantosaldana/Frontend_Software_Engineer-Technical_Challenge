import React from 'react';
import axios from 'axios';
function randomBoolean(){
    return Boolean(Math.random() < 0.5)
}
class verificaciones extends React.Component{
    constructor(props){
        super(props);
        this.state={
            resultRegistraduria:null,
            resultJudicial:null,
            cedulaEncontrada:false,
            clienteEncontrado:false,
            currentStatusId:null,
            message:{
                type:0,
                msg:null
            }
        }
        this.refCedula=React.createRef();
    }
    async handleKeyDown(e){
        let targetValue=this.refCedula.current.value;
        if(targetValue.length>6){   
            let resultRegistraduria=randomBoolean();
            let resultJudicial=randomBoolean();              
            let result=await axios.post('http://localhost:4000/api/cliente/verificar',{cedula:targetValue,resultRegistraduria,resultJudicial}); 
            let {success,modelo,clienteEncontrado}=result.data;
          
            if(success){
                await this.setState({
                    resultJudicial,
                    resultRegistraduria,
                    cedulaEncontrada:true,
                    message:{
                        type:modelo.status.id>=2?1:null,
                        msg:modelo.status.id>=2?'':`Verificación incompleta${!modelo.status.resultJudicial?', no se puede verificar por que posee antecedentes judiciales':''}${!modelo.status.resultRegistraduria?', no se puede verificar por que no se encuentra registrado en registraduria':''}`
                    }
                })  
            }else{ 
                if(clienteEncontrado){
                    await this.setState({
                        resultJudicial:modelo.status.id>=2?true:resultJudicial,
                        resultRegistraduria:modelo.status.id>=2?true:resultRegistraduria,
                        cedulaEncontrada:true,
                        message:{
                            type:modelo.status.id>=2?1:null,
                            msg:modelo.status.id>=2?'Verificado previamente':`Verificación incompleta${!modelo.status.resultJudicial?', no se puede verificar por que posee antecedentes judiciales':''}${!modelo.status.resultRegistraduria?', no se puede verificar por que no se encuentra registrado en registraduria':''}`
                        }
                        //clienteEncontrado:clienteEncontrado
                    })
                }else{
                    await this.setState({
                        resultJudicial,
                        resultRegistraduria,
                        cedulaEncontrada:true,
                        message:{
                            type:0,
                            msg:null
                        }
                    }) 
                }
                
            }                    
                    
        }else{
            alert('Ingresar cédula mayor a 6 digitos')
        }
    };
    async handleClickCalificar(){       
        let targetValue=this.refCedula.current.value;
        let result=await axios.post('http://localhost:4000/api/cliente/calificar',{cedula:targetValue}); 
        let {success,modelo,clienteEncontrado}=result.data;       
        if(success){
            //alert('Calificado correctamente')
            this.props.history.push({
                pathname: '/CalificacionInterna',
                state: { modelo }
            })
        }else{
            if(clienteEncontrado){                
                if(modelo.status.id===3){
                    this.props.history.push({
                        pathname: '/CalificacionInterna',
                        state: { modelo }
                    })
                }else{
                    await this.setState({
                        message:{
                            type:0,
                            msg:`Verificación incompleta${!modelo.status.resultJudicial?', antecedentes judiciales no verificada':''}${!modelo.status.resultRegistraduria?', registraduria no verificada':''}`
                        }
                    })
                }
            }else{
                await this.setState({
                    message:{
                        type:0,
                        msg:'Cédula no registrada en clientes'
                    }
                })
                //alert('Cedula aun no fue registrada en clientes.')
            }
        }
    };
    async handleClickClean(e){
        await this.setState({resultJudicial:null,resultRegistraduria:null,cedulaEncontrada:false,message:{type:0,msg:''}});        
    }
    render(){
        return(
            <div >            
            <h3>Verificaciones</h3>
            <div className="buscadorCedula">
                <input ref={this.refCedula} placeholder="Ingresar cédula" disabled={this.state.cedulaEncontrada}/>
                <button name="btnVerificar" onClick={this.handleKeyDown.bind(this)} disabled={this.state.cedulaEncontrada}>Verificar</button>
            </div>             
            <div className="container-verificacion">
                <div className="verificacion-descripcion">Verificación existencia en registraduria</div>
                <div  className={`verificacion-resultado ${typeof this.state.resultRegistraduria=='boolean'?(this.state.resultRegistraduria?'verificacion-success':'verificacion-warning'):''}`}>{typeof this.state.resultRegistraduria=='boolean'?(this.state.resultRegistraduria?'La persona se encuentra registrado en registraduria':'La persona no se encuentra registrado en registraduria'):'No se ha ingresado cédula'}</div>
            </div>
            <div className="container-verificacion">
                <div className="verificacion-descripcion">Verificación de antecedentes judiciales</div>
                <div className={`verificacion-resultado ${typeof this.state.resultJudicial=='boolean'?(this.state.resultJudicial?'verificacion-success':'verificacion-warning'):''}`}>{typeof this.state.resultJudicial=='boolean'?(this.state.resultJudicial?'La persona no posee antecedentes':'La persona posee antecedentes'):'No se ha ingresado cédula'}</div>
            </div> 
            {this.state.message.msg?<div className={`message ${this.state.message.type?'message-success':'message-warning'}`}>{this.state.message.msg}</div>:null}
            {this.state.cedulaEncontrada?<div>
               <button name="btnNuevaVerificacion" onClick={this.handleClickClean.bind(this)}>Nueva verificación</button>   
               <button name="btnPasarCalificacion" onClick={this.handleClickCalificar.bind(this)}>Pasar a calificación</button>
            </div>  
            :null} 

        </div>
        )
    }
}
export default verificaciones

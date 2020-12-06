import React from 'react';
import axios from 'axios';
class calificacionInterna extends React.Component{
    constructor(props){
        super(props);
        this.state={
            modelo:null,
            cedulaEncontrada:false,
            message:{
                type:0,
                msg:null
            }
        };
        this.refCedula=React.createRef();
    }
    async componentDidMount(){
       if(this.props.location?.state?.modelo){
           await this.setState({modelo:this.props.location.state.modelo})
       }
    }
    async handleClickCalificar(){        
        // let targetValue=this.refCedula.current.value;
        // let result=await axios.post('http://localhost:4000/api/cliente/calificar',{cedula:targetValue});        
        // if(result.data.success){            
       
        // }else{
        //     if(result.data.clienteEncontrado){                
        //         alert('Sin verificación completa')
        //     }else{
        //         alert('Cedula aun no fue registrada en clientes.')
        //     }
        // }
        let targetValue=this.refCedula.current.value;
        let result=await axios.post('http://localhost:4000/api/cliente/calificar',{cedula:targetValue}); 
        let {success,modelo,clienteEncontrado}=result.data;       
        if(success){
            //alert('Calificado correctamente')
            await this.setState({
                modelo:result.data.modelo,
                message:{
                    type:0,
                    msg:null
                }
            })
        }else{
            if(clienteEncontrado){                
                if(modelo.status.id===3){
                    await this.setState({
                        modelo:result.data.modelo,
                        message:{
                            type:0,
                            msg:null
                        }
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
                    modelo:null,
                    message:{
                        type:0,
                        msg:'Cédula no registrada en clientes'
                    }
                })
                //alert('Cedula aun no fue registrada en clientes.')
            }
        }
    };
    render(){
        return(
            <div>
            <h3>Calificación Interna</h3>
            <div className="buscadorCedula">
                <input ref={this.refCedula} placeholder="Ingresar cédula" disabled={this.state.cedulaEncontrada}/>
                <button onClick={this.handleClickCalificar.bind(this)} disabled={this.state.cedulaEncontrada}>Calificar</button>
            </div> 
            {!this.state.modelo?<small>Main page</small>:
                <div className="container_calificado">
                    <div className="calificado_datos" style={{fontSize:'1.5em',fontWeight:'bold'}}>                       
                        {`${this.state.modelo.status.calificacion>60?'[Aprovado]':'[Rechazado]'} - ${this.state.modelo.nombres} ${this.state.modelo.apellidoPaterno} ${this.state.modelo.apellidoMaterno}`}                                                     
                    </div>
                    <CalificacionRange modelo={this.state.modelo} />
                </div>
            }
            {this.state.message.msg?<div className={`message ${this.state.message.type?'message-success':'message-warning'}`}>{this.state.message.msg}</div>:null}

        </div>
        )
    }
}
class CalificacionRange extends React.Component{
    constructor(props){
        super(props);
        this.state={

        }
        this.refInput=React.createRef();
    }
    render(){
        let modelo=this.props.modelo||{};
        return(
            <div style={{marginTop:'70px'}}>
               
                <div className="clasificacion-range">
                    <span style={{marginLeft:'auto'}}>0</span>
                    <div className="clasificacion-valor">
                        <div style={{left: `calc(${modelo.status.calificacion||0}% - 80px)`}}>
                            <div  className={` ${modelo.status.calificacion>60?'valor-aprovado':'valor-rechazado'}`}>{modelo.status.calificacion}</div>                             
                            <div><i className="fas fa-chevron-down"></i></div>                         
                        </div>
                        <div className="limite-apovado">
                            <span><i className="fas fa-grip-lines-vertical"></i></span>
                            <span>60</span>
                            <div>{`Limite\npara aprobar`}</div>
                        </div> 
                        <input readOnly={true} ref={this.refInput} className={`calificacion-range ${modelo.status.calificacion>60?'range-aprovado':'range-rechazado'}`} type="range" min="0" max="100" value={modelo.status.calificacion} onChange={()=>{}}/>
                    </div>
                    <span style={{marginRight:'auto'}}>100</span>
                </div>
            </div>
           
        )
    }
}
export default calificacionInterna

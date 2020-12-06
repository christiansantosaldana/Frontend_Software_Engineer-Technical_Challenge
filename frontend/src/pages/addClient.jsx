import styled from '@emotion/styled';
import React from 'react';
import axios from 'axios';
const Button = styled.button`
    padding: 1rem;
    width:50%;
    margin-top: 1rem;
`
const Header = styled.header`
    font-family: Arial, Helvetica, sans-serif;
    margin-bottom: 10px;
`
const Form = styled.div`
    font-family: Arial, Helvetica, sans-serif;
    display:grid;
    grid-template-columns: 50% 50%;
    gap: 1rem;
    label
    {
    }
    .control
    {
        margin-bottom: 10px;
        label
        {
            display: block;
            margin-bottom: 5px !important;
            grid-row: 1/4;
        }
    }
    input
    {
        padding: .7rem .6rem;
        font-size: 19px;
        border: 0;
        outline: 0;
        flex-grow:1
    }
    .control_button{
        display:flex
    }
    select
    {
        padding: .7rem .6rem;
        font-size: 19px;
        border: 0;
        outline: 0;
        flex-grow:1
    }
`
const TableTipoCreditos=[
    {
        id:1,
        descripcion:'Crédito educativo'
    },
    {
        id:2,
        descripcion:'Crédito inmobiliario'
    },
    {
        id:3,
        descripcion:'Crédito personal'
    }
]
class addClient extends React.Component{
    constructor(props){
        super(props);
        this.modeloCliente={
            cedula:'',
            nombres:'',
            apellidoPaterno:'',
            apellidoMaterno:'',
            celular:'',
            direccion:'',
            ingresos:'',                
            nombreUsuario:'',
            comentario: '',
            tipocredito:{
                id:0,
                descripcion:''
            }
            //clienteValidado:false 
        }
        this.state={
            modeloCliente:Object.assign({},this.modeloCliente),
            message:{
                type:0,
                msg:null
            }
        }
        this.refTesting=React.createRef();
    }
    async resetForm(){
        await this.setState({
            modeloCliente:Object.assign({},this.modeloCliente)
        })
    };
    async submitForm(e){
        e.preventDefault();
        let modeloCliente=this.state.modeloCliente;
        modeloCliente.testing=this.refTesting.current.checked;
        console.log(modeloCliente)
        if(modeloCliente.cedula.length<=6){
            //modeloCliente.clienteValidado=false;
            await this.setState({
                message:{msg:'La cédula debe tener mas de 6 digitos',type:1}
            })
            return
        }  
        let validacion=true;
        for (const key in modeloCliente) {
            if (modeloCliente.hasOwnProperty(key)) {
                const element = modeloCliente[key];
                if(key!=='comentario'&&key!=='tipocredito'&&key!='testing'){
                    if(!element){
                        validacion=false;
                        break
                    }
                }else{
                    if(key==='tipocredito'){
                        if(!element.id){
                            validacion=false;
                            break
                        }
                    }
                }
            }
        }
        if(!validacion){
            await this.setState({
                message:{msg:`Faltan llenar campos obligatorios`,type:1}
            })
            return
        }
        let repetido=await axios.post('http://localhost:4000/api/cliente/validar-cedula',{cedula:this.state.modeloCliente.cedula});
        if(repetido.data.repetido){
            await this.setState({
                message:{msg:'La cédula ya fue ingresada',type:1}
            })
        }else{
            let result=await axios.post('http://localhost:4000/api/cliente/save',{modelo:this.state.modeloCliente});
            await this.setState({
                modeloCliente:Object.assign({},this.modeloCliente),
                message:{msg:`${result.data.modelo.nombres} - Guardado correctamente`,type:0}
            })
        }
        //console.log(result)
    };
    async handleChange(e){
        let targetName=e.target.name;
        let targetValue=e.target.value;
        let modeloCliente=this.state.modeloCliente;
        console.log(targetName,targetValue)
        if(targetName==='tipocredito'){
            modeloCliente[targetName]=TableTipoCreditos.find(a=>parseInt(a.id)===parseInt(targetValue))||{id:0,descripcion:''};
        }else{
            modeloCliente[targetName]=targetValue;
        }       
        await this.setState({modeloCliente});
    };
    async validarCliente(){
        let modeloCliente=this.state.modeloCliente;
        if(modeloCliente.cedula.length<6){
            modeloCliente.clienteValidado=false;
            alert('La cédula ingresada es menor de 6 digitos')
        }else{
            modeloCliente.clienteValidado=(modeloCliente.cedula==='123'?false:true); 
        }            
        await this.setState({modeloCliente})
    };
    async limpiarCliente(){
        let modeloCliente=this.state.modeloCliente;
        modeloCliente.cedula='';
        modeloCliente.clienteValidado=false;       
        await this.setState({modeloCliente,message:{msg:null,type:0}})
    };
    render(){
        return(
            <div >               
                <div className="form_container">
                    <form style={{padding:'3rem'}} onSubmit={this.submitForm.bind(this)}>
                        <Header>
                            NUEVO CLIENTE
                        </Header>
                        <Form>
                            <div className="control" style={{display:'none'}}>
                                <label className="control-obligatorio">Cédula</label>
                                <div className="control_button" >
                                    <input ref={this.refTesting} type="checkbox" name="testing" defaultChecked={false}/>
                                </div>
                            </div>
                            <div className="control">
                                <label className="control-obligatorio">Cédula</label>
                                <div className="control_button" >
                                    <input autoComplete="off" name="cedula" value={this.state.modeloCliente.cedula} onChange={this.handleChange.bind(this)} disabled={this.state.modeloCliente.clienteValidado} onKeyDown={(e)=>{if(e.keyCode===13){e.preventDefault()}}}/>
                                </div>
                            </div>
                            <div className="control">
                                <label className="control-obligatorio">Nombres</label>
                                <div className="control_button" >
                                    <input autoComplete="off" name="nombres" value={this.state.modeloCliente.nombres} onChange={this.handleChange.bind(this)} onKeyDown={(e)=>{if(e.keyCode===13){e.preventDefault()}}}/>                                  
                                </div>
                            </div>
                            <div className="control">
                                <label className="control-obligatorio">Apellido Paterno</label>
                                <div className="control_button" >
                                    <input autoComplete="off" name="apellidoPaterno" value={this.state.modeloCliente.apellidoPaterno} onChange={this.handleChange.bind(this)} onKeyDown={(e)=>{if(e.keyCode===13){e.preventDefault()}}}/>                                  
                                </div>
                            </div>
                            <div className="control">
                                <label className="control-obligatorio">Apellido Materno</label>
                                <div className="control_button" >
                                    <input autoComplete="off" name="apellidoMaterno" value={this.state.modeloCliente.apellidoMaterno} onChange={this.handleChange.bind(this)} onKeyDown={(e)=>{if(e.keyCode===13){e.preventDefault()}}}/>                                  
                                </div>
                            </div>
                            <div className="control">
                                <label className="control-obligatorio">Celular</label>
                                <div className="control_button" >
                                    <input autoComplete="off" name="celular" value={this.state.modeloCliente.celular} onChange={this.handleChange.bind(this)} onKeyDown={(e)=>{if(e.keyCode===13){e.preventDefault()}}}/>                                  
                                </div>
                            </div>
                            <div className="control">
                                <label className="control-obligatorio">Dirección</label>
                                <div className="control_button" >
                                    <input autoComplete="off" name="direccion" value={this.state.modeloCliente.direccion} onChange={this.handleChange.bind(this)} onKeyDown={(e)=>{if(e.keyCode===13){e.preventDefault()}}}/>                                  
                                </div>
                            </div>
                            <div className="control">
                                <label className="control-obligatorio">Ingresos</label>
                                <div className="control_button" >
                                    <input autoComplete="off" name="ingresos" value={this.state.modeloCliente.ingresos} onChange={this.handleChange.bind(this)} type="number" step="any " onKeyDown={(e)=>{if(e.keyCode===13){e.preventDefault()}}}/>                                  
                                </div>
                            </div>
                            <div className="control">
                                <label className="control-obligatorio">Usuario registrador</label>
                                <div className="control_button" >
                                    <input autoComplete="off" name="nombreUsuario" value={this.state.modeloCliente.nombreUsuario} onChange={this.handleChange.bind(this)} onKeyDown={(e)=>{if(e.keyCode===13){e.preventDefault()}}}/>                                  
                                </div>
                            </div>
                            <div className="control">
                                <label>Tipo de crédito</label>
                                <div className="control_button" >
                                    <select autoComplete="off" name="tipocredito" value={this.state.modeloCliente.tipocredito.id} onChange={this.handleChange.bind(this)}>                                  
                                        <option value="0">--Seleccionar--</option>
                                        {TableTipoCreditos.map((a,ind)=>{
                                            return <option key={ind} value={a.id}>{a.descripcion}</option>
                                        })}
                                    </select>
                                </div>
                            </div>
                            <div className="control">
                                <label>Comentario</label>
                                <div className="control_button" >
                                    <input autoComplete="off" name="comentario" value={this.state.modeloCliente.comentario} onChange={this.handleChange.bind(this)} onKeyDown={(e)=>{if(e.keyCode===13){e.preventDefault()}}}/>                                  
                                </div>
                            </div>
                        </Form>
                        <div style={{color:'lightyellow'}}>* Campo obligatorio</div>
                        {this.state.message.msg?<div className={`message ${!this.state.message.type?'message-success':'message-warning'}`}>{this.state.message.msg}</div>:null}
                        <footer>
                            <Button type="reset" onClick={this.resetForm.bind(this)}>CANCELAR</Button>
                            <Button type="submit">GUARDAR</Button>
                        </footer>                        
                    </form>

                </div>
            </div>
        )
    }
}
export default addClient

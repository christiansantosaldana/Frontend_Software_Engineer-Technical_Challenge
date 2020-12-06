import React from 'react'
import FunnelGraph from 'funnel-graph-js';
import 'funnel-graph-js/dist/css/main.min.css';
import 'funnel-graph-js/dist/css/theme.min.css';
import Chart from 'chart.js';
import axios from 'axios';
//console.log(FunnelGrapJS)
class MainPage extends React.Component{
    constructor(props){
        super(props);
        this.state={
            clienteBuscado:null
        };
        this.dataChart=[];   
        this.refPieChart=React.createRef();   
        this.refCedulaCliente=React.createRef();  
    }
    async handleKeyDown(e){
        if(e.keyCode===13){
            let targetValue=e.target.value;
            if(targetValue.length>6){              
                let clienteBuscado=await axios.post('http://localhost:4000/api/cliente/select_one',{cedula:targetValue});
                if(clienteBuscado.data.success){
                    this.setState({
                        clienteBuscado:clienteBuscado.data.modelo
                    })
                }else{
                    alert('No se encontro cliente de cedula '+targetValue)
                }
              
            }else{
                alert('Ingresar cédula mayor a 6 digitos')
            }
        }
       
    }
    async cleanClienteBuscado(e){
        await this.setState({clienteBuscado:null});
        this.refCedulaCliente.current.value='';
        this.refCedulaCliente.current.focus();
    }
    async componentDidMount(){
        let dataFunnel=await axios.get('http://localhost:4000/api/cliente/select_funnel');   
        dataFunnel=dataFunnel.data.data;  
       
        let values=[
            [dataFunnel.dataRegistrados.cntTipoCreditoEducativo||0, dataFunnel.dataRegistrados.cntTipoCreditoInmobiliario, dataFunnel.dataRegistrados.cntTipoCreditoPersonal],
            [dataFunnel.dataVerificados.cntTipoCreditoEducativo, dataFunnel.dataVerificados.cntTipoCreditoInmobiliario, dataFunnel.dataVerificados.cntTipoCreditoPersonal],
            [dataFunnel.dataCalificados.cntTipoCreditoEducativo, dataFunnel.dataCalificados.cntTipoCreditoInmobiliario, dataFunnel.dataCalificados.cntTipoCreditoPersonal],
            [dataFunnel.dataAprovados.cntTipoCreditoEducativo, dataFunnel.dataAprovados.cntTipoCreditoInmobiliario, dataFunnel.dataAprovados.cntTipoCreditoPersonal],
        ];
        console.log(values);
        var graph = new FunnelGraph({
            container: '.funnel',
            gradientDirection: 'horizontal',
            data: {
                labels: ['Ingresados', 'Verificados', 'Calificados','Aprobados'],
                subLabels: ['Crédito Educativo', 'Crèdito Inmobiliario', 'Crédito Personal'],
                colors: [
                    ['#4DF3E6', '#FF78B1', '#FF3C8E','#4DF3E6'],
                    ['#4AB2CD','#76D7C4','#D1F2EB','#4DF3E6'], 
                    ['#4DCBF3','#357BFF','#357BFF','#4DF3E6'],
                    []
                ],
                values
            },
            displayPercent: true,
            direction: 'horizontal'
        });
        graph.draw();
        /* var myChart = new Chart(this.refPieChart.current, {
            type: 'pie',
            data:{
                datasets: [{
                    data: [580, 20],
                    hoverBackgroundColor:['blue','red'],
                    backgroundColor:['lightblue','lightred']
                }],
                labels: [
                    'Ingresados',
                    'Rechazados'
                ]
            },
            options: Chart.defaults.pie
        }); */
        //console.log(this.refPipeline)
    }
    render(){
        return(
            <div style={{width:"100%"}}>
                <div className="funnelTitle">Funnel de ventas</div>            
                <div id="funnel" className="funnel">
                </div> 
                <div style={{display:'flex'}}>
                    <div className="ClientesPotenciales" style={{flexGrow:1,height:'10px',fontSize:'9px',textAlign:'center',padding:'3px'}}>Clientes potenciales</div>
                    <div className="Prospectos" style={{flexGrow:1,height:'10px',fontSize:'9px',textAlign:'center',padding:'3px'}}>Prospectos de venta</div>
                </div>
                <div style={{display:'flex',justifyContent:'space-between',marginTop:'30px'}}>
                    <div style={{width:'300px',height:'1vh',margin:'auto'}}>
                        <canvas ref={this.refPieChart} height={220}></canvas>
                    </div>                    
                </div>
                <div className="buscadorCliente">
                    <input ref={this.refCedulaCliente} placeholder="Buscar cliente por cedula" onKeyDown={this.handleKeyDown.bind(this)}/>
                </div>               
                {this.state.clienteBuscado?
                    <div className="tarjetaCliente">
                        <header>
                            <div>
                               {`[${this.state.clienteBuscado.status.descripcion}] ${this.state.clienteBuscado.cedula} - ${this.state.clienteBuscado.nombres} ${this.state.clienteBuscado.apellidoPaterno} ${this.state.clienteBuscado.apellidoMaterno}`}                            
                            </div>  
                            <div onClick={this.cleanClienteBuscado.bind(this)}>
                                Limpiar
                            </div>
                        </header> 
                        <section style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr'}}>
                            <div className="datosCliente">
                                <span>Celular</span>
                                <div>{this.state.clienteBuscado.celular}</div>
                            </div>
                            <div className="datosCliente">
                                <span>Dirección</span>
                                <div>{this.state.clienteBuscado.direccion}</div>
                            </div> 
                            <div className="datosCliente">
                                <span>Ingresos</span>
                                <div>{this.state.clienteBuscado.ingresos}</div>
                            </div> 
                            <div className="datosCliente">
                                <span>Usuario Registrador</span>
                                <div>{this.state.clienteBuscado.nombres}</div>
                            </div>
                            <div className="datosCliente">
                                <span>Calificacion</span>
                                <div style={{color:'dodgerblue'}}>{this.state.clienteBuscado.status?.calificacion>60?'Aprovado':'Rechazado'}</div>
                            </div> 
                        </section>                                                                 
                    </div>
                :
                    <div className="tarjetaCliente tarjetaBloqueada">
                        <header>
                            <div>
                               {`[ESTADO] CÉDULA - NOMBRE COMPLETO DEL CLIENTE`}                            
                            </div>  
                            <div>
                                Limpiar
                            </div>
                        </header>                          
                        <section style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr'}}>
                            <div className="datosCliente">
                                <span>Celular</span>
                                <div>_______________</div>
                            </div>
                            <div className="datosCliente">
                                <span>Dirección</span>
                                <div>_______________</div>
                            </div> 
                            <div className="datosCliente">
                                <span>Ingresos</span>
                                <div>_______________</div>
                            </div> 
                            <div className="datosCliente">
                                <span>Usuario Registrador</span>
                                <div>_______________</div>
                            </div>
                            <div className="datosCliente">
                                <span>Calificacion</span>
                                <div style={{color:'dodgerblue'}}>_______________</div>
                            </div> 
                        </section>                                           
                    </div>                
                }
            </div>
        )
    }
}
export default MainPage

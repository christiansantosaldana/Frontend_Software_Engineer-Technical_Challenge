/// <reference types="cypress" />
console.log('ejecutandose add_client')
const buildClient= require('./buildClient');
function randomNumber(min=0,max=100){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function fillClientForm(client) {
  cy.get('input[name="nombres"]').type(client.nombre);
  cy.get('input[name="cedula"]').type(client.cedula);
  cy.get('input[name="apellidoPaterno"]').type(client.apellidoPaterno);
  cy.get('input[name="apellidoMaterno"]').type(client.apellidoMaterno);
  cy.get('input[name="celular"]').type(client.celular);
  cy.get('input[name="direccion"]').type(client.direccion);
  cy.get('input[name="ingresos"]').type(client.ingresos);
  cy.get('input[name="nombreUsuario"]').type(client.nombreUsuario);
  cy.get('input[name="comentario"]').type(client.comentario);
  cy.get('select[name="tipocredito"]').select(client.tipoCredito.descripcion);
  cy.get('input[name="testing"]').then(elem=>{
    elem.prop('checked',true);
  });
}

describe('fillBD', () => {
  beforeEach(() => {
    cy.request({
      url: 'http://localhost:4000/api/cliente/delete_all',
      method: 'GET',
    });
  });
  it('Llenar bd de clientes test', () => {
    var genArr =[1,2,3,4,5];
    const newClient = buildClient();
    cy.wrap(genArr).each((index) => {
        let randomIdStatus=randomNumber(1,3)
        cy.request({
            url: 'http://localhost:4000/api/cliente/save',
            method: 'POST',
            body: {
                modelo: {
                    ...newClient,
                    cedula:newClient.cedula+'00'+index,
                    nombres:newClient.nombres+'_'+index,
                    status:{
                        id:randomIdStatus,
                        descripcion:randomIdStatus==1?'Registrado':randomIdStatus==2?'Verificado':'Calificado',
                        calificacion:randomNumber(),
                        resultJudicial:true,
                        resultRegistraduria:true     
                    }
                },
            },
          });
        });
    })
    
});

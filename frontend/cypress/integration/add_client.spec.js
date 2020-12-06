/// <reference types="cypress" />
console.log('ejecutandose add_client')
const buildClient= require('./buildClient');

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

describe('Add client page', () => {
  beforeEach(() => {
    cy.request({
      url: 'http://localhost:4000/api/cliente/delete_all',
      method: 'GET',
    });
  });

  it('debería mostrar un mensaje de error si la cedula es menor o igual a 6 caracteres', () => {
    cy.visit('/AddClient');

    const client = buildClient({ cedula: '123' });

    fillClientForm(client);

    cy.get('[type="submit"]').click();

    cy.get('div.message-warning').should('be.visible');
  });

  it('debería crear un cliente si los datos estan correctos', () => {
    cy.visit('/AddClient');

    const client = buildClient();

    fillClientForm(client);

    cy.get('[type="submit"]').click();

    cy.get('div.message-success').should('be.visible');
  });
});

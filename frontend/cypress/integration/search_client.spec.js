/// <reference types="cypress" />

const buildClient= require('./buildClient');

describe('Search a client', () => {
  it('debería mostrar los datos de un cliente si este ya existe', () => {
    const newClient = buildClient();

    cy.request({
      url: 'http://localhost:4000/api/cliente/save',
      method: 'POST',
      body: {
        modelo: newClient,
      },
    });

    cy.visit('/Home');

    cy.get('input[placeholder="Buscar cliente por cedula"]').type(
      `${newClient.cedula}{enter}`,
      {
        force: true,
      }
    );

    cy.get('header > :nth-child(1)').should(
      'contain.text',
      `${newClient.cedula} - ${newClient.nombre}`
    );
  });
});

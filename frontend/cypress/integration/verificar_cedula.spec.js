/// <reference types="cypress" />

const buildClient= require('./buildClient');

describe('Verify a cedula', () => {
beforeEach(() => {
    cy.request({
        url: 'http://localhost:4000/api/cliente/delete_all',
        method: 'GET',
    });
    });
  it('debería mostrar la verificación de la cédula', () => {
    const newClient = buildClient();

    cy.request({
      url: 'http://localhost:4000/api/cliente/save',
      method: 'POST',
      body: {
        modelo: newClient,
      },
    });

    cy.visit('/Verificaciones');

    cy.get('input[placeholder="Ingresar cédula"]').type(
      `${newClient.cedula}`,
      {
        force: true,
      }
    );
    cy.get('[name="btnVerificar"]').click();
    cy.get('[name="btnNuevaVerificacion"]').should('be.visible');
  });
  it('deberia restringir la calificación de cedulas no registradas', () => {     
    cy.visit('/Verificaciones');
    cy.get('input[placeholder="Ingresar cédula"]').type(
      `98765432100`      
    );
    cy.get('[name="btnVerificar"]').click();
    cy.get('[name="btnPasarCalificacion"]').should('be.visible');
    cy.get('[name="btnPasarCalificacion"]').click();
    cy.get('div.message').should(
        'contain.text',
        `Cédula no registrada en clientes`
      );
  });
  it('Calificar a clientes con verificaciones positivas o previamente calificadas', () => { 
    const newClient = buildClient();
    cy.request({
      url: 'http://localhost:4000/api/cliente/save',
      method: 'POST',
      body: {
        modelo: {
            ...newClient,
            status:{
                id:3,
                descripcion:'Calificado',
                calificacion:80,
                resultJudicial:true,
                resultRegistraduria:true     
            }
        },
      },
    });
    cy.visit('/Verificaciones');
    cy.get('input[placeholder="Ingresar cédula"]').type(
        `${newClient.cedula}`       
    );
    cy.get('[name="btnVerificar"]').click();
    cy.get('[name="btnPasarCalificacion"]').should('be.visible');
    cy.get('[name="btnPasarCalificacion"]').click();
    cy.get('[href="/CalificacionInterna"]').should(
        'satisfy',
        ($el)=>{
            const classList = Array.from($el[0].classList); 
            return classList.includes('rowActive')
        }
      );
  });
});

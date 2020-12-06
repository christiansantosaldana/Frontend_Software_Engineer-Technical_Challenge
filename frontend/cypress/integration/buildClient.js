export default function buildClient(overrrides) {
    return {
      cedula: '123123123',
      nombre: 'Fake name',
      apellidoPaterno: 'Apellido Paterno',
      apellidoMaterno: 'Apellido Materno',
      celular: '123123123',
      direccion: 'Direccion',
      ingresos: '200',
      nombreUsuario: 'Nombre usuario',
      comentario: 'Comentario',
      tipocredito: {
        id:1,
        descripcion:'Crédito educativo'
      },
      testing:true,
      ...overrrides,
    };
}
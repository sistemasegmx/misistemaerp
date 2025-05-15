// addCatalogos.js
const fs = require('fs');
const path = require('path');

// 1) Lista de controladores (sin la palabra "Controller" y en minúsculas)
const controllers = [
  'prospect',
  'customer',
  'contact',
  'supplier',
  'employee',
  'salesperson',
  'distributor',
  'carrier',
  'partner',
  'affiliate',
  'manufacturer',
  'advisor',
  'institution'
];

// 2) Definición de los endpoints por controlador
const endpoints = [
  { method: 'GET',    segments: [] },
  { method: 'GET',    segments: ['paginated'] },
  { method: 'GET',    segments: ['filtered'] },
  { method: 'GET',    segments: ['listByColumn'] },
  { method: 'GET',    segments: ['getone'] },
  { method: 'GET',    segments: ['preByLike'] },
  { method: 'POST',   segments: [] },
  { method: 'PUT',    segments: [] },
  { method: 'PATCH',  segments: [] },
  { method: 'DELETE', segments: [] },
];

// 3) Carga la colección
const fileIn  = path.join(__dirname, 'Mi Sistema ERP.postman_collection-15-05-2025.json');
const fileOut = path.join(__dirname, 'Mi Sistema ERP.actualizada.json');

console.log('Buscando archivo de colección en:', fileIn);

if (!fs.existsSync(fileIn)) {
  console.error('Error: No se encontró el archivo de colección en:', fileIn);
  process.exit(1);
}

try {
  const collection = JSON.parse(fs.readFileSync(fileIn, 'utf8'));
  console.log('Colección cargada exitosamente');
  console.log('Carpetas encontradas:', collection.item.map(folder => folder.name).join(', '));

  // 4) Busca la carpeta "Catalogos"
  const catalogos = collection.item.find(folder => folder.name === 'Catalogos');
  if (!catalogos) {
    console.error('No se encontró la carpeta "Catalogos". Creando nueva carpeta...');
    // Crear nueva carpeta Catalogos si no existe
    collection.item.push({
      name: 'Catalogos',
      item: []
    });
    const catalogos = collection.item.find(folder => folder.name === 'Catalogos');

    // 5) Genera y añade cada request
    controllers.forEach(ctrl => {
      endpoints.forEach(ep => {
        const fullPath = [ctrl, ...ep.segments];
        const uriPath  = fullPath.join('/');
        catalogos.item.push({
          name: `${ep.method} /${uriPath}`,
          request: {
            method: ep.method,
            header: [],
            url: {
              raw: `{{baseUrl}}/${uriPath}`,
              host: ['{{baseUrl}}'],
              path: fullPath
            }
          },
          response: []
        });
      });
    });

    // 6) Graba la colección actualizada
    fs.writeFileSync(fileOut, JSON.stringify(collection, null, 2), 'utf8');
    console.log(`Colección actualizada guardada como:\n  ${fileOut}`);
  } else {
    console.log('Carpeta "Catalogos" encontrada. Agregando endpoints...');

    // 5) Genera y añade cada request
    controllers.forEach(ctrl => {
      endpoints.forEach(ep => {
        const fullPath = [ctrl, ...ep.segments];
        const uriPath  = fullPath.join('/');
        catalogos.item.push({
          name: `${ep.method} /${uriPath}`,
          request: {
            method: ep.method,
            header: [],
            url: {
              raw: `{{baseUrl}}/${uriPath}`,
              host: ['{{baseUrl}}'],
              path: fullPath
            }
          },
          response: []
        });
      });
    });

    // 6) Graba la colección actualizada
    fs.writeFileSync(fileOut, JSON.stringify(collection, null, 2), 'utf8');
    console.log(`Colección actualizada guardada como:\n  ${fileOut}`);
  }
} catch (error) {
  console.error('Error al procesar la colección:', error.message);
  process.exit(1);
}

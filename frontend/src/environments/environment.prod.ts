export const environment = {
  aToken: 'aToken',
  rToken: 'rTtoken',
  production: true,
  appVersion: 'v2.7',
  baseUrl: 'http://misistemaerp',

  modules: {
    basecurrency: [
      { ccode: 'AED', cname: 'United Arab Emirates Dirham' },
      { ccode: 'ARS', cname: 'Peso Argentino' },
      { ccode: 'AUD', cname: 'Australian Dollar' },
      { ccode: 'BDT', cname: 'Bangladeshi Taka' },
      { ccode: 'BRL', cname: 'Real Brasileño' },
      { ccode: 'CAD', cname: 'Canadian Dollar' },
      { ccode: 'CHF', cname: 'Swiss Franc' },
      { ccode: 'CNY', cname: 'Chinese Renminbi' },
      { ccode: 'COP', cname: 'Peso Colombiano' },
      { ccode: 'DKK', cname: 'Danish Krone' },
      { ccode: 'EGP', cname: 'Egyptian Pound' },
      { ccode: 'EUR', cname: 'Euro' },
      { ccode: 'GBP', cname: 'Libra Esterlina' },
      { ccode: 'GTQ', cname: 'Quetzal Guatemalteco' },
      { ccode: 'HKD', cname: 'Hong Kong Dollar' },
      { ccode: 'IDR', cname: 'Indonesian Rupiah' },
      { ccode: 'ILS', cname: 'Israeli Shekel' },
      { ccode: 'INR', cname: 'Indian Rupee' },
      { ccode: 'KES', cname: 'Kenyan Shilling' },
      { ccode: 'MXN', cname: 'Peso Mexicano' },
      { ccode: 'MYR', cname: 'Malaysian Ringgit' },
      { ccode: 'NGN', cname: 'Nigerian Naira' },
      { ccode: 'NOK', cname: 'Norske Kroner' },
      { ccode: 'NZD', cname: 'New Zealand Dollar' },
      { ccode: 'PHP', cname: 'Philippine Peso' },
      { ccode: 'SEK', cname: 'Swedish Krona' },
      { ccode: 'SGD', cname: 'Singapore Dollar' },
      { ccode: 'THB', cname: 'Thai Baht' },
      { ccode: 'USD', cname: 'US Dollar' },
      { ccode: 'VND', cname: 'Vietnamese Dong' },
      { ccode: 'XOF', cname: 'West African Franc' },
      { ccode: 'ZAR', cname: 'South African Rand' },
    ],
    baseyears: [
      2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035, 2036, 2037, 2038, 2039, 2040, 2041, 2042, 2043, 2044, 2045, 2046, 2047, 2048, 2049, 2050
    ],
    basemonths: [
      'enero',
      'febrero',
      'marzo',
      'abril',
      'mayo',
      'junio',
      'julio',
      'agosto',
      'septiembre',
      'octubre',
      'noviembre',
      'diciembre'
    ],
    baseroles: [
      'super',
      'admin',
      'staff'
    ],
    basestatus: [
      'activo',
      'inactivo'
    ],
    basetypes: [
      'premium',
      'demo',
      'standard',
      'gold',
      'platinum',
      'trial',
      'enterprise',
      'student',
      'basic',
      'professional'
    ],
    salestatus: [
      {
        status: 'activo',
        description: 'La orden está activa y en proceso de ser gestionada.'
      },
      {
        status: 'inactivo',
        description: 'La orden se encuentra inactiva, sin actividad reciente o sin que se requiera acción inmediata.'
      },
      {
        status: 'borrador',
        description: 'La orden está en estado de borrador, a la espera de ser finalizada y enviada para su procesamiento.'
      },
      {
        status: 'atendiendo',
        description: 'La orden está siendo atendida activamente por el equipo correspondiente.'
      },
      {
        status: 'orden creada',
        description: 'La orden ha sido creada en el sistema y está pendiente de procesamiento.'
      },
      {
        status: 'orden recibida',
        description: 'La orden ha sido recibida por el Depto. de Compras para su revisión y procesamiento.'
      },
      {
        status: 'orden procesada',
        description: 'La orden ha sido completada por el Depto. de Compras y está lista para el envío del material.'
      },
      {
        status: 'material-in-transit',
        description: 'El material está en tránsito y se ha registrado el número de rastreo para su seguimiento.'
      },
      {
        status: 'recibo bodega usa',
        description: 'Se ha confirmado la recepción del material en la bodega de Estados Unidos.'
      },
      {
        status: 'proceso de importacion',
        description: 'El material está en proceso de importación. Es necesario revisar la lista de verificación para cumplir con los requisitos aduanales.'
      },
      {
        status: 'recibido bodega tijuana',
        description: 'El material ha sido recibido en la bodega de México. La orden puede cerrarse si todo el material ha sido recibido correctamente.'
      },
      {
        status: 'finalizada',
        description: 'El ciclo de la orden ha concluido exitosamente. No se requiere más acción.'
      }
    ],
    paymentstatus: [
      'completo',
      'abono'
    ],
    paymentmethods: [
      'efectivo',
      'cheque',
      'deposito',
      'especie',
      'transferencia'
    ],
    itemUnits: [
      "caja",
      "galón",
      "gramos",
      "kilogramos",
      "kit",
      "libras",
      "litros",
      "metros",
      "onza",
      "paquete",
      "pies",
      "pieza",
      "pulgada",
      "tonelada"
    ],
    itemTypes: [
      'accesorio',
      'activo',
      'aparato',
      'artículo',
      'bien',
      'bien de consumo',
      'bien duradero',
      'bien no duradero',
      'catalogo',
      'comodín',
      'componente',
      'consumible',
      'despachable',
      'dispositivo',
      'embalaje',
      'empaque',
      'equipo',
      'herramienta',
      'ingrediente',
      'insumo',
      'instrumento',
      'ítem',
      'material',
      'materia prima',
      'mercancía',
      'módulo',
      'muestra',
      'parte de recambio',
      'producto agropecuario',
      'producto alimenticio',
      'producto crudo',
      'producto cosmético',
      'producto electrónico',
      'producto final',
      'producto farmacéutico',
      'producto industrial',
      'producto intermedio',
      'producto químico',
      'producto semiterminado',
      'producto textil',
      'producto transformado',
      'prototipo',
      'recambio',
      'repuesto',
      'suministro',
      'terminado',
      'unidad',
      'producto de higiene',
      'producto de limpieza'
    ],
    shippingMethods: [
      'sin envío',
      'envio a domicilio',
      'envio aereos',
      'envio certificado',
      'envio con acuse de recibo',
      'envio con seguimiento',
      'envio contra reembolso',
      'envio de documentos',
      'envio de paquetes',
      'envio de volumen',
      'envio economico',
      'envio en el mismo dia',
      'envio en frio',
      'envio en tienda',
      'envio especial',
      'envio estandar',
      'envio express',
      'envio gratis',
      'envio internacional',
      'envio nacional',
      'envio nocturno',
      'envio prioritario',
      'envio rapido',
      'envio terrestre',
      'envio urgente',
      'envio vulnerable',
      'entrega a domicilio',
      'entrega aerea',
      'entrega certificada',
      'entrega con acuse de recibo',
      'entrega con seguimiento',
      'entrega contra reembolso',
      'entrega de documentos',
      'entrega de paquetes',
      'entrega economica',
      'entrega en el mismo dia',
      'entrega en frio',
      'entrega en tienda',
      'entrega especial',
      'entrega estandar',
      'entrega express',
      'entrega gratuita',
      'entrega internacional',
      'entrega nacional',
      'entrega nocturna',
      'entrega prioritaria',
      'entrega rapida',
      'entrega terrestre',
      'entrega urgente',
      'entrega vulnerable',
      'servicio de mensajeria'
    ],
    casteluseraccess: [
      '10',
      '11',
      '14',
      '15',
      '21',
      '23',
      '34'
    ]
  }
};
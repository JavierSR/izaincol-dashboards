export const USER_CERTIFICATE_FIELDS = [{
    name: 'name',
    displayName: 'Nombres y apellidos',
    type: 'text'
    }, {
    name: 'document',
    displayName: 'Documento',
    type: 'number'
    }, {
    name: 'scope',
    displayName: 'Alcance',
    type: 'text'
    }, {
    name: 'ability',
    displayName: 'Capacidad',
    type: 'text'
    }, {
    name: 'rule',
    displayName: 'Norma',
    type: 'text'
    }, {
    name: 'verification_code',
    displayName: 'Código de verificación',
    type: 'text'
    }, {
    name: 'expedition',
    displayName: 'Fecha expedición',
    type: 'date'
    }, {
    name: 'validity',
    displayName: 'Vigencia',
    type: 'date'
    }, {
    name: 'state',
    displayName: 'Estado',
    type: 'select',
    options: ['Activo', 'Suspendido', 'Retirado']
    }
]

export const GROUP_CERTIFICATE_FIELDS = [{
    name: 'certificate',
    displayName: 'Certificado',
    }, {
    name: 'name_group',
    displayName: 'Nombre de equipo',
    }, {
    name: 'type',
    displayName: 'Tipo',
    }, {
    name: 'rule',
    displayName: 'Norma',
    }, {
    name: 'brand',
    displayName: 'Marca',
    }, {
    name: 'serie',
    displayName: 'Serie',
    }, {
    name: 'model',
    displayName: 'Modelo',
    }, {
    name: 'expedition_date',
    displayName: 'Fecha expedición',
    type: 'date'
    }
]

export const HOST_NAME = 'https://izaincol.com.co'
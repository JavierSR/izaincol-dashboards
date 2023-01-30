const getDefaultValueByFieldType = (field) => {
    switch(field.type) {
        case 'date':
            return new Date()
        
        case 'select':
            return field.options[0]

        default:
            return ''
    }
}

export const fillDefaultValues = (fields) => {
    const empty = {}
    fields.forEach((field) => {
        empty[field.name] = getDefaultValueByFieldType(field)
    })
    return empty
}
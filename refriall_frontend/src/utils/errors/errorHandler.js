export const objectNames = {
  order: 'Orden',
  bill: 'Factura',
  kit: 'Equipo',
  provider: 'Prestador',
  customer: 'Cliente',
  customerDependency: 'Dependencia',
  gender: {
    male: 'm',
    female: 'f'
  }
}

export const errorHandler = (sourceError, displayError, objectName = 'Objeto', gender = 'f') => {
  if (sourceError.response) {
    const { data, status } = sourceError.response
    switch (status) {
      case 400:
        displayError.value = data || data.detail
        break
      case 401:
        displayError.value = 'No autorizado, inicie sesión nuevamente.'
        break
      case 404:
        const errorMessage = `${objectName} no encontrad`
        displayError.value = gender === 'f' ? errorMessage + 'a.' : errorMessage + 'o.'
        break
      case 500:
        displayError.value = 'Error interno del servidor, consulte al desarrollador.'
        break
      default:
        displayError.value = data.detail
        break
    }
  } else if (sourceError.request) {
    displayError.value = 'Servidor no responde, intente más tarde, si el problema persiste, consulte al desarrollador.'
  } else {
    displayError.value = 'Error inesperado, consulte al desarrollador.'
  }
}

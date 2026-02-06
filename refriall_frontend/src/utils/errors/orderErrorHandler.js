export const orderErrorHandler = (sourceError, displayError) => {
  if (sourceError.response) {
    const { data, status } = sourceError.response
    switch (status) {
      case 400:
        displayError.value = 'Datos faltantes o incorrectos.'
        break
      case 401:
        displayError.value = 'No autorizado, inicie sesión nuevamente.'
        break
      case 404:
        displayError.value = 'Orden no encontrada.'
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

import { computed } from 'vue'

import { deleteOrder, postOrder, putOrder } from '../services/order.service'

// to export a comuted as a composable, define the function
// that'll return the composable object
export const useOrderTotalComputed = (order, items) => {
  const orderTotalComputed = computed(() => {
    return order.value.itemtime_set
      .filter((itemtime) => itemtime.item !== 0)
      .reduce((count, itemtime) => {
        const itemfiltered = items.value.filter((itf) => itf.id === itemtime.item)
        const itemRaw = itemfiltered[0]
        return count + itemRaw.price * itemtime.times
      }, 0)
  })
  return { orderTotalComputed }
}

export const useUpdateOrder = () => {
  const updateOrder = async (order, v$, orderBackendErrors, router) => {
    try {
      if (await v$.$validate()) {
        order.itemtime_set = order.itemtime_set.filter((x) => x.item > 0)
        const { data } = await putOrder(order)
        router.push({ name: 'orders_detail', params: { id: data.id } })
      }
    } catch (error) {
      console.error('General erro', error)
      if (error.response) {
        orderBackendErrors.value = error.response.data
      } else {
        orderBackendErrors.value = { message: 'Error inesperado, consulte al desarrollador' }
      }
      console.log(orderBackendErrors.value)
    }
  }

  return { updateOrder }
}

export const useCreateOrder = () => {
  const createOrder = async (order, v$, orderBackendErrors, router) => {
    try {
      if (await v$.$validate()) {
        order.itemtime_set = order.itemtime_set.filter((x) => x.item > 0)
        const { data } = await postOrder(order)
        router.push({ name: 'orders_detail', params: { id: data.id } })
      }
    } catch (error) {
      console.error('General erro', error)
      if (error.response) {
        orderBackendErrors.value = error.response.data
      } else {
        orderBackendErrors.value = { message: 'Error inesperado, consulte al desarrollador' }
      }
      console.log(orderBackendErrors.value)
    }
  }
  return { createOrder }
}

export const useDelOrder = () => {
  const delOrder = async (id, router, errorMessage) => {
    try {
      await deleteOrder(id)
      router.push({ name: 'orders' })
    } catch (error) {
      if (error.response) {
        // The request was made, and the server responded with a status code
        console.log('Error status:', error.response.status)
        console.log('Error data:', error.response.data)
        errorMessage = `${error.response.data} - ${error.response.status}`
        // Handle different status codes
        if (error.response.status === 404) {
            errorMessage = 'Orden no encontrada.'
        } else if (error.response.status === 400) {
          console.log('Bad request: ' + error.response.data.error)
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.log('No response received:', error.request)
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error:', error.message)
      }
    }
  }
  return { delOrder }
}

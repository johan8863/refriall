import { computed } from 'vue'

import { detailOrderUpdate, postOrder, putOrder } from '../services/order.service'

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

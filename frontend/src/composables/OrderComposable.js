import { computed } from 'vue'

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

export const useOrderPaginate = () => {
  const paginate = (order, itemsPerPage, start = 0, pages = []) => {
    if (start >= order.value.itemtimeorder_set.length) {
      return pages
    }
    const end = start + itemsPerPage
    const { itemtimeorder_set, ...rest } = order.value
    pages.push({
      ...rest,
      itemtimeorder_set: itemtimeorder_set.slice(start, end)
    })
    return paginate(order, itemsPerPage, end, pages)
  }

  return { paginate }
}

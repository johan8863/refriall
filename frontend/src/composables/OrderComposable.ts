import { computed, type Ref } from 'vue'
import type { Order, ItemTime } from '@/views/orders/types'
import type { Item } from '@/services/itemService'

/* 
to export a computed as a composable, define the function
that'll return the composable computed object
*/

/**
 * Computed total amount for an order
 */
export const useOrderTotalComputed = (order: Ref<Order>, items: Ref<Item[]>) => {
  const orderTotalComputed = computed((): number => {
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
  const paginate = <T extends { itemtimeorder_set: any[] }>(
    order: T,
    itemsPerPage: number,
    start: number = 0,
    pages: any[] = []
  ) => {
    if (start >= order.itemtimeorder_set.length) {
      return pages
    }
    const end = start + itemsPerPage
    const { itemtimeorder_set, ...rest } = order
    pages.push({
      ...rest,
      itemtimeorder_set: itemtimeorder_set.slice(start, end)
    })
    return paginate(order, itemsPerPage, end, pages)
  }

  return { paginate }
}

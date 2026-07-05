import { useRouter } from 'vue-router'

export const useRouting = () => {
  const router = useRouter()

  const goToListPost = (routeListName) => router.push({ name: routeListName })

  const goToDetail = (routeDetailName, objectID) =>
    router.push({ name: routeDetailName, params: { id: objectID } })

  const goBack = (routeListName, routeDetailName, objectID) => {
    return !objectID ? goToList() : goToDetail(routeDetailName, objectID)
  }

  return {
    goToListPost,
    goToDetail,
    goBack
  }
}

import { useRouter } from 'vue-router'

export const useRouting = () => {
  const router = useRouter()

  // validators
  // route name
  const validateRouteName = (routeName, functionName) => {
    if (!routeName || typeof routeName !== 'string') {
      throw new Error(
        `[${functionName}] Route name must be a non empty valid string. Provided: ${routeName}`
      )
    }
  }
  // object id for detail function
  const validateObjectID = (objectID, functionName) => {
    if (typeof objectID == undefined || typeof objectID == null || typeof objectID !== 'number') {
      throw new Error(
        `[${functionName}] Object ID must be a non empty valid integer. Provided: ${objectID}`
      )
    }
  }
  // object id for go back function
  const validateObjectIDGoBack = (objectID, functionName) => {
    // goBack may not need id when called from creation form
    if (objectID) {
      if (typeof objectID !== 'number') {
        throw new Error(
          `[${functionName}] Object ID must be a non empty valid integer. Provided: ${objectID}`
        )
      }
    }
  }

  const goToListPost = (routeListName) => {
    validateRouteName(routeListName, 'goToListPost')
    router.push({ name: routeListName })
  }

  const goToDetail = (routeDetailName, objectID) => {
    validateRouteName(routeDetailName, 'goToDetail')
    validateObjectID(objectID, 'goToDetail')
    router.push({ name: routeDetailName, params: { id: objectID } })
  }

  const goBack = (routeListName, routeDetailName, objectID) => {
    validateRouteName(routeListName, 'goBack')
    validateRouteName(routeDetailName, 'goBack')
    validateObjectIDGoBack(objectID, 'goBack')
    return !objectID ? goToListPost(routeListName) : goToDetail(routeDetailName, objectID)
  }

  return {
    goToListPost,
    goToDetail,
    goBack
  }
}

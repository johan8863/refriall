import { useRouter, type Router } from 'vue-router'

export const useRouting = () => {
  const router: Router = useRouter()
  type ObjectID = number | string

  /**
   * Validates that a route name is not an empty string.
   * @param routeName - The route name to validate.
   * @param functionName - Name of the calling function for error messages.
   * @throws {Error} If route name is invalid.
   */
  const validateRouteName = (routeName: string, functionName: string): void => {
    if (!routeName || typeof routeName !== 'string') {
      throw new Error(
        `[${functionName}] Route name must be a non empty valid string. Provided: ${routeName}`
      )
    }
  }

  /**
   * Validates that an object ID exists.
   * @param objectID - The object ID to validate.
   * @param functionName - Name of the calling function for error messages.
   * @throws {Error} If object ID doesn't exist.
   */
  const validateObjectID = (objectID: ObjectID, functionName: string): void => {
    if (typeof objectID == undefined || typeof objectID == null) {
      throw new Error(`[${functionName}] Object ID must be a non empty value.`)
    }
  }

  /**
   * Validates that an object ID is a number for goBack.
   * @param objectID - The object ID to validate.
   * @param functionName - Name of the calling function for error messages.
   * @throws {Error} - If giving an object ID, this one is invalid
   */
  const validateObjectIDGoBack = (
    objectID: ObjectID | null | undefined,
    functionName: string
  ): void => {
    // goBack may not need id when called from creation form
    if (objectID) {
      if (typeof objectID !== 'number') {
        throw new Error(
          `[${functionName}] Object ID must be a valid integer. Provided: ${objectID}`
        )
      }
    }
  }

  /**
   * Navigates to list view
   * @param routeListName - The name of the list route to navigate to.
   */
  const goToList = (routeListName: string): void => {
    validateRouteName(routeListName, 'goToList')
    router.push({ name: routeListName })
  }

  /**
   * Navigate to a detail view
   * @param routeDetailName - Name of the detail route
   * @param objectID - ID of the object
   */
  const goToDetail = (routeDetailName, objectID) => {
    validateRouteName(routeDetailName, 'goToDetail')
    validateObjectID(objectID, 'goToDetail')
    router.push({ name: routeDetailName, params: { id: objectID } })
  }

  /**
   * Navigate back to list or detail view
   * @param routeListName - Name of the list route
   * @param routeDetailName - Name of the detail route
   * @param objectID - ID of the object (optional, if present goes to detail, otherwise list)
   */
  const goBack = (routeListName, routeDetailName, objectID) => {
    validateRouteName(routeListName, 'goBack')
    validateRouteName(routeDetailName, 'goBack')
    validateObjectIDGoBack(objectID, 'goBack')
    return !objectID ? goToList(routeListName) : goToDetail(routeDetailName, objectID)
  }

  return {
    goToList,
    goToDetail,
    goBack
  }
}

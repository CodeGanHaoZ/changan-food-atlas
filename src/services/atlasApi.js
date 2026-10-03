import { dishes, places, sources } from '../data/atlasSeed.js'

/** Local adapter: replace the body with a server request when verified data is ready. */
export async function getAtlas(filters = {}) {
  return dishes.filter((dish) => (!filters.dishId || dish.id === filters.dishId) && (!filters.category || dish.category.includes(filters.category)))
}

export async function getPlaces(filters = {}) {
  return places.filter((place) => (!filters.area || place.area.includes(filters.area)) && (!filters.mode || place.mode.includes(filters.mode)) && (!filters.dishId || place.dish.includes(dishes.find((dish) => dish.id === filters.dishId)?.name || '')))
}

export async function getSources(ids = []) {
  return sources.filter((source) => ids.length === 0 || ids.includes(source.id))
}

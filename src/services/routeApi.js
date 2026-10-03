import { dishes, places } from '../data/atlasSeed.js'

const placeDishNames = (place) => place.dish.split(' / ').map((name) => name.trim())

/** Deterministic route planner for the offline prototype. */
export async function buildRoute(query = {}) {
  const requested = query.dishes?.length ? query.dishes : []
  const modeMatches = (place) => !query.modes?.length || query.modes.some((mode) => (mode === 'street' && /边走|街区/.test(place.mode)) || (mode === 'dine_in' && /坐下|堂食/.test(place.mode)) || (mode === 'takeaway' && /外带|打包|边走/.test(place.mode)))
  const candidates = requested.length
    ? places.filter((place) => requested.some((dish) => placeDishNames(place).includes(dish)))
    : places
  const modeFiltered = candidates.filter(modeMatches)
  const selected = (modeFiltered.length ? modeFiltered : candidates.length ? candidates : places).slice(0, 3)
  const dishIds = selected.flatMap((place) => placeDishNames(place).map((name) => dishes.find((dish) => dish.name === name)?.id).filter(Boolean))
  const budget = selected.reduce((sum, place) => sum + Number(place.price.match(/\d+/)?.[0] || 0), 0)
  const durationMin = Math.max(90, selected.length * 35)
  const risks = selected.map((place) => place.risk)
  if (query.budgetMax && budget > query.budgetMax) risks.unshift(`预算约 ¥${budget}，超出设置的 ¥${query.budgetMax}`)
  return {
    title: `${query.origin || '钟楼'} · 巷口 · 一碗面`,
    subtitle: `${Math.round(durationMin / 60)} 小时 · 预算约 ¥${budget} · 适合${query.modes?.includes('street') ? '边走边吃' : '在地串联'}`,
    stops: selected,
    durationMin,
    budgetRange: [Math.max(0, budget - 18), budget + 24],
    dishIds,
    risks,
    alternatives: ['城墙根面馆（演示备选）'],
    sourceIds: selected.flatMap((place) => place.sourceIds || []),
  }
}

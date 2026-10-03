const NUMBER_PATTERN = /(\d+(?:\.\d+)?)\s*(小时|h|元|块|种|个)/i

/**
 * Adapter boundary for a future tool-calling model. The local parser is intentionally
 * conservative: unknown facts stay unknown and routeApi performs final validation.
 */
export async function parseExploreQuery(input = '') {
  const text = input.trim()
  const durationMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:小时|h)/i)
  const budgetMatch = text.match(/(?:预算|人均|不超过|\b)(\d{2,4})\s*(?:元|块)?/i)
  const dishNames = ['肉夹馍', '羊肉泡馍', '凉皮', '油泼面', '臊子面', '灌汤包', '甑糕', '葫芦头泡馍']
  const modes = []
  if (/堂食|坐下来/.test(text)) modes.push('dine_in')
  if (/外带|打包|带走/.test(text)) modes.push('takeaway')
  if (/边走|街边/.test(text)) modes.push('street')
  return {
    raw: text,
    origin: /钟楼|洒金桥|城墙|回民街|南门/.exec(text)?.[0] || '钟楼',
    durationMin: durationMatch ? Math.round(Number(durationMatch[1]) * 60) : undefined,
    budgetMax: budgetMatch ? Number(budgetMatch[1]) : undefined,
    dishes: dishNames.filter((dish) => text.includes(dish)),
    modes,
    avoidChains: /不想|不要|避开/.test(text) && /连锁/.test(text),
  }
}

export function getParserStatus() {
  return { provider: 'local-rule-fallback', model: null, networkRequired: false }
}

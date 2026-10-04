import React, { useEffect, useMemo, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Icon, addCollection } from '@iconify/react'
import { icons as mingcuteIcons } from '@iconify-json/mingcute'
import './styles.css'
import { dishes, places, sources } from './data/atlasSeed.js'
import { parseExploreQuery } from './services/agentApi.js'
import { buildRoute } from './services/routeApi.js'

// Keep the icon set local so the demo remains complete when the venue network is unavailable.
addCollection(mingcuteIcons)

function IconButton({ icon, label, onClick, active = false }) {
  return <button className={`icon-btn ${active ? 'is-active' : ''}`} aria-label={label} title={label} onClick={onClick}><Icon icon={icon} width="20" height="20" /></button>
}

function BrandMark({ compact = false }) {
  return <svg className={`brand-mark ${compact ? 'brand-mark-compact' : ''}`} viewBox="0 0 72 72" role="img" aria-label="长安食游图鉴印记">
    <path className="brand-mark-frame" d="M9 9h54v54H9z" />
    <path className="brand-mark-roof" d="M16 30v-8h9v5h7v-5h8v5h7v-5h9v8M14 33h44M20 33v13m32-13v13M27 31v15m18-15v15" />
    <circle className="brand-mark-bell" cx="36" cy="34" r="6" />
    <path className="brand-mark-bowl" d="M16 48h40c-3 8-10 12-20 12S19 56 16 48Zm8 0v-5h24v5" />
    <path className="brand-mark-route" d="M16 16h8m24 0h8" />
  </svg>
}

function FlatDishVisual({ dish, compact = false }) {
  const kind = dish?.visual || 'bowl'
  return <div className={`flat-dish-visual ${compact ? 'is-compact' : ''}`} style={{ '--dish-tone': dish?.tone || 'var(--cinnabar-600)', '--dish-accent': dish?.accent || 'var(--gold-600)' }} aria-label={`${dish?.name || '菜品'}平面图`}>
    <svg className="flat-dish-svg" viewBox="0 0 420 250" role="img" aria-hidden="true">
      <ellipse className="flat-shadow" cx="210" cy="214" rx="132" ry="18" />
      <ellipse className="flat-plate" cx="210" cy="200" rx="150" ry="28" />
      {kind === 'sandwich' && <>
        <path className="flat-bread" d="M91 138 Q106 105 210 105 Q314 105 329 138 L319 171 Q210 190 101 171 Z" />
        <path className="flat-filling" d="M106 143 Q210 128 314 143 L306 166 Q210 182 114 166 Z" />
        <path className="flat-bread flat-bread-top" d="M101 125 Q112 89 210 89 Q308 89 319 125 Q210 145 101 125 Z" />
        <path className="flat-detail" d="M138 112 Q210 126 282 112" />
      </>}
      {kind === 'bread' && <>
        <path className="flat-bread" d="M98 126 Q110 89 210 80 Q310 89 322 126 L306 176 Q210 207 114 176 Z" />
        <path className="flat-bread-top" d="M110 122 Q122 94 210 87 Q298 94 310 122 Q210 145 110 122 Z" />
        <path className="flat-detail" d="M154 108l10 9m34-20 9 12m33-11 10 9m25-1 7 9" />
        <circle className="flat-garnish" cx="144" cy="119" r="4" /><circle className="flat-garnish" cx="273" cy="117" r="4" />
      </>}
      {kind === 'noodle' && <>
        <path className="flat-bowl" d="M90 126 Q210 204 330 126 L308 191 Q210 231 112 191 Z" />
        <path className="flat-soup" d="M103 132 Q210 188 317 132 Q300 112 210 112 Q120 112 103 132 Z" />
        <path className="flat-noodle" d="M128 133 Q168 157 202 134 T276 139 M140 148 Q180 174 220 147 T296 151 M156 160 Q198 185 242 159" />
        <circle className="flat-garnish" cx="144" cy="126" r="9" /><circle className="flat-garnish" cx="282" cy="126" r="8" />
      </>}
      {kind === 'sweet' && <>
        <path className="flat-sweet" d="M112 118 Q210 97 308 118 L295 176 Q210 193 125 176 Z" />
        <path className="flat-sweet-layer" d="M119 131 Q210 149 301 131 M124 148 Q210 165 296 148" />
        <circle className="flat-garnish" cx="173" cy="119" r="10" /><circle className="flat-garnish" cx="244" cy="122" r="9" />
      </>}
      {kind === 'soup' && <>
        <path className="flat-bowl" d="M92 120 Q210 201 328 120 L308 190 Q210 228 112 190 Z" />
        <ellipse className="flat-soup" cx="210" cy="124" rx="108" ry="42" />
        <path className="flat-detail" d="M142 123 Q176 111 206 124 T276 123" />
        <circle className="flat-garnish" cx="159" cy="134" r="8" /><circle className="flat-garnish" cx="267" cy="133" r="8" />
      </>}
      {kind === 'meatball' && <>
        <path className="flat-bowl" d="M92 120 Q210 201 328 120 L308 190 Q210 228 112 190 Z" />
        <ellipse className="flat-soup" cx="210" cy="124" rx="108" ry="42" />
        <circle className="flat-meatball" cx="160" cy="123" r="18" /><circle className="flat-meatball" cx="210" cy="135" r="19" /><circle className="flat-meatball" cx="262" cy="120" r="17" />
        <path className="flat-vegetable" d="M135 145l18-8 10 14-21 8Zm123-4 19-7 9 13-20 8Z" />
      </>}
      {kind === 'chicken' && <>
        <path className="flat-chicken" d="M133 145 Q112 118 136 96 Q159 75 193 86 Q214 62 249 77 Q285 91 284 128 Q307 146 285 171 Q256 200 211 183 Q172 194 145 176 Q126 164 133 145Z" />
        <path className="flat-chicken-leg" d="M260 160l33 25m-20-5 17-2m-25 9 5 11" />
        <path className="flat-chicken-leg" d="M151 161l-30 22m20-3-15 7m25-11 1 11" />
        <path className="flat-detail" d="M173 112 Q206 96 242 111 T273 139" />
        <circle className="flat-garnish" cx="182" cy="128" r="7" /><circle className="flat-garnish" cx="241" cy="145" r="7" />
      </>}
    </svg>
    <span className="flat-dish-caption">{dish?.category?.split(' · ')[0]}</span>
  </div>
}

function FoodImage({ dish, compact = false }) {
  return <div className={`food-image-frame ${compact ? 'is-compact' : ''}`}>
    <FlatDishVisual dish={dish} compact={compact} />
  </div>
}

function PreparationPanel({ dish, compact = false }) {
  const ingredients = dish.ingredients.slice(0, 3)
  const seasoning = dish.seasoning?.slice(0, 3) || dish.ingredients.slice(-2)
  const steps = dish.steps.slice(0, 3)
  return <div className={`preparation-panel ${compact ? 'is-compact' : ''}`}>
    <div className="preparation-heading"><span>味与法</span><i>{dish.ingredients.length} 味 · {dish.steps.length} 步</i></div>
    <div className="preparation-grid">
      <div className="preparation-item"><Icon icon="mingcute:leaf-line" width="18" height="18" /><span><b>食材</b><small>{ingredients.join(' · ')}</small></span></div>
      <div className="preparation-item"><Icon icon="mingcute:flower-line" width="18" height="18" /><span><b>调味</b><small>{seasoning.join(' · ')}</small></span></div>
      <div className="preparation-item"><Icon icon="mingcute:fire-line" width="18" height="18" /><span><b>做法</b><small>{steps.join(' → ')}</small></span></div>
    </div>
  </div>
}

function HistorySourceNote({ dish }) {
  const refs = (dish?.historySourceIds || []).map((id) => sources.find((source) => source.id === id)).filter(Boolean)
  if (!refs.length) return null
  return <p className="detail-source-note">历史资料：{refs.map((source, index) => <React.Fragment key={source.id}>{index > 0 && ' · '}{source.url ? <a href={source.url} target="_blank" rel="noreferrer">{source.title.replace('百度百科 · ', '')}</a> : source.title}</React.Fragment>)}</p>
}

// 钟楼剪影（Hero 底纹）
function ZhonglouMotif() {
  return <svg className="hero-motif" viewBox="0 0 120 150" aria-hidden="true"><g fill="currentColor"><circle cx="60" cy="34" r="4.5" /><path d="M58.6 38h2.8v5h-2.8z" /><path d="M26 72 Q38 50 60 42 Q82 50 94 72 L94 79 Q60 92 26 79 Z" /><path d="M50 72h20v20H50z" /><path d="M44 92h32v20H44z" /><path d="M38 112h44v22H38z" /><path d="M26 72 Q60 85 94 72 L94 79 Q60 92 26 79 Z" /><path d="M18 92 Q60 105 102 92 L102 99 Q60 112 18 99 Z" /><path d="M10 112 Q60 125 110 112 L110 119 Q60 132 10 119 Z" /><path d="M26 134h68v14H26z" /></g><g stroke="currentColor" strokeWidth="2" opacity="0.45"><path d="M60 100v-16M52 92h16M60 120v-16M52 112h16M60 132v-14M52 125h16" /></g></svg>
}

function SectionRule() { return <div className="section-rule" aria-hidden="true"><span /><i className="section-rule-mark" /><span /></div> }

const TIANDITU_KEY = '768f017350f96d1ae53a702859c4388b'
let tiandituLoader = null

// 动态加载天地图 API（与 LiFalxdMap.vue 的挂载方式一致）
function loadTianditu() {
  if (window.T) return Promise.resolve()
  if (tiandituLoader) return tiandituLoader
  tiandituLoader = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = `https://api.tianditu.gov.cn/api?v=4.0&tk=${TIANDITU_KEY}`
    script.onload = () => resolve()
    script.onerror = () => { tiandituLoader = null; reject(new Error('tianditu load failed')) }
    document.head.appendChild(script)
  })
  return tiandituLoader
}

function TianDiMap({ stops, onOpenDish }) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const markersRef = useRef([])
  const [mapReady, setMapReady] = useState(false)
  const [loadFailed, setLoadFailed] = useState(false)
  const [activePlace, setActivePlace] = useState(null)

  useEffect(() => {
    let cancelled = false
    loadTianditu().then(() => {
      if (cancelled || !containerRef.current || mapRef.current) return
      const map = new window.T.Map(containerRef.current)
      map.centerAndZoom(new window.T.LngLat(108.9402, 34.261), 14)
      mapRef.current = map
      setMapReady(true)
    }).catch(() => { if (!cancelled) setLoadFailed(true) })
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (!mapReady || !mapRef.current) return
    const T = window.T
    const map = mapRef.current
    markersRef.current.forEach((marker) => map.removeOverLay(marker))
    markersRef.current = []
    setActivePlace(null)
    const points = []
    stops.forEach((place, index) => {
      if (!place.longitude || !place.latitude) return
      const lnglat = new T.LngLat(place.longitude, place.latitude)
      points.push(lnglat)
      const marker = new T.Marker(lnglat)
      map.addOverLay(marker)
      markersRef.current.push(marker)
      marker.addEventListener('click', () => setActivePlace({ ...place, index }))
    })
    if (points.length > 0) map.setViewport(points)
  }, [mapReady, stops])

  if (loadFailed) return <div className="tianditu-fallback">天地图加载失败，请检查网络后刷新。</div>
  return <>
    <div ref={containerRef} className="tianditu-map" />
    {activePlace && (
      <div className="map-place-card" key={`${activePlace.name}-${activePlace.index}`}>
        <div className="map-place-info">
          <b>{String(activePlace.index + 1).padStart(2, '0')} · {activePlace.name}</b>
          <span>{activePlace.area}{activePlace.type ? ` · ${activePlace.type}` : ''}</span>
          <span>味道：{activePlace.dish} · {activePlace.price}{activePlace.score ? ` · 喜爱值 ${activePlace.score}` : ''}</span>
        </div>
        <button className="btn btn-primary btn-small" onClick={() => onOpenDish?.(activePlace.dish.split(' / ')[0])}>查看味道</button>
        <button className="map-place-close" aria-label="关闭" onClick={() => setActivePlace(null)}><Icon icon="mingcute:close-line" width="18" height="18" /></button>
      </div>
    )}
  </>
}

// 滚动进入视野时为元素添加渐入效果
function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); io.unobserve(entry.target) }
      })
    }, { threshold: 0.1, rootMargin: '0px 0px -8% 0px' })
    document.querySelectorAll('[data-reveal]:not(.is-visible)').forEach((el) => io.observe(el))
    return () => io.disconnect()
  })
}

// 弹窗包装：挂载时渐入，关闭时先渐出再卸载
function Modal({ onClose, className, label, children }) {
  const [closing, setClosing] = useState(false)
  const close = () => { if (closing) return; setClosing(true); window.setTimeout(onClose, 240) }
  return <div className={`modal-backdrop ${closing ? 'is-closing' : ''}`} onClick={close}>
    <div className={className} onClick={(e) => e.stopPropagation()} role="dialog" aria-label={label}>
      <button className="modal-close" onClick={close} aria-label="关闭"><Icon icon="mingcute:close-line" width="22" height="22" /></button>
      {children}
    </div>
  </div>
}

function BackToTop({ onReset, onHome }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 420)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    // 等回到顶部后再重置渐入动画，避免上滑途中提前触发
    const startedAt = Date.now()
    const timer = window.setInterval(() => {
      if (window.scrollY > 2 && Date.now() - startedAt < 3000) return
      window.clearInterval(timer)
      document.querySelectorAll('[data-reveal].is-visible').forEach((el) => el.classList.remove('is-visible'))
      onReset?.()
    }, 120)
  }
  return (
    <div className="float-actions">
      {onHome && <button className="back-home" aria-label="返回首页" onClick={onHome}><Icon icon="mingcute:home-3-line" width="20" height="20" /></button>}
      <button className={`back-to-top ${visible ? 'is-visible' : ''}`} aria-label="返回顶部" onClick={handleClick}><Icon icon="mingcute:arrow-up-line" width="20" height="20" /></button>
    </div>
  )
}

function App() {
  const [selectedDish, setSelectedDish] = useState(dishes[0])
  const [detailDish, setDetailDish] = useState(null)
  const [detailPlace, setDetailPlace] = useState(null)
  const [query, setQuery] = useState('')
  const [activeTab, setActiveTab] = useState('图鉴')
  const [plan, setPlan] = useState(null)
  const [showSources, setShowSources] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [userPosition, setUserPosition] = useState(null)
  const [locationState, setLocationState] = useState('idle')
  const [, setRevealSeed] = useState(0)
  const [view, setView] = useState('home') // home | collection（收集册页）| places（店铺列表页）
  const [carouselSeed, setCarouselSeed] = useState(0) // 手动切换时重置轮播计时
  const [exploreFlash, setExploreFlash] = useState(false)
  const flashTimerRef = useRef(null)

  useReveal()

  const filteredDishes = useMemo(() => {
    const term = query.trim()
    if (!term || !dishes.some((dish) => term.includes(dish.name) || term.includes(dish.category))) return dishes
    return dishes.filter((dish) => `${dish.name}${dish.category}${dish.note}`.includes(term) || term.includes(dish.name))
  }, [query])

  async function generatePlan(preset) {
    setQuery(preset)
    setIsGenerating(true)
    try {
      const parsed = await parseExploreQuery(preset)
      const route = await buildRoute(parsed)
      window.setTimeout(() => { setPlan({ ...route, note: '路线资料来自游陕西小程序，价格与营业状态请以现场为准。' }); setIsGenerating(false) }, 420)
    } catch {
      setPlan({ title: '钟楼 · 备用路线', subtitle: '本地离线方案 · 来源待确认', stops: places, note: '路线生成暂不可用，已展示附近资料。' })
      setIsGenerating(false)
    }
  }

  // 当前图鉴轮播：固定展示默认前8道菜，每3.6s自动切换，弹窗打开或离开首页时暂停
  useEffect(() => {
    const defaultDishes = dishes.slice(0, 8)
    if (defaultDishes.length < 2 || detailDish || view !== 'home') return undefined
    const timer = setInterval(() => {
      setSelectedDish((current) => {
        const idx = defaultDishes.findIndex((dish) => dish.id === current?.id)
        return defaultDishes[(idx + 1) % defaultDishes.length]
      })
    }, 3600)
    return () => clearInterval(timer)
  }, [detailDish, view, carouselSeed])

  // 滚动到对应板块时自动切换导航高亮（PC 顶部导航 + 移动端底部导航共用）
  useEffect(() => {
    if (view !== 'home') { setActiveTab('图鉴'); return undefined }
    const sections = [
      ['atlas', '图鉴'],
      ['explore', '在地探索'],
      ['plan', '路线方案'],
    ]
    const onScroll = () => {
      const anchor = window.scrollY + 140 // 固定头部高度 + 触发提前量
      let current = '图鉴'
      for (const [id, tab] of sections) {
        const el = document.getElementById(id)
        if (el && el.offsetTop <= anchor) current = tab
      }
      setActiveTab(current)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [view])

  // 切换视图时回到页面顶部
  useEffect(() => { window.scrollTo({ top: 0 }) }, [view])

  // 「寻一程」：填入示例条件并生成路线，滚动到探索区并高亮面板
  function startJourney() {
    const preset = '钟楼附近 · 2 小时 · 3 种小吃'
    setView('home')
    setActiveTab('在地探索')
    generatePlan(preset)
    requestAnimationFrame(() => document.getElementById('explore')?.scrollIntoView({ behavior: 'smooth', block: 'start' }))
    window.clearTimeout(flashTimerRef.current)
    setExploreFlash(true)
    flashTimerRef.current = window.setTimeout(() => setExploreFlash(false), 1600)
  }

  function openCollection() {
    setView('collection')
    setActiveTab('图鉴')
  }

  function openPlaces() {
    setView('places')
    setActiveTab('路线方案')
    window.scrollTo(0, 0)
  }

  // 轮播手动切换：重置自动播放计时
  function cycleDish(step) {
    setCarouselSeed((v) => v + 1)
    setSelectedDish((current) => {
      const idx = dishes.findIndex((dish) => dish.id === current?.id)
      return dishes[(idx + step + dishes.length) % dishes.length]
    })
  }

  function requestLocation() {
    if (!navigator.geolocation) { setLocationState('unsupported'); return }
    setLocationState('loading')
    navigator.geolocation.getCurrentPosition((position) => {
      setUserPosition({ latitude: position.coords.latitude, longitude: position.coords.longitude })
      setLocationState('ready')
    }, () => setLocationState('denied'), { enableHighAccuracy: true, timeout: 8000, maximumAge: 300000 })
  }

  function distanceTo(place) {
    if (!userPosition || !place.latitude || !place.longitude) return null
    const rad = Math.PI / 180
    const lat1 = userPosition.latitude * rad
    const lat2 = place.latitude * rad
    const dLat = (place.latitude - userPosition.latitude) * rad
    const dLon = (place.longitude - userPosition.longitude) * rad
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2
    return (6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(1)
  }

  return <div className="app-shell texture-paper">
    <div className="scroll-progress" />
    <header className="site-header">
      <a className="brand" href="#top" aria-label="长安食游图鉴首页"><BrandMark /><span><b>长安食游图鉴</b><small>八味 · 长安</small></span></a>
      <nav className="site-nav" aria-label="主导航">
        {['图鉴', '在地探索', '路线方案'].map((item) => <button key={item} className={activeTab === item ? 'nav-link is-active' : 'nav-link'} onClick={() => { setActiveTab(item); document.getElementById(item === '图鉴' ? 'atlas' : item === '在地探索' ? 'explore' : 'plan')?.scrollIntoView({ behavior: 'smooth' }) }}>{item}</button>)}
      </nav>
    </header>

    <nav className="mobile-nav" aria-label="移动端主导航">
      <button className={activeTab === '图鉴' ? 'mobile-nav-item is-active' : 'mobile-nav-item'} onClick={() => { setActiveTab('图鉴'); document.getElementById('atlas')?.scrollIntoView({ behavior: 'smooth' }) }}><Icon icon={activeTab === '图鉴' ? 'mingcute:book-6-fill' : 'mingcute:book-6-line'} width="22" height="22" /><span>图鉴</span></button>
      <button className={activeTab === '在地探索' ? 'mobile-nav-item is-active' : 'mobile-nav-item'} onClick={() => { setActiveTab('在地探索'); document.getElementById('explore')?.scrollIntoView({ behavior: 'smooth' }) }}><Icon icon={activeTab === '在地探索' ? 'mingcute:compass-fill' : 'mingcute:compass-line'} width="22" height="22" /><span>探索</span></button>
      <button className={activeTab === '路线方案' ? 'mobile-nav-item is-active' : 'mobile-nav-item'} onClick={() => { setActiveTab('路线方案'); document.getElementById('plan')?.scrollIntoView({ behavior: 'smooth' }) }}><Icon icon={activeTab === '路线方案' ? 'mingcute:route-fill' : 'mingcute:route-line'} width="22" height="22" /><span>路线</span></button>
    </nav>

    {view === 'places' ? (
      <main className="collection-main" id="top">
        <section className="collection-section section-wrap">
          <div className="collection-head" data-reveal>
            <div className="section-heading"><div><div className="kicker">巷陌札记</div><h2>沿街拾味 · 全收录</h2></div><p>共收录 {places.length} 家店铺，资料来自游陕西小程序，点击任意一家查看详情。</p></div>
          </div>
          <div className="places-list">{places.map((place, index) => (
            <article key={place.id} className="place-list-item card" data-reveal style={{ '--reveal-delay': `${(index % 4) * 70}ms` }} onClick={() => setDetailPlace(place)}>
              <div className="place-list-index">{String(index + 1).padStart(2, '0')}</div>
              <div className="place-list-main">
                <span className="tag tag-jade">{place.type}</span>
                <h3>{place.name}</h3>
                <p>{place.area} · {place.dish}</p>
                <div className="place-list-meta">
                  <span><Icon icon="mingcute:wallet-line" width="15" height="15" />{place.averagePrice || place.price}</span>
                  {place.score && <span><Icon icon="mingcute:star-line" width="15" height="15" />喜爱值 {place.score}</span>}
                  <span><Icon icon="mingcute:time-line" width="15" height="15" />{place.openingHours}</span>
                </div>
                <p className="place-list-intro">{place.intro}</p>
              </div>
              <span className="field-arrow" aria-hidden="true"><Icon icon="mingcute:arrow-right-up-line" width="20" height="20" /></span>
            </article>
          ))}</div>
          <div className="collection-foot" data-reveal><button className="btn btn-ghost" onClick={() => setView('home')}><Icon icon="mingcute:arrow-left-line" width="18" height="18" />返回首页</button></div>
        </section>
      </main>
    ) : view === 'collection' ? (
      <main className="collection-main" id="top">
        <section className="collection-section section-wrap">
          <div className="collection-head" data-reveal>
            <div className="section-heading"><div><div className="kicker">食游收集册</div><h2>长安风味 · 全收录</h2></div><p>共收录 {dishes.length} 道风味，点击任意一味查看详情。</p></div>
          </div>
          <div className="collection-grid">{dishes.map((dish, index) => (
            <article key={dish.id} className="collect-card card" data-reveal style={{ '--reveal-delay': `${(index % 4) * 70}ms` }} onClick={() => setDetailDish(dish)}>
              <div className="collect-index">{String(index + 1).padStart(2, '0')}</div>
              <div className="mini-canvas"><FoodImage dish={dish} compact /></div>
              <h3>{dish.name}</h3>
              <p>{dish.note}</p>
              <div className="collect-meta"><span className="tag tag-gold">{dish.category}</span><span className="dish-score" title={dish.scoreIsDefault ? '未显示平台评分，按规则展示 90.0' : '游陕西截图分值'}><Icon icon="mingcute:star-line" width="13" height="13" />{dish.score || '90.0'}</span></div>
            </article>
          ))}</div>
          <div className="collection-foot" data-reveal><button className="btn btn-ghost" onClick={() => setView('home')}><Icon icon="mingcute:arrow-left-line" width="18" height="18" />返回首页</button></div>
        </section>
      </main>
    ) : (
    <main id="top">
      <section className="hero section-wrap">
        <div className="hero-copy" data-reveal>
          <div className="kicker">长安 · 食游</div>
          <h1>长安寻味</h1>
          <p className="hero-lead">钟楼听晨钟，巷里寻真香。</p>
          <div className="hero-actions"><button className="btn btn-primary" onClick={() => document.getElementById('atlas')?.scrollIntoView({ behavior: 'smooth' })}><Icon icon="mingcute:book-6-line" width="20" height="20" />看风味</button><button className="btn btn-ghost" onClick={startJourney}><Icon icon="mingcute:route-line" width="20" height="20" />寻一程</button></div>
        </div>
        <div className="hero-stage card" data-reveal style={{ '--reveal-delay': '120ms' }}>
          <div className="stage-label"><span>当前图鉴 <b>{String(dishes.slice(0, 8).findIndex((dish) => dish.id === selectedDish.id) + 1 || 1).padStart(2, '0')} / 08</b></span><strong>{selectedDish.category}</strong></div>
          <div className="hero-canvas stage-swap" key={`canvas-${selectedDish.id}`}><FoodImage dish={selectedDish} /><button className="carousel-arrow carousel-arrow-prev" onClick={() => cycleDish(-1)} aria-label="上一道菜"><Icon icon="mingcute:left-line" width="20" height="20" /></button><button className="carousel-arrow carousel-arrow-next" onClick={() => cycleDish(1)} aria-label="下一道菜"><Icon icon="mingcute:right-line" width="20" height="20" /></button></div>
          <div className="stage-caption stage-swap" key={`caption-${selectedDish.id}`}><div><h2>{selectedDish.name}</h2><p>{selectedDish.note}</p></div><IconButton icon="mingcute:arrow-right-up-line" label="查看菜品详情" onClick={() => setDetailDish(selectedDish)} /></div>
          <div className="stage-ingredients stage-swap" key={`ing-${selectedDish.id}`} aria-label="主要食材"><span className="stage-ingredients-title">入味</span>{selectedDish.ingredients.slice(0, 4).map((ingredient, index) => <span key={ingredient}><i>{String(index + 1).padStart(2, '0')}</i>{ingredient}</span>)}</div>
          <div className="stage-steps stage-swap" key={`steps-${selectedDish.id}`} aria-label="制作步骤"><span className="stage-steps-title">做法</span><div className="stage-step-track">{selectedDish.steps.slice(0, 3).map((step, index) => <span key={step}><i>{String(index + 1).padStart(2, '0')}</i>{step}</span>)}</div></div>
          <ZhonglouMotif />
        </div>
      </section>

      <section id="explore" className="explore-section section-wrap">
        <SectionRule />
        <div className="section-heading" data-reveal><div><div className="kicker">在地寻味</div><h2>去哪吃，怎么吃</h2></div><p>循着一味，走入一街。</p></div>
        <div className="explore-layout">
          <div className={`agent-panel card ${exploreFlash ? 'card-flash' : ''}`} data-reveal><div className="panel-top"><span className="panel-number">02</span><span className="status-chip"><i />资料已载入</span></div><h3>写下你的寻味条件</h3><p className="panel-copy">一念所向，皆可入巷。</p><div className="query-box"><textarea value={query} maxLength={160} onChange={(e) => setQuery(e.target.value)} placeholder="钟楼 · 两小时 · 想吃热面" /><div className="query-footer"><span>{query.length}/160</span><button className="btn btn-primary btn-small" onClick={() => generatePlan(query || '钟楼附近 · 2 小时 · 3 种小吃')} disabled={isGenerating}><Icon icon={isGenerating ? 'mingcute:loading-3-line' : 'mingcute:sparkles-2-line'} width="18" height="18" />{isGenerating ? '整理中' : '落笔成行'}</button></div></div><div className="preset-row"><span>一念：</span><button onClick={() => generatePlan('钟楼附近 · 2 小时 · 3 种小吃')}>钟楼听钟</button><button onClick={() => generatePlan('想找巷子里的油泼面 · 人均 30')}>巷里热面</button><button onClick={() => generatePlan('低预算 · 适合外带 · 不去连锁店')}>轻装寻味</button></div></div>
          <div className="map-panel card" data-reveal style={{ '--reveal-delay': '120ms' }}><div className="map-top"><div><span className="kicker">循味成行</span><h3>{plan ? plan.title : '一条还没落笔的路线'}</h3></div><IconButton icon="mingcute:more-2-line" label="更多路线选项" /></div><div className="route-canvas"><TianDiMap stops={plan ? plan.stops : places} onOpenDish={(dishName) => setDetailDish(dishes.find((dish) => dish.name.includes(dishName)) || dishes[0])} /></div><div className="map-footer"><span><Icon icon="mingcute:time-line" width="17" height="17" />{plan ? plan.durationMin >= 120 ? `${Math.round(plan.durationMin / 60)} 小时` : `${plan.durationMin} 分钟` : '2 小时'}</span><span><Icon icon="mingcute:wallet-line" width="17" height="17" />{plan ? `约 ¥${plan.budgetRange[1]}` : '约 ¥126'}</span><button className="btn-text" onClick={() => setShowSources(true)}>查看来源 <Icon icon="mingcute:arrow-right-up-line" width="16" height="16" /></button></div></div>
        </div>
      </section>

      <section id="plan" className="plan-section section-wrap">
        <SectionRule />
        <div className="section-heading" data-reveal><div><div className="kicker">巷陌札记</div><h2>沿街拾味</h2></div><p>一味一巷，皆有来处。</p></div>
        <div className="field-toolbar"><span>店铺资料</span><button className="btn-text" onClick={requestLocation}><Icon icon="mingcute:location-line" width="16" height="16" />{locationState === 'loading' ? '定位中' : locationState === 'ready' ? '已更新距离' : '开启定位'}</button></div><div className="field-grid">{places.slice(0, 3).map((place, index) => <article key={place.id} className="field-card" data-reveal style={{ '--reveal-delay': `${index * 80}ms` }} role="button" tabIndex={0} onClick={() => setDetailPlace(place)} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setDetailPlace(place) } }}><div className="field-number">0{index + 1}</div><div><span className="tag tag-jade">{place.type}</span><h3>{place.name}</h3><p>{place.area} · {place.dish}</p><div className="field-data"><span><Icon icon="mingcute:map-pin-line" width="16" height="16" />{distanceTo(place) ? `距离 ${distanceTo(place)} km` : '定位后显示距离'}</span>{place.score && <span><Icon icon="mingcute:star-line" width="16" height="16" />喜爱值 {place.score}</span>}<span><Icon icon="mingcute:wallet-line" width="16" height="16" />{place.averagePrice || place.price}</span></div></div><span className="field-arrow" aria-hidden="true"><Icon icon="mingcute:arrow-right-up-line" width="20" height="20" /></span></article>)}</div>
        <div className="dish-more" data-reveal><button className="btn btn-ghost" onClick={openPlaces}><Icon icon="mingcute:store-line" width="18" height="18" />查看更多 · 全部店铺</button></div>
      </section>

      <section id="atlas" className="atlas-section section-wrap">
        <SectionRule />
        <div className="section-heading" data-reveal><div><div className="kicker">长安风味</div><h2>风味入长安</h2></div><p>一城风味，皆是长安烟火。</p></div>
        <div className="dish-grid">{filteredDishes.slice(0, 8).map((dish, index) => <article key={dish.id} className={`dish-card card ${selectedDish.id === dish.id ? 'is-selected' : ''}`} data-reveal style={{ '--reveal-delay': `${(index % 4) * 90}ms` }} onClick={() => { setSelectedDish(dish); setDetailDish(dish) }}><div className="dish-card-top"><span className="dish-index">{String(index + 1).padStart(2, '0')}</span><span className="dish-category">{dish.category}</span></div><div className="mini-canvas"><FoodImage dish={dish} compact /></div><div className="dish-info"><div><h3>{dish.name}</h3><p>{dish.note}</p><span className="dish-score" title={dish.scoreIsDefault ? '未显示平台评分，按规则展示 90.0' : '游陕西截图分值'}><Icon icon="mingcute:star-line" width="13" height="13" />喜爱值 {dish.score || '90.0'}</span></div><Icon icon="mingcute:arrow-right-up-line" width="20" height="20" /></div><div className="dish-tags">{dish.tags.map((tag) => <span key={tag} className="tag tag-gold">{tag}</span>)}</div></article>)}</div>
        <div className="dish-more" data-reveal><button className="btn btn-ghost" onClick={openCollection}><Icon icon="mingcute:book-6-line" width="18" height="18" />查看更多 · 打开收集册</button></div>
      </section>
    </main>
    )}

    <footer className="site-footer section-wrap" data-reveal><div className="footer-rule"><span /><i className="footer-motif" aria-hidden="true" /><span /></div><div className="footer-main"><div><div className="kicker">食游图鉴</div><h2>一味一巷，记住长安。</h2></div><p>烟火有迹，风味有名。</p></div><div className="footer-source"><Icon icon="mingcute:file-check-line" width="16" height="16" /><span>数据来源：游陕西小程序 · 用户提供榜单与店铺截图</span></div></footer>

    {detailDish && <Modal onClose={() => setDetailDish(null)} className="detail-modal" label={`${detailDish.name}详情`}><div className="detail-visual"><FoodImage dish={detailDish} /></div><div className="detail-body"><div className="kicker">味之笺</div><h2>{detailDish.name}</h2><p className="detail-note">{detailDish.note}</p><div className="detail-tags">{detailDish.tags.map((tag) => <span key={tag} className="tag tag-gold">{tag}</span>)}</div><div className="detail-block"><h4>一味小史</h4><p>{detailDish.history}</p><HistorySourceNote dish={detailDish} /></div><PreparationPanel dish={detailDish} /><div className="detail-block"><h4>附近怎么吃</h4><p>可在店铺资料中查找这道味道 · 价格以游陕西页面为准</p></div><button className="btn btn-primary" onClick={() => { setDetailDish(null); document.getElementById('explore')?.scrollIntoView({ behavior: 'smooth' }); setQuery(`想找适合吃${detailDish.name}的真实地点`) }}><Icon icon="mingcute:compass-line" width="20" height="20" />寻找这道味道</button></div></Modal>}
    {detailPlace && <Modal onClose={() => setDetailPlace(null)} className="place-modal" label={`${detailPlace.name}门店详情`}><div className="place-modal-hero"><div className="place-cover"><BrandMark compact /><span>{detailPlace.cuisine}</span></div><div className="place-title"><span className="kicker">门店食单</span><h2>{detailPlace.name}</h2><p>{detailPlace.area}</p></div></div><div className="place-modal-body"><div className="place-facts"><div><b>人均</b><span>{detailPlace.averagePrice}</span></div><div><b>菜系</b><span>{detailPlace.cuisine}</span></div><div><b>营业时间</b><span>{detailPlace.openingHours}</span></div></div><div className="place-info-row"><Icon icon="mingcute:fork-knife-line" width="21" height="21" /><span>{detailPlace.services?.join(' · ') || '堂食服务 · 特色推荐 · 交通指南'}</span></div><div className="place-info-row"><Icon icon="mingcute:map-pin-line" width="21" height="21" /><span>{detailPlace.address}</span><small>{distanceTo(detailPlace) ? `${distanceTo(detailPlace)} km` : '开启定位查看距离'}</small></div><div className="place-chip-row"><b>标签</b>{detailPlace.tags.map((tag) => <span key={tag} className="place-chip">{tag}</span>)}</div><div className="place-chip-row"><b>收录</b>{detailPlace.collections.map((item) => <span key={item} className="place-chip place-chip-source">{item}</span>)}</div><section className="place-intro"><h3>饭店简介</h3><p>{detailPlace.intro}</p></section><section className="place-menu"><div className="place-menu-heading"><h3>推荐菜单</h3><span>{detailPlace.menu.length} 道</span></div><div className="place-menu-grid">{detailPlace.menu.map((item) => { const linkedDish = item.dishId ? dishes.find((dish) => dish.id === item.dishId) : null; return <button key={item.name} className="place-menu-item" onClick={() => { if (linkedDish) { setDetailPlace(null); setDetailDish(linkedDish) } }} disabled={!linkedDish}><span className="place-menu-art"><Icon icon={linkedDish ? 'mingcute:bowl-line' : 'mingcute:fork-knife-line'} width="25" height="25" /></span><span><b>{item.name}</b><small>{item.note}{!linkedDish ? ' · 价格以门店为准' : ''}</small></span><Icon icon="mingcute:arrow-right-up-line" width="17" height="17" /></button> })}</div></section><p className="place-source-note">店铺信息参考游陕西小程序。</p></div></Modal>}
    {showSources && <Modal onClose={() => setShowSources(false)} className="source-modal" label="来源札记"><div className="kicker">来源札记</div><h2>一味一证</h2><p>每一条味道，都有来处。</p><div className="source-list">{sources.map((source) => <div key={source.id}><Icon icon={source.kind === 'place' ? 'mingcute:map-pin-line' : 'mingcute:file-line'} width="20" height="20" /><span><b>{source.title}</b><small>{source.note}</small></span><em>{source.verification}</em></div>)}</div></Modal>}
    <BackToTop onReset={() => setRevealSeed((v) => v + 1)} onHome={view !== 'home' ? () => { setView('home'); window.scrollTo(0, 0) } : undefined} />
  </div>
}

createRoot(document.getElementById('root')).render(<App />)

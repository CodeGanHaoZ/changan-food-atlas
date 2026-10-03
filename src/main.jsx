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
    </svg>
    <span className="flat-dish-caption">{dish?.category?.split(' · ')[0]}</span>
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
      <div className="preparation-item"><Icon icon="mingcute:spice-line" width="18" height="18" /><span><b>调味</b><small>{seasoning.join(' · ')}</small></span></div>
      <div className="preparation-item"><Icon icon="mingcute:fire-line" width="18" height="18" /><span><b>做法</b><small>{steps.join(' → ')}</small></span></div>
    </div>
  </div>
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

function TianDiMap({ stops }) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const markersRef = useRef([])
  const [mapReady, setMapReady] = useState(false)
  const [loadFailed, setLoadFailed] = useState(false)

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
    const points = []
    stops.forEach((place, index) => {
      if (!place.longitude || !place.latitude) return
      const lnglat = new T.LngLat(place.longitude, place.latitude)
      points.push(lnglat)
      const marker = new T.Marker(lnglat)
      map.addOverLay(marker)
      markersRef.current.push(marker)
      marker.addEventListener('click', (e) => {
        const firstDish = place.dish.split(' / ')[0]
        const infoWin = new T.InfoWindow()
        infoWin.setContent(`<div style="padding:12px;min-width:190px;background:#101513;color:#f3e9d2;font-size:12px;line-height:1.6;">
          <div style="margin-bottom:6px;color:#d7a855;font-size:14px;font-weight:600;">0${index + 1} · ${place.name}</div>
          <div style="margin-bottom:2px;color:#9aa79f;">${place.area} · ${place.type}</div>
          <div style="margin-bottom:2px;">味道：${place.dish}</div>
          <div style="margin-bottom:8px;color:#9aa79f;">${place.price} · 评分 ${place.score}</div>
          <div style="text-align:center;"><button style="padding:5px 14px;border:none;border-radius:4px;background:#b52f35;color:#fff;cursor:pointer;" onclick="window.__atlasOpenDish && window.__atlasOpenDish('${firstDish}')">查看这道味道</button></div>
        </div>`, { offset: new T.Point(0, -30) })
        map.openInfoWindow(infoWin, e.lnglat)
      })
    })
    if (points.length > 0) map.setViewport(points)
  }, [mapReady, stops])

  if (loadFailed) return <div className="tianditu-fallback">天地图加载失败，请检查网络后刷新。</div>
  return <div ref={containerRef} className="tianditu-map" />
}

function App() {
  const [selectedDish, setSelectedDish] = useState(dishes[0])
  const [detailDish, setDetailDish] = useState(null)
  const [query, setQuery] = useState('')
  const [activeTab, setActiveTab] = useState('图鉴')
  const [plan, setPlan] = useState(null)
  const [showSources, setShowSources] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  // 供天地图信息窗体按钮（原生 onclick）打开菜品详情
  useEffect(() => {
    window.__atlasOpenDish = (dishName) => setDetailDish(dishes.find((dish) => dish.name.includes(dishName)) || dishes[0])
    return () => { delete window.__atlasOpenDish }
  }, [])

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
      window.setTimeout(() => { setPlan({ ...route, note: '演示路线：地点、价格、评分和营业状态均来自本地 seed，正式版本需替换为可核验来源。' }); setIsGenerating(false) }, 420)
    } catch {
      setPlan({ title: '钟楼 · 备用路线', subtitle: '本地离线方案 · 来源待确认', stops: places, note: 'Agent 暂不可用，已回退到本地演示路线。' })
      setIsGenerating(false)
    }
  }

  return <div className="app-shell texture-paper">
    <div className="scroll-progress" />
    <header className="site-header">
      <a className="brand" href="#top" aria-label="长安食游图鉴首页"><BrandMark /><span><b>长安食游图鉴</b><small>八味 · 长安</small></span></a>
      <nav className="site-nav" aria-label="主导航">
        {['图鉴', '在地探索', '路线方案'].map((item) => <button key={item} className={activeTab === item ? 'nav-link is-active' : 'nav-link'} onClick={() => { setActiveTab(item); document.getElementById(item === '图鉴' ? 'atlas' : item === '在地探索' ? 'explore' : 'plan')?.scrollIntoView({ behavior: 'smooth' }) }}>{item}</button>)}
      </nav>
      <button className="btn btn-primary header-cta" onClick={() => document.getElementById('explore')?.scrollIntoView({ behavior: 'smooth' })}><Icon icon="mingcute:compass-line" width="20" height="20" />开始寻味</button>
    </header>

    <nav className="mobile-nav" aria-label="移动端主导航">
      <button className={activeTab === '图鉴' ? 'mobile-nav-item is-active' : 'mobile-nav-item'} onClick={() => { setActiveTab('图鉴'); document.getElementById('atlas')?.scrollIntoView({ behavior: 'smooth' }) }}><Icon icon={activeTab === '图鉴' ? 'mingcute:book-6-fill' : 'mingcute:book-6-line'} width="22" height="22" /><span>图鉴</span></button>
      <button className={activeTab === '在地探索' ? 'mobile-nav-item is-active' : 'mobile-nav-item'} onClick={() => { setActiveTab('在地探索'); document.getElementById('explore')?.scrollIntoView({ behavior: 'smooth' }) }}><Icon icon={activeTab === '在地探索' ? 'mingcute:compass-fill' : 'mingcute:compass-line'} width="22" height="22" /><span>探索</span></button>
      <button className={activeTab === '路线方案' ? 'mobile-nav-item is-active' : 'mobile-nav-item'} onClick={() => { setActiveTab('路线方案'); document.getElementById('plan')?.scrollIntoView({ behavior: 'smooth' }) }}><Icon icon={activeTab === '路线方案' ? 'mingcute:route-fill' : 'mingcute:route-line'} width="22" height="22" /><span>路线</span></button>
      <button className="mobile-nav-item" onClick={() => setShowSources(true)}><Icon icon="mingcute:file-line" width="22" height="22" /><span>来源</span></button>
    </nav>

    <main id="top">
      <section className="hero section-wrap">
        <div className="hero-copy">
          <div className="kicker">长安 · 食游</div>
          <h1>长安寻味</h1>
          <p className="hero-lead">钟楼听晨钟，巷里寻真香。</p>
          <div className="hero-actions"><button className="btn btn-primary" onClick={() => document.getElementById('atlas')?.scrollIntoView({ behavior: 'smooth' })}><Icon icon="mingcute:book-6-line" width="20" height="20" />看八味</button><button className="btn btn-ghost" onClick={() => generatePlan('钟楼附近 · 2 小时 · 3 种小吃')}><Icon icon="mingcute:route-line" width="20" height="20" />寻一程</button></div>
        </div>
        <div className="hero-stage card">
          <div className="stage-label"><span>当前图鉴</span><strong>{selectedDish.category}</strong></div>
          <div className="hero-canvas"><DishCanvas dish={selectedDish} /></div>
          <div className="stage-caption"><div><span className="kicker">01 / 08</span><h2>{selectedDish.name}</h2><p>{selectedDish.note}</p></div><IconButton icon="mingcute:arrow-right-up-line" label="查看菜品详情" onClick={() => setDetailDish(selectedDish)} /></div>
          <div className="stage-ingredients" aria-label="主要食材"><span className="stage-ingredients-title">入味</span>{selectedDish.ingredients.slice(0, 4).map((ingredient, index) => <span key={ingredient}><i>{String(index + 1).padStart(2, '0')}</i>{ingredient}</span>)}</div>
          <div className="stage-steps" aria-label="制作步骤"><span className="stage-steps-title">做法</span><div className="stage-step-track">{selectedDish.steps.slice(0, 3).map((step, index) => <span key={step}><i>{String(index + 1).padStart(2, '0')}</i>{step}</span>)}</div></div>
          <span className="hero-motif" aria-hidden="true" />
        </div>
      </section>

      <section id="atlas" className="atlas-section section-wrap">
        <SectionRule />
        <div className="section-heading"><div><div className="kicker">长安八味</div><h2>八味入长安</h2></div><p>一城八味，皆是长安烟火。</p></div>
        <div className="dish-grid">{filteredDishes.map((dish, index) => <article key={dish.id} className={`dish-card card ${selectedDish.id === dish.id ? 'is-selected' : ''}`} onClick={() => { setSelectedDish(dish); setDetailDish(dish) }}><div className="dish-card-top"><span className="dish-index">0{index + 1}</span><span className="dish-category">{dish.category}</span></div><div className="mini-canvas"><DishCanvas dish={dish} compact /></div><div className="dish-info"><div><h3>{dish.name}</h3><p>{dish.note}</p></div><Icon icon="mingcute:arrow-right-up-line" width="20" height="20" /></div><div className="dish-tags">{dish.tags.map((tag) => <span key={tag} className="tag tag-gold">{tag}</span>)}</div></article>)}</div>
      </section>

      <section id="explore" className="explore-section section-wrap">
        <SectionRule />
        <div className="section-heading"><div><div className="kicker">在地寻味</div><h2>去哪吃，怎么吃</h2></div><p>循着一味，走入一街。</p></div>
        <div className="explore-layout">
          <div className="agent-panel card"><div className="panel-top"><span className="panel-number">02</span><span className="status-chip"><i />演示资料已载入</span></div><h3>写下你的寻味条件</h3><p className="panel-copy">一念所向，皆可入巷。</p><div className="query-box"><textarea value={query} maxLength={160} onChange={(e) => setQuery(e.target.value)} placeholder="钟楼 · 两小时 · 想吃热面" /><div className="query-footer"><span>{query.length}/160</span><button className="btn btn-primary btn-small" onClick={() => generatePlan(query || '钟楼附近 · 2 小时 · 3 种小吃')} disabled={isGenerating}><Icon icon={isGenerating ? 'mingcute:loading-3-line' : 'mingcute:sparkles-2-line'} width="18" height="18" />{isGenerating ? '整理中' : '落笔成行'}</button></div></div><div className="preset-row"><span>一念：</span><button onClick={() => generatePlan('钟楼附近 · 2 小时 · 3 种小吃')}>钟楼听钟</button><button onClick={() => generatePlan('想找巷子里的油泼面 · 人均 30')}>巷里热面</button><button onClick={() => generatePlan('低预算 · 适合外带 · 不去连锁店')}>轻装寻味</button></div></div>
          <div className="map-panel card"><div className="map-top"><div><span className="kicker">A WALK THROUGH FLAVOR</span><h3>{plan ? plan.title : '一条还没落笔的路线'}</h3></div><IconButton icon="mingcute:more-2-line" label="更多路线选项" /></div><div className="route-canvas"><TianDiMap stops={plan ? plan.stops : places} /></div><div className="map-footer"><span><Icon icon="mingcute:time-line" width="17" height="17" />{plan ? plan.durationMin >= 120 ? `${Math.round(plan.durationMin / 60)} 小时` : `${plan.durationMin} 分钟` : '2 小时'}</span><span><Icon icon="mingcute:wallet-line" width="17" height="17" />{plan ? `约 ¥${plan.budgetRange[1]}` : '约 ¥126'}</span><button className="btn-text" onClick={() => setShowSources(true)}>查看来源 <Icon icon="mingcute:arrow-right-up-line" width="16" height="16" />来源</button></div></div>
        </div>
      </section>

      <section id="plan" className="plan-section section-wrap">
        <SectionRule />
        <div className="section-heading"><div><div className="kicker">巷陌札记</div><h2>沿街拾味</h2></div><p>一味一巷，皆有来处。</p></div>
        <div className="field-grid">{places.map((place, index) => <article key={place.id} className="field-card"><div className="field-number">0{index + 1}</div><div><span className="tag tag-jade">{place.type}</span><span className="tag tag-gold" style={{ marginLeft: 6 }}>演示数据</span><h3>{place.name}</h3><p>{place.area} · {place.dish}</p><div className="field-data"><span><Icon icon="mingcute:map-pin-line" width="16" height="16" />{place.distance}</span><span><Icon icon="mingcute:star-line" width="16" height="16" />{place.score}</span><span><Icon icon="mingcute:wallet-line" width="16" height="16" />{place.price}</span></div></div><button className="field-arrow" onClick={() => setDetailDish(dishes.find((dish) => dish.name.includes(place.dish.split(' / ')[0])) || dishes[0])} aria-label={`查看${place.name}`}><Icon icon="mingcute:arrow-right-up-line" width="20" height="20" /></button></article>)}</div>
      </section>
    </main>

    <footer className="site-footer section-wrap"><div className="footer-rule"><span /><BrandMark compact /><span /></div><div className="footer-main"><div><div className="kicker">食游图鉴</div><h2>一味一巷，记住长安。</h2></div><p>烟火有迹，风味有名。</p></div><div className="footer-bottom"><span>长安食游图鉴 · 西安</span><span>演示章</span></div></footer>

    {detailDish && <div className="modal-backdrop" onClick={() => setDetailDish(null)}><div className="detail-modal" onClick={(e) => e.stopPropagation()}><button className="modal-close" onClick={() => setDetailDish(null)} aria-label="关闭"><Icon icon="mingcute:close-line" width="22" height="22" /></button><div className="detail-visual"><DishCanvas dish={detailDish} /></div><div className="detail-body"><div className="kicker">味之笺</div><h2>{detailDish.name}</h2><p className="detail-note">{detailDish.note}</p><div className="detail-tags">{detailDish.tags.map((tag) => <span key={tag} className="tag tag-gold">{tag}</span>)}</div><div className="detail-block"><h4>一味小史</h4><p>{detailDish.history}</p></div><div className="detail-block"><h4>食材拆解</h4><div className="ingredient-list">{detailDish.ingredients.map((ingredient) => <span key={ingredient}><i />{ingredient}</span>)}</div></div><div className="detail-block"><h4>附近怎么吃</h4><p>关联 {detailDish.locations} 个地点 · 当前公开价格 {detailDish.price}</p></div><button className="btn btn-primary" onClick={() => { setDetailDish(null); document.getElementById('explore')?.scrollIntoView({ behavior: 'smooth' }); setQuery(`想找适合吃${detailDish.name}的真实地点`) }}><Icon icon="mingcute:compass-line" width="20" height="20" />寻找这道味道</button></div></div></div>}
    {showSources && <div className="modal-backdrop" onClick={() => setShowSources(false)}><div className="source-modal" onClick={(e) => e.stopPropagation()}><button className="modal-close" onClick={() => setShowSources(false)} aria-label="关闭"><Icon icon="mingcute:close-line" width="22" height="22" /></button><div className="kicker">来源札记</div><h2>一味一证</h2><p>每一条味道，都有来处。</p><div className="source-list">{sources.slice(0, 5).map((source) => <div key={source.id}><Icon icon={source.kind === 'map_poi' ? 'mingcute:map-pin-line' : 'mingcute:file-line'} width="20" height="20" /><span><b>{source.title}</b><small>{source.note}</small></span><em>{source.verification === 'demo' ? '演示资料' : source.verification}</em></div>)}</div></div></div>}
  </div>
}

createRoot(document.getElementById('root')).render(<App />)

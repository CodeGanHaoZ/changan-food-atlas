import React, { useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import { Float, OrbitControls, RoundedBox, Sparkles } from '@react-three/drei'
import { Icon } from '@iconify/react'
import './styles.css'
import { dishes, places, sources } from './data/atlasSeed.js'
import { parseExploreQuery } from './services/agentApi.js'
import { buildRoute } from './services/routeApi.js'

function IconButton({ icon, label, onClick, active = false }) {
  return <button className={`icon-btn ${active ? 'is-active' : ''}`} aria-label={label} title={label} onClick={onClick}><Icon icon={icon} width="20" height="20" /></button>
}

function DishModel({ dish, compact = false }) {
  const tone = dish?.tone || '#b56e4a'
  const accent = dish?.accent || '#d7a855'
  return <group>
    <Float speed={compact ? 0.8 : 1.1} rotationIntensity={compact ? 0.08 : 0.18} floatIntensity={compact ? 0.15 : 0.3}>
      <group rotation={[0.08, -0.24, 0.02]}>
        <mesh position={[0, -0.65, 0]}>
          <cylinderGeometry args={[1.45, 1.18, 0.2, 48]} />
          <meshStandardMaterial color="#252a26" metalness={0.4} roughness={0.3} />
        </mesh>
        <mesh position={[0, -0.52, 0]}>
          <cylinderGeometry args={[1.12, 0.95, 0.1, 48]} />
          <meshStandardMaterial color="#101513" metalness={0.1} roughness={0.6} />
        </mesh>
        <RoundedBox args={[1.65, 0.54, 0.92]} radius={0.18} smoothness={4} position={[-0.05, 0.03, 0]} rotation={[0.06, 0.12, -0.08]}>
          <meshStandardMaterial color={tone} roughness={0.65} />
        </RoundedBox>
        <mesh position={[0.02, 0.05, 0.49]} rotation={[0.08, 0.12, -0.08]}>
          <boxGeometry args={[1.15, 0.28, 0.05]} />
          <meshStandardMaterial color={accent} roughness={0.7} />
        </mesh>
        <mesh position={[0.1, 0.35, 0.02]} rotation={[0.08, 0.1, 0.1]}>
          <torusGeometry args={[0.56, 0.08, 10, 32]} />
          <meshStandardMaterial color={accent} roughness={0.45} />
        </mesh>
        <mesh position={[-0.65, 0.25, 0.24]} rotation={[0.25, 0.1, 0.2]}>
          <sphereGeometry args={[0.13, 16, 12]} />
          <meshStandardMaterial color="#61a76e" roughness={0.7} />
        </mesh>
        <mesh position={[-0.37, 0.38, 0.2]} rotation={[0.2, 0.4, -0.4]}>
          <sphereGeometry args={[0.11, 16, 12]} />
          <meshStandardMaterial color="#b2bd65" roughness={0.7} />
        </mesh>
      </group>
    </Float>
    {!compact && <Sparkles count={18} scale={3.4} size={1.4} speed={0.22} color={accent} noise={1} />}
  </group>
}

function DishCanvas({ dish, compact = false }) {
  return <Canvas camera={{ position: [0, 1.1, compact ? 4.5 : 5.3], fov: 34 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
    <ambientLight intensity={1.6} />
    <directionalLight position={[3, 4, 4]} intensity={3} color="#f2d49b" />
    <directionalLight position={[-3, 1, 2]} intensity={1.5} color="#d64545" />
    <DishModel dish={dish} compact={compact} />
    {!compact && <OrbitControls enablePan={false} minDistance={3.5} maxDistance={7} autoRotate autoRotateSpeed={0.45} />}
  </Canvas>
}

function SectionRule() { return <div className="section-rule" aria-hidden="true"><span /><img src="/motifs/wall-crenellation.svg" alt="" /><span /></div> }

function App() {
  const [selectedDish, setSelectedDish] = useState(dishes[0])
  const [detailDish, setDetailDish] = useState(null)
  const [query, setQuery] = useState('')
  const [activeTab, setActiveTab] = useState('图鉴')
  const [plan, setPlan] = useState(null)
  const [showSources, setShowSources] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

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
      <a className="brand" href="#top" aria-label="长安食游图鉴首页"><span className="brand-seal">长安</span><span><b>长安食游图鉴</b><small>XI'AN FOOD ATLAS</small></span></a>
      <nav className="site-nav" aria-label="主导航">
        {['图鉴', '在地探索', '路线方案'].map((item) => <button key={item} className={activeTab === item ? 'nav-link is-active' : 'nav-link'} onClick={() => { setActiveTab(item); document.getElementById(item === '图鉴' ? 'atlas' : item === '在地探索' ? 'explore' : 'plan')?.scrollIntoView({ behavior: 'smooth' }) }}>{item}</button>)}
      </nav>
      <button className="btn btn-primary header-cta" onClick={() => document.getElementById('explore')?.scrollIntoView({ behavior: 'smooth' })}><Icon icon="mingcute:compass-line" width="20" height="20" />开始寻味</button>
    </header>

    <main id="top">
      <section className="hero section-wrap">
        <div className="hero-copy">
          <div className="kicker">XI'AN FOOD ATLAS · 2026</div>
          <h1>长安寻味</h1>
          <p className="hero-lead">先看懂一味，再走进一街。用 3D 图鉴认识西安的八种日常，再把一道菜带回真实的巷口、面馆和街边摊。</p>
          <div className="hero-actions"><button className="btn btn-primary" onClick={() => document.getElementById('atlas')?.scrollIntoView({ behavior: 'smooth' })}><Icon icon="mingcute:book-6-line" width="20" height="20" />浏览八味图鉴</button><button className="btn btn-ghost" onClick={() => generatePlan('钟楼附近 · 2 小时 · 3 种小吃')}><Icon icon="mingcute:route-line" width="20" height="20" />生成探索路线</button></div>
          <div className="hero-meta"><span><i className="meta-dot" />8 道西安代表美食</span><span><i className="meta-dot" />地点与吃法结构</span><span><i className="meta-dot" />来源状态可见</span></div>
        </div>
        <div className="hero-stage card">
          <div className="stage-label"><span>当前图鉴</span><strong>{selectedDish.pinyin}</strong></div>
          <div className="hero-canvas"><DishCanvas dish={selectedDish} /></div>
          <div className="stage-caption"><div><span className="kicker">01 / 08</span><h2>{selectedDish.name}</h2><p>{selectedDish.note}</p></div><IconButton icon="mingcute:arrow-right-up-line" label="查看菜品详情" onClick={() => setDetailDish(selectedDish)} /></div>
          <img className="hero-motif" src="/motifs/zhonglou.svg" alt="" aria-hidden="true" />
        </div>
      </section>

      <section id="atlas" className="atlas-section section-wrap">
        <SectionRule />
        <div className="section-heading"><div><div className="kicker">THE EIGHT FLAVORS</div><h2>八味入长安</h2></div><p>前四道是西安四件套，后四道把面食、汤食、甜食与老字号的记忆补完整。</p></div>
        <div className="dish-grid">{filteredDishes.map((dish, index) => <article key={dish.id} className={`dish-card card ${selectedDish.id === dish.id ? 'is-selected' : ''}`} onClick={() => { setSelectedDish(dish); setDetailDish(dish) }}><div className="dish-card-top"><span className="dish-index">0{index + 1}</span><span className="dish-category">{dish.category}</span></div><div className="mini-canvas"><DishCanvas dish={dish} compact /></div><div className="dish-info"><div><h3>{dish.name}</h3><p>{dish.note}</p></div><Icon icon="mingcute:arrow-right-up-line" width="20" height="20" /></div><div className="dish-tags">{dish.tags.map((tag) => <span key={tag} className="tag tag-gold">{tag}</span>)}</div></article>)}</div>
      </section>

      <section id="explore" className="explore-section section-wrap">
        <SectionRule />
        <div className="section-heading"><div><div className="kicker">LOCAL DISCOVERY AGENT</div><h2>去哪吃，怎么吃</h2></div><p>告诉我你现在在哪里、还有多少时间，以及想要的吃法。路线会保留来源、营业状态和替代方案。</p></div>
        <div className="explore-layout">
          <div className="agent-panel card"><div className="panel-top"><span className="panel-number">02</span><span className="status-chip"><i />演示 seed 已载入</span></div><h3>写下你的寻味条件</h3><p className="panel-copy">例如：我在钟楼附近，有两个小时，想边走边吃三种小吃，不想去连锁店。</p><div className="query-box"><textarea value={query} maxLength={160} onChange={(e) => setQuery(e.target.value)} placeholder="描述位置、时间、预算和想吃的方式…" /><div className="query-footer"><span>{query.length}/160</span><button className="btn btn-primary btn-small" onClick={() => generatePlan(query || '钟楼附近 · 2 小时 · 3 种小吃')} disabled={isGenerating}><Icon icon={isGenerating ? 'mingcute:loading-3-line' : 'mingcute:sparkles-2-line'} width="18" height="18" />{isGenerating ? '整理中' : '开始规划'}</button></div></div><div className="preset-row"><span>试试：</span><button onClick={() => generatePlan('钟楼附近 · 2 小时 · 3 种小吃')}>钟楼附近两小时</button><button onClick={() => generatePlan('想找巷子里的油泼面 · 人均 30')}>巷子里的油泼面</button><button onClick={() => generatePlan('低预算 · 适合外带 · 不去连锁店')}>低预算小店</button></div></div>
          <div className="map-panel card"><div className="map-top"><div><span className="kicker">A WALK THROUGH FLAVOR</span><h3>{plan ? plan.title : '一条还没落笔的路线'}</h3></div><IconButton icon="mingcute:more-2-line" label="更多路线选项" /></div><div className="route-canvas"><div className="route-line" /><div className="route-grid" />{(plan ? plan.stops : places).map((place, index) => <button key={place.id} className="route-stop" style={{ top: `${22 + index * 27}%`, left: `${16 + (index % 2) * 42}%` }} onClick={() => setDetailDish(dishes.find((dish) => dish.name.includes(place.dish.split(' / ')[0])) || dishes[0])}><span className="stop-marker">0{index + 1}</span><span><b>{place.name}</b><small>{place.dish}</small></span></button>)}<div className="map-label label-a">钟楼</div><div className="map-label label-b">洒金桥</div><div className="map-label label-c">城墙南门</div></div><div className="map-footer"><span><Icon icon="mingcute:time-line" width="17" height="17" />{plan ? plan.durationMin >= 120 ? `${Math.round(plan.durationMin / 60)} 小时` : `${plan.durationMin} 分钟` : '2 小时'}</span><span><Icon icon="mingcute:wallet-line" width="17" height="17" />{plan ? `约 ¥${plan.budgetRange[1]}` : '约 ¥126'}</span><button className="btn-text" onClick={() => setShowSources(true)}>查看来源 <Icon icon="mingcute:arrow-right-up-line" width="16" height="16" /></button></div></div>
        </div>
      </section>

      <section id="plan" className="plan-section section-wrap">
        <SectionRule />
        <div className="section-heading"><div><div className="kicker">FIELD NOTES</div><h2>这次，去现场</h2></div><p>菜品、地点和吃法需要一起理解。每一站都给出真实信息的时间语境，让探索有准备，也保留一点偶遇。</p></div>
        <div className="field-grid">{places.map((place, index) => <article key={place.id} className="field-card"><div className="field-number">0{index + 1}</div><div><span className="tag tag-jade">{place.type}</span><span className="tag tag-gold" style={{ marginLeft: 6 }}>演示数据</span><h3>{place.name}</h3><p>{place.area} · {place.dish}</p><div className="field-data"><span><Icon icon="mingcute:map-pin-line" width="16" height="16" />{place.distance}</span><span><Icon icon="mingcute:star-line" width="16" height="16" />{place.score}</span><span><Icon icon="mingcute:wallet-line" width="16" height="16" />{place.price}</span></div></div><button className="field-arrow" onClick={() => setDetailDish(dishes.find((dish) => dish.name.includes(place.dish.split(' / ')[0])) || dishes[0])} aria-label={`查看${place.name}`}><Icon icon="mingcute:arrow-right-up-line" width="20" height="20" /></button></article>)}</div>
      </section>
    </main>

    <footer className="site-footer section-wrap"><div className="footer-rule"><span /><span className="seal-small">长安</span><span /></div><div className="footer-main"><div><div className="kicker">CHANG'AN FOOD ATLAS</div><h2>把一座城的味道，交给下一步。</h2></div><p>首期数据为演示结构，正式参赛版本将以真实菜单、地点和来源记录替换。</p></div><div className="footer-bottom"><span>长安食游图鉴 · 西安</span><span>数据状态：演示 seed · 2026.10.04</span></div></footer>

    {detailDish && <div className="modal-backdrop" onClick={() => setDetailDish(null)}><div className="detail-modal" onClick={(e) => e.stopPropagation()}><button className="modal-close" onClick={() => setDetailDish(null)} aria-label="关闭"><Icon icon="mingcute:close-line" width="22" height="22" /></button><div className="detail-visual"><DishCanvas dish={detailDish} /></div><div className="detail-body"><div className="kicker">DISH ATLAS · {detailDish.pinyin}</div><h2>{detailDish.name}</h2><p className="detail-note">{detailDish.note}</p><div className="detail-tags">{detailDish.tags.map((tag) => <span key={tag} className="tag tag-gold">{tag}</span>)}</div><div className="detail-block"><h4>一味小史</h4><p>{detailDish.history}</p></div><div className="detail-block"><h4>食材拆解</h4><div className="ingredient-list">{detailDish.ingredients.map((ingredient) => <span key={ingredient}><i />{ingredient}</span>)}</div></div><div className="detail-block"><h4>附近怎么吃</h4><p>关联 {detailDish.locations} 个地点 · 当前公开价格 {detailDish.price}</p></div><button className="btn btn-primary" onClick={() => { setDetailDish(null); document.getElementById('explore')?.scrollIntoView({ behavior: 'smooth' }); setQuery(`想找适合吃${detailDish.name}的真实地点`) }}><Icon icon="mingcute:compass-line" width="20" height="20" />寻找这道味道</button></div></div></div>}
    {showSources && <div className="modal-backdrop" onClick={() => setShowSources(false)}><div className="source-modal" onClick={(e) => e.stopPropagation()}><button className="modal-close" onClick={() => setShowSources(false)} aria-label="关闭"><Icon icon="mingcute:close-line" width="22" height="22" /></button><div className="kicker">SOURCE REGISTER</div><h2>这条路线从哪里来</h2><p>当前展示的是结构化来源登记。所有条目标注为演示 seed，正式版本逐条替换为真实菜单、地点或文旅资料。</p><div className="source-list">{sources.slice(0, 5).map((source) => <div key={source.id}><Icon icon={source.kind === 'map_poi' ? 'mingcute:map-pin-line' : 'mingcute:file-line'} width="20" height="20" /><span><b>{source.title}</b><small>{source.note}</small></span><em>{source.verification === 'demo' ? '演示 seed' : source.verification}</em></div>)}</div></div></div>}
  </div>
}

createRoot(document.getElementById('root')).render(<App />)

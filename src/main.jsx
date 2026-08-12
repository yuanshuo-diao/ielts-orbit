import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import {
  ArrowUpRight, Bell, BookOpen, Bot, ChevronRight, CircleHelp,
  Headphones, LayoutDashboard, LineChart, Mic2, PenLine, Search,
  Settings, Sparkles, Target, UserRound, Waves
} from 'lucide-react'
import './styles.css'

// Replace these local values with API responses when the OpenAI integration is ready.
const learner = { name: 'Bruce', overall: 6.6, target: 7.5, streak: 12, hours: 41.5 }
const subjects = [
  { name: 'Listening', score: 7.0, target: 7.5, icon: Headphones, color: 'cyan', note: 'Part 3 的同义替换需要巩固', progress: 84 },
  { name: 'Reading', score: 6.5, target: 7.5, icon: BookOpen, color: 'violet', note: '判断题正确率正在提升', progress: 70 },
  { name: 'Writing', score: 6.0, target: 7.0, icon: PenLine, color: 'orange', note: 'Task 2 论证深度是关键', progress: 55 },
  { name: 'Speaking', score: 6.5, target: 7.0, icon: Mic2, color: 'pink', note: '表达流利度仍有上升空间', progress: 64 }
]
const trend = [6.0, 6.1, 6.15, 6.1, 6.25, 6.35, 6.32, 6.48, 6.45, 6.58, 6.52, 6.6]

function ScoreRing({ value, size = 132 }) {
  const radius = 48, circumference = 2 * Math.PI * radius, offset = circumference - ((value - 4) / 4) * circumference
  return <div className="score-ring" style={{ width: size, height: size }}>
    <svg viewBox="0 0 120 120" aria-label={`当前预测分数 ${value}`}>
      <circle className="ring-track" cx="60" cy="60" r={radius} />
      <circle className="ring-value" cx="60" cy="60" r={radius} strokeDasharray={circumference} strokeDashoffset={offset} />
    </svg>
    <div className="ring-label"><strong>{value.toFixed(1)}</strong><span>Predicted</span></div>
  </div>
}

function TrendChart() {
  const width = 650, height = 220, min = 5.8, max = 7.0
  const points = trend.map((v, i) => `${(i / (trend.length - 1)) * width},${height - ((v - min) / (max - min)) * (height - 24) - 12}`).join(' ')
  const area = `0,${height} ${points} ${width},${height}`
  return <div className="chart-wrap">
    <div className="chart-labels"><span>7.0</span><span>6.5</span><span>6.0</span></div>
    <svg className="trend-chart" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" role="img" aria-label="过去十二周总分预测趋势，从 6.0 上升到 6.6">
      <defs><linearGradient id="area-gradient" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#625bd5"/><stop offset="1" stopColor="#625bd5" stopOpacity="0"/></linearGradient></defs>
      {[36, 110, 184].map(y => <line key={y} x1="0" x2={width} y1={y} y2={y} />)}
      <polygon points={area} className="area" />
      <polyline points={points} className="line" />
      {trend.map((v, i) => <circle key={i} cx={(i / (trend.length - 1)) * width} cy={height - ((v - min) / (max - min)) * (height - 24) - 12} r={i === trend.length - 1 ? 5 : 2.5} className={i === trend.length - 1 ? 'last-dot' : 'dot'} />)}
    </svg>
    <div className="chart-months"><span>May 06</span><span>May 20</span><span>Jun 03</span><span>Jun 17</span><span>Jul 01</span><span>Jul 15</span></div>
  </div>
}

function Sidebar({ page, setPage }) {
  const nav = [[LayoutDashboard, 'Dashboard'], [Bot, 'AI Coach'], [LineChart, 'Progress']]
  return <aside className="sidebar">
    <div className="brand"><div className="brand-mark"><Waves size={22}/></div><span>IELTS <b>Orbit</b></span></div>
    <nav>{nav.map(([Icon, name]) => <button key={name} className={page === name ? 'nav-item active' : 'nav-item'} onClick={() => setPage(name)}><Icon size={18}/>{name}</button>)}</nav>
    <div className="nav-caption">PRACTICE</div>
    <nav>{subjects.map(({ icon: Icon, name }) => <button className="nav-item" key={name}><Icon size={18}/>{name}</button>)}</nav>
    <div className="sidebar-bottom"><button className="nav-item"><Settings size={18}/>Settings</button><div className="profile"><div className="avatar">B</div><div><strong>Bruce</strong><span>IELTS Candidate</span></div><ChevronRight size={16}/></div></div>
  </aside>
}

function Dashboard() {
  return <>
    <section className="hero"><div><p className="eyebrow">THURSDAY, JULY 23</p><h1>Good morning, Bruce <span>✦</span></h1><p className="subtitle">Small, intentional steps today. You're building toward <b>7.5.</b></p></div><button className="focus-button"><Target size={17}/> Today’s focus <ChevronRight size={16}/></button></section>
    <section className="overview-grid">
      <div className="overall-card surface"><div><p className="eyebrow">OVERALL PREDICTION</p><h2>{learner.overall.toFixed(1)} <small>/ {learner.target.toFixed(1)}</small></h2><p className="up"><ArrowUpRight size={15}/> +0.2 from last month</p></div><ScoreRing value={learner.overall}/></div>
      <div className="target-card surface"><div className="target-icon"><Target size={20}/></div><div><p className="eyebrow">YOUR TARGET</p><h3>Overall 7.5</h3><p>0.9 points to go</p></div><span className="target-date">DEC<br/><b>2026</b></span></div>
      <div className="streak-card surface"><div className="streak-number">{learner.streak}<span>day</span></div><div><p className="eyebrow">CURRENT STREAK</p><p>Keep the momentum alive</p></div><div className="flame">♨</div></div>
    </section>
    <section className="section-heading"><div><h2>Skills snapshot</h2><p>Your current performance across the four IELTS skills.</p></div><button className="text-button">View details <ArrowUpRight size={15}/></button></section>
    <section className="skills-grid">{subjects.map(({name, score, target, icon: Icon, color, note, progress}) => <article className="skill-card surface" key={name}><div className="skill-top"><div className={`subject-icon ${color}`}><Icon size={19}/></div><button className="more">•••</button></div><h3>{name}</h3><div className="skill-score"><b>{score.toFixed(1)}</b><span>Target {target.toFixed(1)}</span></div><div className="progress-line"><i style={{ width: `${progress}%` }} className={color}/></div><p className="skill-note">{note}</p></article>)}</section>
    <section className="lower-grid"><article className="surface trend-card"><div className="card-header"><div><h2>Overall progress</h2><p>Predicted band score · last 12 weeks</p></div><div className="chart-current"><b>6.6</b><span>Current</span></div></div><TrendChart /></article><CoachBrief /></section>
  </>
}

function CoachBrief() { return <article className="coach-brief"><div className="coach-orb"><Sparkles size={24}/></div><p className="eyebrow">YOUR AI COACH</p><h2>The biggest lift is in Writing.</h2><p>Improving Task Response and lexical precision could add <b>0.5</b> to your overall score.</p><button>See my plan <ArrowUpRight size={16}/></button></article> }

function CoachPage() { return <><section className="hero"><div><p className="eyebrow">AI COACH · DAILY BRIEF</p><h1>Your path to <span>7.5</span></h1><p className="subtitle">A focused plan built from your latest practice data.</p></div><div className="ai-status"><span/> Analysis updated today</div></section><section className="coach-layout"><article className="coach-main surface"><div className="coach-intro"><div className="coach-orb"><Sparkles size={26}/></div><div><p className="eyebrow">TODAY'S PRIORITY</p><h2>Strengthen your Writing Task 2 argument.</h2></div></div><p className="coach-copy">Your ideas are relevant, but development often stops one step early. Today, practise adding a precise example and explaining its consequence for each main point.</p><div className="practice-box"><PenLine size={19}/><div><strong>25-min focused drill</strong><span>Write one body paragraph on education · then self-check with the prompt.</span></div><button>Start practice <ChevronRight size={16}/></button></div></article><aside className="coach-side surface"><p className="eyebrow">WEEKLY FOCUS</p><h3>3 sessions left</h3><div className="weekly-bars">{[1,1,1,0,0].map((v,i)=><i className={v?'done':''} key={i}/>)}</div><p>Complete 2 writing drills and 1 speaking session to stay on plan.</p></aside></section><section className="section-heading"><div><h2>What I’m seeing</h2><p>Patterns extracted from your recent learning records.</p></div></section><div className="insight-list">{[['Writing', 'Task Response', 'Your main ideas need a clearer “why this matters” sentence.', 'High impact'], ['Reading', 'True / False / Not Given', 'Accuracy has risen to 72% — keep using evidence before inference.', 'On track'], ['Speaking', 'Fluency & coherence', 'Pauses increase when you explain abstract ideas. Use one simple structure.', 'Next up']].map(([s,t,d,tag], i)=><article className="insight surface" key={t}><div className={`insight-index i${i+1}`}>0{i+1}</div><div><span>{s}</span><h3>{t}</h3><p>{d}</p></div><div className="tag">{tag}</div><ChevronRight className="chev" size={19}/></article>)}</div></> }

function App() {
  const [page, setPage] = useState('Dashboard')
  return <div className="app-shell"><Sidebar page={page} setPage={setPage}/><main><header><div className="crumb">Personal workspace <ChevronRight size={14}/> <b>{page}</b></div><div className="header-actions"><button aria-label="Search"><Search size={19}/></button><button className="notification" aria-label="Notifications"><Bell size={19}/><i/></button><button aria-label="Help"><CircleHelp size={19}/></button></div></header><div className="page-content">{page === 'AI Coach' ? <CoachPage/> : <Dashboard/>}</div></main></div>
}

createRoot(document.getElementById('root')).render(<App />)

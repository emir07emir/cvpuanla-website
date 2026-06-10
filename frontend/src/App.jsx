import { useState, useRef, useMemo } from "react"
import './App.css'

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"

// ——— SVG Icon Components ———
function UploadIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
    </svg>
  )
}

function FileIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  )
}

function SparkleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
    </svg>
  )
}

function CheckCircleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  )
}

function AlertIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
    </svg>
  )
}

function LightBulbIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
    </svg>
  )
}

function RefreshIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182M2.985 19.644l3.181-3.182" />
    </svg>
  )
}

function ErrorCircleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
    </svg>
  )
}

function LinkIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
    </svg>
  )
}

function DocumentTextIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
    </svg>
  )
}

function BriefcaseIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
  )
}

function XMarkIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  )
}

// ——— Score Ring Component ———
function ScoreRing({ score, label }) {
  const radius = 58
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  const scoreClass = score >= 80 ? 'excellent' : score >= 60 ? 'good' : score >= 40 ? 'average' : 'poor'
  const scoreLabel = score >= 80 ? 'Mükemmel' : score >= 60 ? 'İyi' : score >= 40 ? 'Orta' : 'Geliştirilmeli'

  return (
    <div className="score-card">
      <div className="score-label">{label || 'Genel Puan'}</div>
      <div className="score-value-wrapper">
        <svg className="score-ring" viewBox="0 0 140 140">
          <circle className="score-ring-bg" cx="70" cy="70" r={radius} />
          <circle
            className={`score-ring-fill ${scoreClass}`}
            cx="70"
            cy="70"
            r={radius}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <span className="score-number">{score}</span>
      </div>
      <div className={`score-desc ${scoreClass}`}>{scoreLabel}</div>
    </div>
  )
}

// ——— Detail Card Component ———
function DetailCard({ title, items, type }) {
  const iconMap = {
    success: <CheckCircleIcon />,
    warning: <AlertIcon />,
    info: <LightBulbIcon />
  }

  return (
    <div className="detail-card">
      <div className="detail-card-header">
        <div className={`detail-card-icon ${type}`}>
          {iconMap[type]}
        </div>
        <h3 className="detail-card-title">{title}</h3>
      </div>
      <ul className="detail-card-list">
        {items.map((item, i) => (
          <li key={i} className="detail-card-item">
            <span className={`detail-card-item-bullet ${type}`} />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

// ——— Skill Tags Component ———
function SkillTags({ title, skills, type, icon }) {
  return (
    <div className="skill-card">
      <div className="skill-card-header">
        <div className={`detail-card-icon ${type}`}>
          {icon}
        </div>
        <h3 className="detail-card-title">{title}</h3>
        <span className={`skill-count ${type}`}>{skills.length}</span>
      </div>
      <div className="skill-tags">
        {skills.map((skill, i) => (
          <span key={i} className={`skill-tag ${type}`}>
            <span className="skill-tag-icon">
              {type === 'success' ? <CheckIcon /> : <XMarkIcon />}
            </span>
            {skill}
          </span>
        ))}
      </div>
    </div>
  )
}

// ——— Summary Card Component ———
function SummaryCard({ text }) {
  return (
    <div className="summary-card">
      <div className="summary-card-header">
        <div className="detail-card-icon info">
          <DocumentTextIcon />
        </div>
        <h3 className="detail-card-title">Genel Değerlendirme</h3>
      </div>
      <p className="summary-text">{text}</p>
    </div>
  )
}

// ——— Icon: User Group ———
function UserGroupIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
    </svg>
  )
}

function ChatBubbleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
    </svg>
  )
}

function RocketIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 0 1-2.448-2.448 14.9 14.9 0 0 1 .06-.312m-2.24 2.39a4.493 4.493 0 0 0-1.757 4.306 4.493 4.493 0 0 0 4.306-1.758M16.5 9a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
    </svg>
  )
}

function ShieldIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.249-8.25-3.286Zm0 13.036h.008v.008H12v-.008Z" />
    </svg>
  )
}

// ——— HR Dashboard Component ———
function HrDashboard({ yorumlar, isMatching }) {
  if (!yorumlar) return null

  const cards = [
    {
      key: 'genel_degerlendirme',
      title: 'Genel Değerlendirme',
      icon: <UserGroupIcon />,
      color: 'violet',
      text: yorumlar.genel_degerlendirme
    },
    {
      key: 'mulakat_tavsiyesi',
      title: 'Mülakat Tavsiyesi',
      icon: <ChatBubbleIcon />,
      color: 'info',
      text: yorumlar.mulakat_tavsiyesi
    },
    {
      key: isMatching ? 'ise_alim_riski' : 'kariyer_potansiyeli',
      title: isMatching ? 'İşe Alım Riski' : 'Kariyer Potansiyeli',
      icon: isMatching ? <ShieldIcon /> : <RocketIcon />,
      color: isMatching ? 'warning' : 'success',
      text: isMatching ? yorumlar.ise_alim_riski : yorumlar.kariyer_potansiyeli
    },
    {
      key: 'dikkat_edilmesi_gerekenler',
      title: 'Dikkat Edilmesi Gerekenler',
      icon: <AlertIcon />,
      color: 'danger',
      text: yorumlar.dikkat_edilmesi_gerekenler
    }
  ]

  return (
    <div className="hr-dashboard" id="hr-dashboard">
      <div className="hr-dashboard-header">
        <div className="hr-dashboard-badge">
          <UserGroupIcon />
          <span>İK Uzman Görüşü</span>
        </div>
        <p className="hr-dashboard-subtitle">Yapay zeka destekli uzman İK değerlendirmesi</p>
      </div>
      <div className="hr-grid">
        {cards.map((card, i) => (
          card.text && (
            <div key={card.key} className={`hr-card hr-card-${card.color}`} style={{ animationDelay: `${300 + i * 100}ms` }}>
              <div className="hr-card-header">
                <div className={`hr-card-icon ${card.color}`}>
                  {card.icon}
                </div>
                <h4 className="hr-card-title">{card.title}</h4>
              </div>
              <p className="hr-card-text">{card.text}</p>
            </div>
          )
        ))}
      </div>
    </div>
  )
}

// ——— Main App ———
function App() {
  const [dosya, setDosya] = useState(null)
  const [sonuc, setSonuc] = useState(null)
  const [yukleniyor, setYukleniyor] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [hata, setHata] = useState(null)
  const [ilanUrl, setIlanUrl] = useState('')
  const [ilanMetin, setIlanMetin] = useState('')
  const [girisTipi, setGirisTipi] = useState('url') // 'url' veya 'metin'
  const [mod, setMod] = useState(null) // null = henüz analiz yapılmadı, 'analiz' veya 'eslestirme'
  const fileInputRef = useRef(null)

  function dosyaSec(event) {
    const secilenDosya = event.target.files[0]
    if (secilenDosya) {
      setDosya(secilenDosya)
      setSonuc(null)
      setHata(null)
    }
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragging(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setDosya(droppedFile)
      setSonuc(null)
      setHata(null)
    }
  }

  function handleDragOver(e) {
    e.preventDefault()
    setDragging(true)
  }

  function handleDragLeave(e) {
    e.preventDefault()
    setDragging(false)
  }

  function dosyaKaldir() {
    setDosya(null)
    setSonuc(null)
    setHata(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  function sifirla() {
    setDosya(null)
    setSonuc(null)
    setHata(null)
    setYukleniyor(false)
    setIlanUrl('')
    setIlanMetin('')
    setMod(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const ilanVar = girisTipi === 'url' ? ilanUrl.trim().length > 0 : ilanMetin.trim().length > 0

  async function analizEt() {
    if (!dosya) return

    setYukleniyor(true)
    setHata(null)

    try {
      const formData = new FormData()
      formData.append("dosya", dosya)

      // İlan bilgisi varsa eşleştirme endpoint'ini kullan
      if (ilanVar) {
        if (girisTipi === 'url') {
          formData.append("ilan_url", ilanUrl.trim())
        } else {
          formData.append("ilan_metin", ilanMetin.trim())
        }

        const yanit = await fetch(`${API_BASE_URL}/eslestir`, {
          method: "POST",
          body: formData
        })
        const veri = await yanit.json()

        if (veri.hata) {
          setHata(veri.hata)
          setSonuc(null)
        } else {
          setSonuc(veri)
          setMod('eslestirme')
          setHata(null)
        }
      } else {
        // Sadece CV analizi
        const yanit = await fetch(`${API_BASE_URL}/analiz`, {
          method: "POST",
          body: formData
        })
        const veri = await yanit.json()

        if (veri.hata) {
          setHata(veri.hata)
          setSonuc(null)
        } else {
          setSonuc(veri)
          setMod('analiz')
          setHata(null)
        }
      }
    } catch (err) {
      setHata("Sunucuya bağlanılamadı. Lütfen backend'in çalıştığından emin olun.")
    } finally {
      setYukleniyor(false)
    }
  }

  const dosyaBoyutu = useMemo(() => {
    if (!dosya) return ''
    const kb = dosya.size / 1024
    if (kb < 1024) return `${kb.toFixed(1)} KB`
    return `${(kb / 1024).toFixed(1)} MB`
  }, [dosya])

  return (
    <div className="app">
      <div className="app-container">
        {/* Header */}
        <header className="header">
          <div className="header-badge">
            <span className="header-badge-dot" />
            Yapay Zeka Destekli
          </div>
          <h1>CV Analiz</h1>
          <p>CV'nizi yükleyin, yapay zeka güçlü ve zayıf yönlerinizi analiz etsin. İsterseniz bir iş ilanıyla eşleştirin.</p>
        </header>

        {/* Upload & Input Area */}
        {!yukleniyor && !sonuc && (
          <>
            {/* File Drop Zone */}
            <div
              id="drop-zone"
              className={`drop-zone ${dragging ? 'dragging' : ''} ${dosya ? 'has-file' : ''}`}
              onClick={() => !dosya && fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={dosyaSec}
                className="drop-zone-input"
                id="file-input"
              />
              {!dosya ? (
                <>
                  <div className="drop-zone-icon">
                    <UploadIcon />
                  </div>
                  <div className="drop-zone-title">
                    PDF dosyanızı sürükleyin veya <span>seçin</span>
                  </div>
                  <div className="drop-zone-subtitle">
                    Maksimum 10MB • Sadece PDF formatı
                  </div>
                </>
              ) : (
                <div className="file-info">
                  <div className="file-icon">
                    <FileIcon />
                  </div>
                  <div className="file-details">
                    <div className="file-name">{dosya.name}</div>
                    <div className="file-size">{dosyaBoyutu}</div>
                  </div>
                  <button
                    className="file-remove"
                    onClick={(e) => { e.stopPropagation(); dosyaKaldir() }}
                    id="remove-file-btn"
                    title="Dosyayı kaldır"
                  >
                    <CloseIcon />
                  </button>
                </div>
              )}
            </div>

            {/* Job Posting Section (Optional) */}
            <div className="job-section" id="job-section">
              <div className="job-section-header">
                <div className="job-section-label">
                  <BriefcaseIcon />
                  <span>İş İlanı Eşleştirme</span>
                  <span className="job-optional-badge">Opsiyonel</span>
                </div>
              </div>

              {/* Toggle: URL vs Text */}
              <div className="input-toggle">
                <button
                  className={`toggle-btn ${girisTipi === 'url' ? 'active' : ''}`}
                  onClick={() => setGirisTipi('url')}
                  id="toggle-url"
                >
                  <LinkIcon />
                  URL
                </button>
                <button
                  className={`toggle-btn ${girisTipi === 'metin' ? 'active' : ''}`}
                  onClick={() => setGirisTipi('metin')}
                  id="toggle-text"
                >
                  <DocumentTextIcon />
                  Metin
                </button>
              </div>

              {girisTipi === 'url' ? (
                <div className="url-input-wrapper">
                  <div className="url-input-icon">
                    <LinkIcon />
                  </div>
                  <input
                    type="url"
                    className="url-input"
                    placeholder="https://kariyer.net/is-ilani/..."
                    value={ilanUrl}
                    onChange={(e) => setIlanUrl(e.target.value)}
                    id="job-url-input"
                  />
                  {ilanUrl && (
                    <button
                      className="url-clear"
                      onClick={() => setIlanUrl('')}
                      title="Temizle"
                    >
                      <CloseIcon />
                    </button>
                  )}
                </div>
              ) : (
                <textarea
                  className="text-input"
                  placeholder="İş ilanı metnini buraya yapıştırın..."
                  value={ilanMetin}
                  onChange={(e) => setIlanMetin(e.target.value)}
                  rows={5}
                  id="job-text-input"
                />
              )}

              {ilanVar && (
                <div className="job-hint success">
                  <CheckCircleIcon />
                  <span>İlan bilgisi eklendi — CV'niz bu ilanla eşleştirilecek</span>
                </div>
              )}
              {!ilanVar && (
                <div className="job-hint neutral">
                  <span>İlan eklemezseniz sadece genel CV analizi yapılır</span>
                </div>
              )}
            </div>

            {/* Analyze Button */}
            <button
              id="analyze-btn"
              className="analyze-btn"
              onClick={analizEt}
              disabled={!dosya}
            >
              <SparkleIcon />
              {ilanVar ? 'Eşleştir ve Analiz Et' : 'Analiz Et'}
            </button>
          </>
        )}

        {/* Loading State */}
        {yukleniyor && (
          <div className="loading-container">
            <div className="loading-spinner" />
            <div className="loading-text">
              {ilanVar ? 'CV ve ilan eşleştiriliyor...' : 'CV analiz ediliyor...'}
            </div>
            <div className="loading-subtext">
              {ilanVar
                ? 'İlan sayfası okunuyor ve CV ile karşılaştırılıyor, bu birkaç saniye sürebilir.'
                : 'Yapay zeka CV\'nizi inceliyor, bu birkaç saniye sürebilir.'}
            </div>
          </div>
        )}

        {/* Error State */}
        {hata && !yukleniyor && (
          <div className="error-card" id="error-card">
            <div className="error-icon">
              <ErrorCircleIcon />
            </div>
            <div>
              <div className="error-title">Bir hata oluştu</div>
              <div className="error-message">{hata}</div>
            </div>
          </div>
        )}

        {/* Results: Standard Analysis */}
        {sonuc && !yukleniyor && mod === 'analiz' && (
          <div className="results" id="results-section">
            <div className="results-header">
              <h2 className="results-title">Analiz Sonuçları</h2>
              <button className="results-reset" onClick={sifirla} id="reset-btn">
                <RefreshIcon />
                Yeni Analiz
              </button>
            </div>

            <ScoreRing score={sonuc.puan} label="Genel Puan" />

            <div className="detail-grid">
              <DetailCard title="Güçlü Yönler" items={sonuc.guclu_yonler || []} type="success" />
              <DetailCard title="Zayıf Yönler" items={sonuc.zayif_yonler || []} type="warning" />
              <DetailCard title="Öneriler" items={sonuc.oneriler || []} type="info" />
            </div>

            <HrDashboard yorumlar={sonuc.ik_yorumlari} isMatching={false} />
          </div>
        )}

        {/* Results: Job Matching */}
        {sonuc && !yukleniyor && mod === 'eslestirme' && (
          <div className="results" id="results-section">
            <div className="results-header">
              <h2 className="results-title">Eşleştirme Sonuçları</h2>
              <button className="results-reset" onClick={sifirla} id="reset-btn">
                <RefreshIcon />
                Yeni Analiz
              </button>
            </div>

            <ScoreRing score={sonuc.uyum_puani} label="Uyum Puanı" />

            {sonuc.ozet && <SummaryCard text={sonuc.ozet} />}

            <div className="skill-grid">
              <SkillTags
                title="Eşleşen Beceriler"
                skills={sonuc.eslesen_beceriler || []}
                type="success"
                icon={<CheckCircleIcon />}
              />
              <SkillTags
                title="Eksik Beceriler"
                skills={sonuc.eksik_beceriler || []}
                type="danger"
                icon={<AlertIcon />}
              />
            </div>

            <div className="detail-grid">
              <DetailCard title="Öneriler" items={sonuc.oneriler || []} type="info" />
            </div>

            <HrDashboard yorumlar={sonuc.ik_yorumlari} isMatching={true} />
          </div>
        )}

        {/* Footer */}
        <footer className="footer">
          <p>
            <span>CV Analiz</span> — Yapay zeka ile desteklenmektedir
          </p>
        </footer>
      </div>
    </div>
  )
}

export default App
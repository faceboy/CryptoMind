import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ChartBarIcon, 
  ArrowDownTrayIcon, 
  SignalIcon, 
  BeakerIcon, 
  StarIcon, 
  BriefcaseIcon, 
  BellIcon,
  SunIcon,
  MoonIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import Dashboard from './pages/Dashboard'
import BackfillPage from './pages/Backfill'
import WatchlistPage from './pages/Watchlist'
import SignalsPage from './pages/Signals'
import ComparePage from './pages/Compare'
import PortfolioPage from './pages/Portfolio'
import AlertsPage from './pages/Alerts'
import './index.css'

interface NavItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

const navItems: NavItem[] = [
  { id: 'dash', label: 'Dashboard', icon: ChartBarIcon },
  { id: 'backfill', label: 'Backfill', icon: ArrowDownTrayIcon },
  { id: 'signals', label: 'Signals', icon: SignalIcon },
  { id: 'compare', label: 'Compare', icon: BeakerIcon },
  { id: 'watch', label: 'Watchlist', icon: StarIcon },
  { id: 'portfolio', label: 'Portfolio', icon: BriefcaseIcon },
  { id: 'alerts', label: 'Alerts', icon: BellIcon },
]

function ThemeToggle() {
  const [dark, setDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
             (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
    }
    return false
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="btn"
      onClick={() => setDark(d => !d)}
    >
      <motion.div
        initial={false}
        animate={{ rotate: dark ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {dark ? <MoonIcon className="w-4 h-4" /> : <SunIcon className="w-4 h-4" />}
      </motion.div>
      <span className="hidden sm:inline">
        {dark ? 'Dark' : 'Light'}
      </span>
    </motion.button>
  )
}

function Sidebar({ activeTab, setActiveTab, isOpen, setIsOpen }: {
  activeTab: string
  setActiveTab: (tab: string) => void
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}) {
  return (
    <>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: isOpen ? 0 : '-100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed lg:static inset-y-0 left-0 z-50 w-64 lg:w-auto flex flex-col gap-6 
                   border-r border-[rgb(var(--border))] p-6 bg-[rgb(var(--bg-secondary))] 
                   backdrop-blur-xl lg:backdrop-blur-none shadow-xl lg:shadow-none"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-[rgb(var(--accent))] to-[rgb(var(--accent-hover))] 
                           rounded-lg flex items-center justify-center">
              <ChartBarIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[rgb(var(--text-primary))]">CryptoMind</h1>
              <p className="text-xs text-[rgb(var(--text-muted))]">Analytics Platform</p>
            </div>
          </motion.div>
          
          <button
            className="lg:hidden p-2 hover:bg-[rgb(var(--bg-tertiary))] rounded-lg transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          {navItems.map((item, index) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            
            return (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setActiveTab(item.id)
                  setIsOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left 
                           transition-all duration-200 group relative overflow-hidden
                           ${isActive 
                             ? 'bg-[rgb(var(--accent))] text-white shadow-lg' 
                             : 'hover:bg-[rgb(var(--bg-tertiary))] text-[rgb(var(--text-secondary))] hover:text-[rgb(var(--text-primary))]'
                           }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-[rgb(var(--accent))] rounded-lg"
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  />
                )}
                <Icon className={`w-5 h-5 relative z-10 transition-transform group-hover:scale-110
                                ${isActive ? 'text-white' : ''}`} />
                <span className="relative z-10 font-medium">{item.label}</span>
              </motion.button>
            )
          })}
        </nav>

        {/* Theme toggle */}
        <div className="pt-4 border-t border-[rgb(var(--border))]">
          <ThemeToggle />
        </div>
      </motion.aside>
    </>
  )
}

export default function App() {
  const [activeTab, setActiveTab] = useState('dash')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const renderPage = () => {
    switch (activeTab) {
      case 'dash': return <Dashboard />
      case 'backfill': return <BackfillPage />
      case 'signals': return <SignalsPage />
      case 'compare': return <ComparePage />
      case 'watch': return <WatchlistPage />
      case 'portfolio': return <PortfolioPage />
      case 'alerts': return <AlertsPage />
      default: return <Dashboard />
    }
  }

  return (
    <div className="min-h-screen bg-[rgb(var(--bg-primary))] lg:grid lg:grid-cols-[280px_1fr]">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />
      
      <main className="flex flex-col min-h-screen">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center justify-between p-4 border-b border-[rgb(var(--border))] 
                          bg-[rgb(var(--bg-secondary))] backdrop-blur-xl">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-[rgb(var(--bg-tertiary))] rounded-lg transition-colors"
          >
            <Bars3Icon className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-2">
            <ChartBarIcon className="w-6 h-6 text-[rgb(var(--accent))]" />
            <h1 className="text-lg font-bold">CryptoMind</h1>
          </div>
          
          <ThemeToggle />
        </header>

        {/* Page content */}
        <div className="flex-1 p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}

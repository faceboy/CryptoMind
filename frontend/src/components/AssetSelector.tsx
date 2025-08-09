import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MagnifyingGlassIcon,
  ChevronDownIcon,
  StarIcon,
  XMarkIcon,
  TagIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'
import { getAssets, getAssetCategories, getAssetsByCategory, addToWatchlist, removeFromWatchlist, getWatchlist } from '../api'
import Card from './ui/Card'
import Input from './ui/Input'
import Button from './ui/Button'

interface Asset {
  id: number
  symbol: string
  name: string
  category: string
  market_cap_rank: number
  description: string
  website: string
  binance_symbol?: string
  coingecko_id?: string
  is_active: boolean
}

interface AssetSelectorProps {
  selectedSymbol: string
  onSymbolChange: (symbol: string) => void
  className?: string
}

const categoryColors: Record<string, string> = {
  'Layer 1': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'Layer 2': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'DeFi': 'bg-green-500/20 text-green-400 border-green-500/30',
  'Gaming': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  'Meme': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'Stablecoin': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  'Exchange': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'Privacy': 'bg-red-500/20 text-red-400 border-red-500/30',
  'Infrastructure': 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
  'AI': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  'Oracle': 'bg-teal-500/20 text-teal-400 border-teal-500/30',
  'Payment': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  'Storage': 'bg-violet-500/20 text-violet-400 border-violet-500/30',
  'Media': 'bg-rose-500/20 text-rose-400 border-rose-500/30',
  'Data': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  'Supply Chain': 'bg-lime-500/20 text-lime-400 border-lime-500/30'
}

export default function AssetSelector({ selectedSymbol, onSymbolChange, className = '' }: AssetSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [assets, setAssets] = useState<Asset[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [watchlist, setWatchlist] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [assetsData, categoriesData, watchlistData] = await Promise.all([
        getAssets(),
        getAssetCategories(),
        getWatchlist().catch(() => [])
      ])
      
      setAssets(assetsData)
      setCategories(['All', ...categoriesData.map((c: any) => c.category)])
      setWatchlist(watchlistData.map((w: any) => w.symbol))
    } catch (error) {
      console.error('Failed to load assets:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || asset.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleWatchlistToggle = async (symbol: string, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      if (watchlist.includes(symbol)) {
        await removeFromWatchlist(symbol)
        setWatchlist(prev => prev.filter(s => s !== symbol))
      } else {
        await addToWatchlist(symbol)
        setWatchlist(prev => [...prev, symbol])
      }
    } catch (error) {
      console.error('Failed to update watchlist:', error)
    }
  }

  const selectedAsset = assets.find(a => a.symbol === selectedSymbol)

  return (
    <div className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 bg-[rgb(var(--bg-secondary))] 
                   border border-[rgb(var(--border))] rounded-lg hover:bg-[rgb(var(--bg-tertiary))] 
                   transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          {selectedAsset && (
            <div className={`px-2 py-1 rounded text-xs border ${
              categoryColors[selectedAsset.category] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'
            }`}>
              {selectedAsset.category}
            </div>
          )}
          <div>
            <div className="font-medium text-[rgb(var(--text-primary))]">
              {selectedSymbol}
            </div>
            {selectedAsset && (
              <div className="text-sm text-[rgb(var(--text-muted))]">
                {selectedAsset.name}
              </div>
            )}
          </div>
        </div>
        <ChevronDownIcon className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown Content */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-2 z-50"
            >
              <Card className="max-h-96 overflow-hidden">
                {/* Search and Filters */}
                <div className="p-4 border-b border-[rgb(var(--border))] space-y-3">
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[rgb(var(--text-muted))]" />
                    <input
                      type="text"
                      placeholder="Search assets..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-[rgb(var(--bg-tertiary))] border border-[rgb(var(--border))] 
                               rounded-lg text-[rgb(var(--text-primary))] placeholder-[rgb(var(--text-muted))]
                               focus:outline-none focus:ring-2 focus:ring-[rgb(var(--accent))] focus:border-transparent"
                    />
                  </div>
                  
                  {/* Category Filter */}
                  <div className="flex flex-wrap gap-2">
                    {categories.map(category => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                          selectedCategory === category
                            ? 'bg-[rgb(var(--accent))] text-white border-[rgb(var(--accent))]'
                            : 'bg-[rgb(var(--bg-tertiary))] text-[rgb(var(--text-secondary))] border-[rgb(var(--border))] hover:bg-[rgb(var(--bg-secondary))]'
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Asset List */}
                <div className="max-h-64 overflow-y-auto">
                  {loading ? (
                    <div className="p-4 text-center text-[rgb(var(--text-muted))]">
                      Loading assets...
                    </div>
                  ) : filteredAssets.length === 0 ? (
                    <div className="p-4 text-center text-[rgb(var(--text-muted))]">
                      No assets found
                    </div>
                  ) : (
                    filteredAssets.map(asset => (
                      <motion.button
                        key={asset.symbol}
                        whileHover={{ backgroundColor: 'rgb(var(--bg-tertiary))' }}
                        onClick={() => {
                          onSymbolChange(asset.symbol)
                          setIsOpen(false)
                        }}
                        className="w-full p-3 text-left hover:bg-[rgb(var(--bg-tertiary))] transition-colors
                                 border-b border-[rgb(var(--border))] last:border-b-0"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex flex-col">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-[rgb(var(--text-primary))]">
                                  {asset.symbol}
                                </span>
                                {asset.market_cap_rank && (
                                  <span className="text-xs text-[rgb(var(--text-muted))] bg-[rgb(var(--bg-tertiary))] px-1.5 py-0.5 rounded">
                                    #{asset.market_cap_rank}
                                  </span>
                                )}
                              </div>
                              <span className="text-sm text-[rgb(var(--text-muted))]">
                                {asset.name}
                              </span>
                            </div>
                            <div className={`px-2 py-1 rounded text-xs border ${
                              categoryColors[asset.category] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                            }`}>
                              {asset.category}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {asset.website && (
                              <a
                                href={asset.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="p-1 hover:bg-[rgb(var(--bg-secondary))] rounded transition-colors"
                              >
                                <GlobeAltIcon className="w-4 h-4 text-[rgb(var(--text-muted))]" />
                              </a>
                            )}
                            <button
                              onClick={(e) => handleWatchlistToggle(asset.symbol, e)}
                              className="p-1 hover:bg-[rgb(var(--bg-secondary))] rounded transition-colors"
                            >
                              {watchlist.includes(asset.symbol) ? (
                                <StarIconSolid className="w-4 h-4 text-yellow-500" />
                              ) : (
                                <StarIcon className="w-4 h-4 text-[rgb(var(--text-muted))]" />
                              )}
                            </button>
                          </div>
                        </div>
                        
                        {asset.description && (
                          <div className="mt-2 text-xs text-[rgb(var(--text-muted))] line-clamp-2">
                            {asset.description}
                          </div>
                        )}
                      </motion.button>
                    ))
                  )}
                </div>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth'
import { NewsViewState, ProductNews } from '@/types/product-news'
import { productNews, LATEST_VERSION } from '@/data/product-news'

const NEWS_VIEW_KEY = 'archimede_news_view'
const PAGE_SIZE = 5

export function useProductNews() {
  const [hasUnread, setHasUnread] = useState(false)
  const [displayedNews, setDisplayedNews] = useState<ProductNews[]>([])
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const { user } = useAuth()

  // Load view state from localStorage
  const loadViewState = useCallback((): NewsViewState | null => {
    if (!user) return null
    const stored = localStorage.getItem(`${NEWS_VIEW_KEY}_${user.id}`)
    return stored ? JSON.parse(stored) : null
  }, [user])

  // Save view state to localStorage
  const saveViewState = useCallback((state: NewsViewState) => {
    if (!user) return
    localStorage.setItem(`${NEWS_VIEW_KEY}_${user.id}`, JSON.stringify(state))
  }, [user])

  // Check if there are unread news
  const checkUnread = useCallback(() => {
    const viewState = loadViewState()
    setHasUnread(!viewState || viewState.lastViewedVersion !== LATEST_VERSION)
  }, [loadViewState])

  // Initialize news state
  const initializeNews = useCallback(() => {
    const initialItems = productNews.slice(0, PAGE_SIZE)
    setDisplayedNews(initialItems)
    setPage(2) // Next page will be 2
    setHasMore(productNews.length > PAGE_SIZE)
  }, [])

  // Load more news items
  const loadMore = useCallback(() => {
    const start = (page - 1) * PAGE_SIZE
    const end = start + PAGE_SIZE
    const newItems = productNews.slice(start, end)
    
    if (newItems.length > 0) {
      setDisplayedNews(prev => [...prev, ...newItems])
      setPage(prev => prev + 1)
    }
    
    if (end >= productNews.length) {
      setHasMore(false)
    }
  }, [page])

  // Mark all news as read
  const markAllAsRead = useCallback(() => {
    if (!user) return

    const viewState: NewsViewState = {
      lastViewedVersion: LATEST_VERSION,
      lastViewedAt: new Date().toISOString()
    }
    saveViewState(viewState)
    setHasUnread(false)
  }, [user, saveViewState])

  // Initialize on mount
  useEffect(() => {
    initializeNews()
  }, [initializeNews])

  // Check for unread news on mount and when user changes
  useEffect(() => {
    checkUnread()
  }, [checkUnread])

  return {
    news: displayedNews,
    hasUnread,
    hasMore,
    loadMore,
    markAllAsRead
  }
}

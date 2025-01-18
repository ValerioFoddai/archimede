import { useEffect, useRef, useCallback } from "react"
import { Megaphone } from "lucide-react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { useProductNews } from "@/hooks/useProductNews"
import { Badge } from "@/components/ui/badge"
import { VersionType } from "@/types/product-news"

const versionBadgeVariants: Record<VersionType, "default" | "secondary" | "destructive"> = {
  patch: "default",
  minor: "secondary",
  major: "destructive"
}

export default function ProductNewsPage() {
  const { news, markAllAsRead, hasMore, loadMore } = useProductNews()
  const observerTarget = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore()
        }
      },
      { threshold: 0.1 }
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => observer.disconnect()
  }, [hasMore, loadMore])

  useEffect(() => {
    try {
      markAllAsRead()
    } catch (error) {
      console.error('Error marking news as read:', error)
    }
  }, [markAllAsRead])

  return (
    <DashboardLayout>
      <div className="container py-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <Megaphone className="h-7 w-7" />
            <h1 className="text-3xl font-bold tracking-tight">Product News</h1>
          </div>
          <p className="text-muted-foreground mt-2">
            Stay up to date with the latest features and improvements
          </p>
        </div>


        <div className="pr-4">
          {news.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-sm text-muted-foreground">No updates available</p>
            </div>
          ) : (
            <>
              {news.map((item) => (
                <div key={item.id} className="mb-12 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-semibold">{item.title}</h2>
                    <Badge variant={versionBadgeVariants[item.versionType]}>
                      v{item.version}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {new Date(item.publishedAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <p className="text-base">{item.description}</p>
                {item.changes.length > 0 && (
                  <ul className="list-disc pl-6 space-y-2">
                    {item.changes.map((change, index) => (
                      <li key={index} className="text-base">
                        {change}
                      </li>
                    ))}
                  </ul>
                )}
                <hr className="mt-8" />
              </div>
              ))}
              {hasMore && (
                <div 
                  ref={observerTarget} 
                  className="h-10 w-full flex items-center justify-center py-8"
                >
                  <p className="text-sm text-muted-foreground">Loading more...</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

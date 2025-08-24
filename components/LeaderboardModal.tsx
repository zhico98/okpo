"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

interface LeaderboardModalProps {
  onClose: () => void
  isMobile: boolean
  scores?: Array<{ player_name: string; score: number }>
  onRefresh?: () => void
}

interface ScoreEntry {
  player_name: string
  score: number
}

export default function LeaderboardModal({ onClose, isMobile, scores = [], onRefresh }: LeaderboardModalProps) {
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  const handleRefresh = async () => {
    try {
      setRefreshing(true)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      if (onRefresh) {
        onRefresh()
      }
    } finally {
      setRefreshing(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-2">
      <div
        className={`bg-black/95 ${isMobile ? "p-4 mx-2" : "p-8 mx-4"} rounded-lg border-2 border-white ${isMobile ? "w-full max-w-sm" : "max-w-md w-full"} relative shadow-2xl`}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-white hover:text-gray-300 text-xl font-bold">
          ×
        </button>

        <h2
          className={`${isMobile ? "text-lg" : "text-xl"} font-bold mb-6 text-white text-center`}
          style={{
            fontFamily: '"8-BIT WONDER", monospace',
          }}
        >
          全球排行榜
        </h2>

        {refreshing ? (
          <div className="text-center mb-6">
            <div className="inline-block w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
            <p
              className="text-white text-center"
              style={{
                fontFamily: '"8-BIT WONDER", monospace',
              }}
            >
              加载中...
            </p>
          </div>
        ) : scores.length === 0 ? (
          <p
            className="text-white text-center mb-6"
            style={{
              fontFamily: '"8-BIT WONDER", monospace',
            }}
          >
            暂无分数
          </p>
        ) : (
          <div className="space-y-2 mb-6">
            {scores.slice(0, 10).map((entry, index) => (
              <div
                key={index}
                className="flex justify-between items-center bg-gray-800 p-3 rounded-md border border-gray-600"
              >
                <span
                  className="text-white font-bold"
                  style={{
                    fontFamily: '"8-BIT WONDER", monospace',
                  }}
                >
                  {index + 1}. {entry.player_name}
                </span>
                <span
                  className="text-white font-bold"
                  style={{
                    fontFamily: '"8-BIT WONDER", monospace',
                  }}
                >
                  {entry.score}
                </span>
              </div>
            ))}
          </div>
        )}
        <div className="text-center">
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            className={`bg-gray-800 hover:bg-gray-700 text-white font-bold border border-gray-600 ${isMobile ? "px-4 py-2" : "px-6 py-3"} shadow-lg disabled:opacity-50`}
            style={{
              fontFamily: '"8-BIT WONDER", monospace',
              boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
            }}
          >
            刷新排行榜
          </Button>
        </div>
      </div>
    </div>
  )
}

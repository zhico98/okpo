"use client"

interface LeaderboardModalProps {
  onClose: () => void
  isMobile: boolean
}

interface ScoreEntry {
  player_name: string
  score: number
}

const FAKE_SCORES: ScoreEntry[] = [
  { player_name: "子阳", score: 2087 },
  { player_name: "浩然", score: 1923 },
  { player_name: "君尧", score: 1756 },
  { player_name: "死的", score: 1542 },
  { player_name: "明泽", score: 1234 },
]

export default function LeaderboardModal({ onClose, isMobile }: LeaderboardModalProps) {
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

        <div className="space-y-2 mb-6">
          {FAKE_SCORES.map((entry, index) => (
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
      </div>
    </div>
  )
}

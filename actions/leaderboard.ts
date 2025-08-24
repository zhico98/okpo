// Simple in-memory storage for leaderboard (fallback solution)
let leaderboardData = [{ player_name: "ROYCE", score: 666, wallet_address: null }]

export async function saveScore(formData: FormData) {
  const playerName = formData.get("playerName") as string
  const score = Number.parseInt(formData.get("score") as string)
  const walletAddress = formData.get("walletAddress") as string

  if (!playerName || isNaN(score)) {
    return { success: false, message: "Invalid player name or score." }
  }

  try {
    leaderboardData.push({
      player_name: playerName,
      score: score,
      wallet_address: walletAddress || null,
    })

    leaderboardData = leaderboardData.sort((a, b) => b.score - a.score).slice(0, 10)

    return { success: true, message: "Score saved successfully!" }
  } catch (error) {
    console.error("Error saving score:", error)
    return { success: false, message: "Failed to save score." }
  }
}

export async function getLeaderboardScores() {
  try {
    return leaderboardData.sort((a, b) => b.score - a.score).slice(0, 10)
  } catch (error) {
    console.error("Error fetching leaderboard scores:", error)
    return []
  }
}

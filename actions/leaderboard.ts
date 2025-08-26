import { supabase } from "@/lib/supabase/client"

export async function saveScore(formData: FormData) {
  const playerName = formData.get("playerName") as string
  const score = Number.parseInt(formData.get("score") as string)
  const walletAddress = formData.get("walletAddress") as string

  if (!playerName || isNaN(score)) {
    return { success: false, message: "Invalid player name or score." }
  }

  try {
    const { error } = await supabase.from("leaderboard").insert({
      player_name: playerName,
      score: score,
      wallet_address: walletAddress || null,
    })

    if (error) {
      console.error("Supabase error:", error)
      return { success: false, message: "Failed to save score to database." }
    }

    return { success: true, message: "Score saved successfully!" }
  } catch (error) {
    console.error("Error saving score:", error)
    return { success: false, message: "Failed to save score." }
  }
}

export async function getLeaderboardScores() {
  try {
    const { data, error } = await supabase
      .from("leaderboard")
      .select("*")
      .order("score", { ascending: false })
      .limit(10)

    if (error) {
      console.error("Supabase error:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error fetching leaderboard scores:", error)
    return []
  }
}

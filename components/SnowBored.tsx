"use client"

import type React from "react"
import { useEffect, useRef, useState, useCallback } from "react"
import { GAME_CONSTANTS, COLORS, IMAGES } from "../constants"
import { Button } from "@/components/ui/button"
import LeaderboardModal from "./LeaderboardModal"
import SaveScoreFormModal from "./SaveScoreFormModal"

interface Obstacle {
  x: number
  y: number
  sprite: HTMLImageElement
  isFinnObstacle?: boolean
  isTreasure?: boolean
}

interface Player {
  x: number
  y: number
  velocityY: number
  isMovingUp: boolean
  sprite: HTMLImageElement | null
  specialAbilityActive: boolean
  specialAbilityCooldown: number
  specialAbilityDuration: number
  characterIndex: number
  displayWidth: number
  displayHeight: number
  isFinnActivated: boolean
  finnAbilityStartTime: number | null
  isWizardAttacking: boolean
  wizardAttackDuration: number
  showAngelaEffect: boolean
  angelaEffectDuration: number
  isInvulnerable: boolean
  invulnerabilityDuration: number
}

interface TrailPoint {
  x: number
  y: number
}

const CHARACTER_STORIES = [
  {
    name: "Skull Warrior",
    story: {
      page1:
        "Once a mighty warrior who ruled the battlefield with honor and courage. But pride became his downfall when he challenged the gods themselves.",
      page2:
        "Now trapped in the eternal flames of hell, he seeks redemption through the ultimate test - mastering the art of the perfect exit from life's trials.",
    },
  },
  {
    name: "Shadow Ninja",
    story: {
      page1:
        "A master assassin who lived in the shadows, taking lives without question or mercy. His blade was swift, his heart was cold.",
      page2:
        "Death found him in his sleep, and now he must learn that true mastery comes not from taking life, but from knowing when to exit gracefully.",
    },
  },
  {
    name: "Ghost Spirit",
    story: {
      page1:
        "A lost soul who couldn't find peace in life, always searching for something more, never satisfied with what he had.",
      page2:
        "In the afterlife, he discovered that happiness was always within reach. Now he teaches others the wisdom of knowing when enough is enough.",
    },
  },
  {
    name: "Naruto",
    story: {
      page1:
        "Naruto Uzumaki was a mischievous and ostracized orphan from Konohagakure. He was feared and scorned by the villagers due to the Nine-Tailed Fox Demon sealed within him.",
      page2:
        "However, Naruto never gave up on his dream of becoming Hokage. With his perseverance, cheerfulness, and unwavering faith in his friends, he became one of the village's greatest heroes, giving hope to everyone.",
    },
  },
  {
    name: "Zoro",
    story: {
      page1:
        "Roronoa Zoro was the swordsman of the Straw Hat Pirates and a bounty hunter living with the dream of becoming the 'World's Greatest Swordsman'. Though known for his tendency to get lost, his dedication to his goal was unwavering.",
      page2:
        "Zoro always seeks out the strongest opponents and improves himself by fighting them. He is known for his loyalty and honor, ready to make any sacrifice to protect his friends. For him, the exit is always the path to the top.",
    },
  },
  {
    name: "LEVI",
    story: {
      page1:
        "Captain LEVI, humanity's strongest soldier, rose from the underground city to become the leader of the Survey Corps' Special Operations Squad. His past was harsh, filled with loss and the constant struggle for survival.",
      page2:
        "Driven by a relentless pursuit of cleanliness and a cold, pragmatic demeanor, LEVI fights tirelessly against the Titans. He embodies the ultimate 'exit' strategy: eliminating threats with brutal efficiency to ensure humanity's survival.",
    },
  },
  {
    name: "Sakura",
    story: {
      page1:
        "Sakura Haruno began as a seemingly ordinary girl with a crush on Sasuke Uchiha. Initially lacking in combat skills, she was often overshadowed by her teammates Naruto and Sasuke in Team 7.",
      page2:
        "Through sheer determination and under the tutelage of Lady Tsunade, she transformed herself into an exceptional medical ninja with monstrous strength. Her journey teaches that true power comes from within, and the perfect exit requires both healing and destruction.",
    },
  },
  {
    name: "SPONGE",
    story: {
      page1:
        "SpongeBob SquarePants is an eternally optimistic sea sponge who lives in a pineapple under the sea in the city of Bikini Bottom. His childlike enthusiasm and good nature often lead him into trouble, but his heart is always in the right place.",
      page2:
        "After a mysterious incident involving a Krabby Patty experiment gone wrong, SpongeBob found himself transported to the afterlife. Now he brings his infectious laughter and unpredictable bouncy movements to the eternal race, proving that even in hell, optimism finds a way.",
    },
  },
  {
    name: "Ichigo",
    story: {
      page1:
        "Ichigo Kurosaki was an ordinary high school student until he obtained the powers of a Soul Reaper. With his oversized Zanpakuto sword and fierce determination, he fought to protect both the living and the dead.",
      page2:
        "After countless battles against Hollows, Arrancars, and even gods, Ichigo's soul found its way to this realm. His experience with death and the afterlife gives him unique insight into the nature of existence, making him exceptionally skilled at finding the perfect exit.",
    },
  },
  {
    name: "Finn",
    story: {
      page1:
        "Finn the Human, a brave hero from the Land of Ooo, always sought adventure and justice. With his trusty sword and loyal dog Jake, he faced countless monsters and magical threats.",
      page2:
        "After a particularly epic quest, Finn found himself in a strange new realm, where the only adventure left is mastering the art of the perfect exit. He's ready to face any challenge, even if it means sliding down a fiery mountain!",
    },
  },
  {
    name: "RAMYO",
    story: {
      page1:
        "RAMYO, a mysterious figure from the frozen tundras, carries the weight of ancient secrets. His stoic demeanor hides a fiery spirit, always ready to face the unknown.",
      page2:
        "Banished for wielding forbidden knowledge, he now seeks an exit from this infernal realm, not through brute force, but by mastering the subtle art of evasion and strategic retreat.",
    },
  },
  {
    name: "HUNTER",
    story: {
      page1:
        "HUNTER, a seasoned tracker from the wildlands, was known for his unparalleled ability to pursue any prey. His life was a relentless chase, always on the edge of danger.",
      page2:
        "After a final, fateful hunt, he found himself in this desolate landscape. Now, he applies his tracking skills to find the ultimate exit, navigating treacherous paths and outsmarting unseen forces.",
    },
  },
]

const SnowBored = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number | null>(null)
  const currentAudioRef = useRef<HTMLAudioElement | null>(null)
  const backgroundMusicRef = useRef<HTMLAudioElement | null>(currentAudioRef.current)
  const finnAbilityAudioRef = useRef<HTMLAudioElement | null>(null)
  const ramyoAbilityAudioRef = useRef<HTMLAudioElement | null>(null)
  const hunterAbilityAudioRef = useRef<HTMLAudioElement | null>(null)

  const [score, setScore] = useState(0)
  const [gameTime, setGameTime] = useState(0)
  const [gameEndReason, setGameEndReason] = useState<string | null>(null)
  const [showCharacterSelect, setShowCharacterSelect] = useState(true)
  const [selectedCharacter, setSelectedCharacter] = useState(0)
  const [showAbout, setShowAbout] = useState(false)
  const [showStory, setShowStory] = useState(false)
  const [selectedStoryCharacter, setSelectedStoryCharacter] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [showSaveScoreModal, setShowSaveScoreModal] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(0)
  const [transitionOpacity, setTransitionOpacity] = useState(0)
  const [isRageModeActive, setIsRageModeActive] = useState(false)

  const [showHappyTwitter, setShowHappyTwitter] = useState(false)

  const [wizardAbilityUses, setWizardAbilityUses] = useState(5)
  const [wizardAbilityCooldown, setWizardAbilityCooldown] = useState(0)
  const [wizardRecharging, setWizardRecharging] = useState(false)

  const [treasureCount, setTreasureCount] = useState(0)
  const [totalOKBEarned, setTotalOKBEarned] = useState(0)
  const [showRewardNotification, setShowRewardNotification] = useState(false)
  const [rewardMessage, setRewardMessage] = useState("")

  const obstacleSpritesRef = useRef<{
    treeSprites: HTMLImageElement[]
    snowmanSprites: HTMLImageElement[]
    ramenPowerUp: HTMLImageElement
  } | null>(null)

  const gameStateRef = useRef({
    player: {
      x: 120,
      y: GAME_CONSTANTS.CANVAS_HEIGHT / 2,
      velocityY: 0,
      isMovingUp: false,
      sprite: null,
      specialAbilityActive: false,
      specialAbilityCooldown: 0,
      specialAbilityDuration: 0,
      characterIndex: 0,
      displayWidth: GAME_CONSTANTS.PLAYER_WIDTH,
      displayHeight: GAME_CONSTANTS.PLAYER_HEIGHT,
      isFinnActivated: false,
      finnAbilityStartTime: null,
      isWizardAttacking: false,
      wizardAttackDuration: 0,
      showAngelaEffect: false,
      angelaEffectDuration: 0,
      isInvulnerable: false,
      invulnerabilityDuration: 0,
    } as Player,
    obstacles: [] as Obstacle[],
    trailPoints: [],
    frameCount: 0,
    startTime: Date.now(),
    gameSpeedMultiplier: 1,
    obstacleGenerationInterval: GAME_CONSTANTS.TREE_GENERATION_INTERVAL,
    score: 0,
    isGameOver: false,
    isRunning: false,
    cameraX: 0,
    currentLevel: 1,
  })

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(
        window.innerWidth <= 768 ||
          /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
      )
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {}, [])

  useEffect(() => {
    const enableAudio = () => {
      document.removeEventListener("click", enableAudio)
      document.removeEventListener("touchstart", enableAudio)
      document.removeEventListener("keydown", enableAudio)
    }

    document.addEventListener("click", enableAudio, { once: true })
    document.addEventListener("touchstart", enableAudio, { once: true })
    document.addEventListener("keydown", enableAudio, { once: true })

    return () => {
      document.removeEventListener("click", enableAudio)
      document.removeEventListener("touchstart", enableAudio)
      document.removeEventListener("keydown", enableAudio)
    }
  }, [])

  const stopGame = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
    gameStateRef.current.isRunning = false
  }

  const resetGameState = () => {
    gameStateRef.current = {
      player: {
        x: 120,
        y: GAME_CONSTANTS.CANVAS_HEIGHT / 2,
        velocityY: 0,
        isMovingUp: false,
        sprite: null,
        specialAbilityActive: false,
        specialAbilityCooldown: 0,
        specialAbilityDuration: 0,
        characterIndex: selectedCharacter,
        displayWidth: GAME_CONSTANTS.PLAYER_WIDTH * (IMAGES.CHARACTERS[selectedCharacter]?.sizeMultiplier || 1),
        displayHeight: GAME_CONSTANTS.PLAYER_HEIGHT * (IMAGES.CHARACTERS[selectedCharacter]?.sizeMultiplier || 1),
        isFinnActivated: false,
        finnAbilityStartTime: null,
        isWizardAttacking: false,
        wizardAttackDuration: 0,
        showAngelaEffect: false,
        angelaEffectDuration: 0,
        isInvulnerable: false,
        invulnerabilityDuration: 0,
      },
      obstacles: [],
      trailPoints: [],
      frameCount: 0,
      startTime: Date.now(),
      gameSpeedMultiplier: 1,
      obstacleGenerationInterval: GAME_CONSTANTS.TREE_GENERATION_INTERVAL,
      score: 0,
      isGameOver: false,
      isRunning: false,
      cameraX: 0,
      currentLevel: 1,
    }
    setGameEndReason(null)
    setIsRageModeActive(false)
    setWizardAbilityUses(5)
    setWizardAbilityCooldown(0)
    setWizardRecharging(false)
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.code === "Space" && !gameStateRef.current.isGameOver && !showCharacterSelect) {
      e.preventDefault()
      gameStateRef.current.player.isMovingUp = true
    }

    if (e.code === "KeyE" && !gameStateRef.current.isGameOver && !showCharacterSelect) {
      e.preventDefault()
      const player = gameStateRef.current.player
      const characterIndex = player.characterIndex

      if (e.key === "e" || e.key === "E") {
        if (player.characterIndex === 1) {
          if (wizardAbilityUses > 0 && !wizardRecharging && !player.isWizardAttacking) {
            player.isWizardAttacking = true
            player.wizardAttackDuration = 20
            setWizardAbilityUses((prev) => {
              const newUses = prev - 1
              if (newUses === 0) {
                setWizardRecharging(true)
                setWizardAbilityCooldown(1200) // 20 seconds to recharge all 5 uses
              }
              return newUses
            })

            const { obstacles } = gameStateRef.current
            for (let i = obstacles.length - 1; i >= 0; i--) {
              const obstacle = obstacles[i]
              if (obstacle.x > player.x && obstacle.x < player.x + 150) {
                obstacles.splice(i, 1)
              }
            }

            try {
              const audio = new Audio("/wizard-attack-sound.mp3")
              audio.volume = 0.4
              audio.play().catch(console.error)
            } catch (error) {
              console.error("Failed to play wizard attack sound:", error)
            }
          }
        }
      }
    }
  }

  const handleKeyUp = (e: KeyboardEvent) => {
    if (e.code === "Space" && !gameStateRef.current.isGameOver && !showCharacterSelect) {
      e.preventDefault()
      gameStateRef.current.player.isMovingUp = false
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault()
    if (!gameStateRef.current.isGameOver && !showCharacterSelect) {
      gameStateRef.current.player.isMovingUp = true

      if (e.touches.length >= 2) {
        const player = gameStateRef.current.player
        const characterIndex = player.characterIndex

        if (characterIndex === 1) {
          if (wizardAbilityUses > 0 && !wizardRecharging && !player.isWizardAttacking) {
            player.isWizardAttacking = true
            player.wizardAttackDuration = 20
            setWizardAbilityUses((prev) => {
              const newUses = prev - 1
              if (newUses === 0) {
                setWizardRecharging(true)
                setWizardAbilityCooldown(1200) // 20 seconds to recharge all 5 uses
              }
              return newUses
            })

            const { obstacles } = gameStateRef.current
            for (let i = obstacles.length - 1; i >= 0; i--) {
              const obstacle = obstacles[i]
              if (obstacle.x > player.x && obstacle.x < player.x + 150) {
                obstacles.splice(i, 1)
              }
            }

            try {
              const audio = new Audio("/wizard-attack-sound.mp3")
              audio.volume = 0.4
              audio.play().catch(console.error)
            } catch (error) {
              console.error("Failed to play wizard attack sound:", error)
            }
          }
        } else if (characterIndex === 8) {
          if (player.specialAbilityCooldown === 0 && !player.specialAbilityActive) {
            player.specialAbilityActive = true
            player.specialAbilityDuration = 30
            player.specialAbilityCooldown = 180
            try {
              const audio = new Audio(
                "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dash%20sound-ERoGURikEuU6HQN15NbhY8st1VVxMO372X.mp3",
              )
              audio.volume = 0.3
              audio.play().catch(console.error)
            } catch (error) {
              console.error("Failed to play dash sound:", error)
            }
          }
        }
      }
    }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault()
    if (!gameStateRef.current.isGameOver && !showCharacterSelect) {
      gameStateRef.current.player.isMovingUp = false
    }
  }

  const stopAllAudio = useCallback(() => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause()
      currentAudioRef.current.currentTime = 0
      currentAudioRef.current = null
    }
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.pause()
      backgroundMusicRef.current.currentTime = 0
      backgroundMusicRef.current = null
    }
    if (finnAbilityAudioRef.current) {
      finnAbilityAudioRef.current.pause()
      finnAbilityAudioRef.current.currentTime = 0
      finnAbilityAudioRef.current = null
    }
    if (ramyoAbilityAudioRef.current) {
      ramyoAbilityAudioRef.current.pause()
      ramyoAbilityAudioRef.current.currentTime = 0
      ramyoAbilityAudioRef.current = null
    }
    if (hunterAbilityAudioRef.current) {
      hunterAbilityAudioRef.current.pause()
      hunterAbilityAudioRef.current.currentTime = 0
      hunterAbilityAudioRef.current = null
    }
  }, [])

  const playBackgroundMusic = useCallback(() => {
    stopAllAudio()

    try {
      const audio = new Audio(
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/sound-T2FiQX0Elv3tRcZKcRUpDpeJvYEorK.mp3",
      )
      audio.volume = 0.3
      audio.loop = true
      audio.preload = "auto"
      backgroundMusicRef.current = audio

      const playAudio = () => {
        audio.play().catch((err) => {
          console.warn("Background music autoplay blocked:", err)
          const playOnInteraction = () => {
            audio.play().catch(console.error)
            document.removeEventListener("click", playOnInteraction)
            document.removeEventListener("touchstart", playOnInteraction)
          }
          document.addEventListener("click", playOnInteraction, { once: true })
          document.addEventListener("touchstart", playOnInteraction, { once: true })
        })
      }

      if (audio.readyState >= 2) {
        playAudio()
      } else {
        audio.addEventListener("canplay", playAudio, { once: true })
        audio.addEventListener("loadeddata", playAudio, { once: true })
      }

      audio.load()
    } catch (error) {
      console.error("Failed to create background audio:", error)
    }
  }, [stopAllAudio])

  const playFinnAbilitySound = useCallback(() => {
    const player = gameStateRef.current.player
    const characterIndex = player.characterIndex

    stopAllAudio()

    try {
      let audioSrc = ""
      if (characterIndex === 9) {
        audioSrc =
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Comethazine%20-%20Bands%20%28Directed%20by%20Cole%20Bennett%29%20%28mp3cut.net%29-ik9YSRCS5MOBldlSh8st1VVxMO372X.mp3"
      } else if (characterIndex === 10) {
        audioSrc = "/ramyo-ability-sound.mp3"
      } else if (characterIndex === 11) {
        audioSrc = "/hunter-ability-sound.mp3"
      }

      if (audioSrc) {
        const audio = new Audio(audioSrc)
        audio.volume = 0.5
        audio.loop = true
        audio.preload = "auto"

        if (characterIndex === 9) {
          finnAbilityAudioRef.current = audio
        } else if (characterIndex === 10) {
          ramyoAbilityAudioRef.current = audio
        } else if (characterIndex === 11) {
          hunterAbilityAudioRef.current = audio
        }

        const playAudio = () => {
          audio.play().catch((err) => {
            console.warn("Ability sound autoplay blocked:", err)
            const playOnInteraction = () => {
              audio.play().catch(console.error)
              document.removeEventListener("click", playOnInteraction)
              document.removeEventListener("touchstart", playOnInteraction)
            }
            document.addEventListener("click", playOnInteraction, { once: true })
            document.addEventListener("touchstart", playOnInteraction, { once: true })
          })
        }

        if (audio.readyState >= 2) {
          playAudio()
        } else {
          audio.addEventListener("canplay", playAudio, { once: true })
          audio.addEventListener("loadeddata", playAudio, { once: true })
        }
        audio.load()
      }
    } catch (error) {
      console.error("Failed to create ability audio:", error)
    }
  }, [stopAllAudio])

  const playClickSound = useCallback(() => {
    try {
      const audio = new Audio(
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/click-sound-Yld8MeNGnVGuRXX4U62Rh9DS821nUm.mp3",
      )
      audio.volume = 0.4
      audio.preload = "auto"

      const playAudio = () => {
        audio.play().catch((err) => {
          console.warn("Click sound failed:", err)
        })
      }

      if (audio.readyState >= 2) {
        playAudio()
      } else {
        audio.addEventListener("canplay", playAudio, { once: true })
        audio.addEventListener("loadeddata", playAudio, { once: true })
      }

      audio.load()
    } catch (error) {
      console.error("Failed to create click audio:", error)
    }
  }, [])

  const playCharacterSound = useCallback((characterIndex: number) => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause()
      currentAudioRef.current.currentTime = 0
      currentAudioRef.current = null
    }

    let audioSrc = ""
    switch (characterIndex) {
      case 0:
        audioSrc = "/angela-sound.mp3"
        break
      case 1:
        audioSrc = "/melissa-sound.mp3"
        break
      case 2:
        audioSrc = "/peace-sound.mp3"
        break
      case 3:
        audioSrc = "/tear-sound.mp3"
        break
      default:
        return
    }

    try {
      const audio = new Audio(audioSrc)
      audio.volume = 0.5
      audio.preload = "auto"
      currentAudioRef.current = audio

      const playAudio = () => {
        audio.play().catch((err) => {
          console.warn(`Character sound ${characterIndex} failed:`, err)
        })
      }

      if (audio.readyState >= 2) {
        playAudio()
      } else {
        audio.addEventListener("canplay", playAudio, { once: true })
        audio.addEventListener("loadeddata", playAudio, { once: true })
      }

      audio.load()
    } catch (error) {
      console.error("Failed to create character audio:", error)
    }
  }, [])

  const playGameOverSound = useCallback(() => {
    stopAllAudio()
    try {
      const audio = new Audio(
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/game-over-sound-F1aM1v62BmmgUnbv9xN6CoxN2xjMJb.mp3",
      )
      audio.volume = 0.6
      audio.preload = "auto"

      const playAudio = () => {
        audio.play().catch((err) => {
          console.warn("Game over sound failed:", err)
        })
      }

      if (audio.readyState >= 2) {
        playAudio()
      } else {
        audio.addEventListener("canplay", playAudio, { once: true })
        audio.addEventListener("loadeddata", playAudio, { once: true })
      }

      audio.load()
    } catch (error) {
      console.error("Failed to create game over audio:", error)
    }
  }, [stopAllAudio])

  const openAbout = () => {
    playClickSound()
    setShowAbout(true)
    setShowLeaderboard(false)
    setShowSaveScoreModal(false)
  }

  const closeAbout = () => {
    playClickSound()
    setShowAbout(false)
    setShowStory(false)
  }

  const openStory = (index: number) => {
    setSelectedStoryCharacter(index)
    setShowStory(true)
  }

  const closeStory = () => {
    setShowStory(false)
  }

  const openLeaderboard = () => {
    playClickSound()
    setShowLeaderboard(true)
    setShowAbout(false)
    setShowSaveScoreModal(false)
  }

  const closeLeaderboard = () => {
    playClickSound()
    setShowLeaderboard(false)
  }

  const connectWallet = async () => {
    if (isConnecting) return

    try {
      setIsConnecting(true)
      playClickSound()

      // Check if Phantom wallet is available
      if (typeof window !== "undefined" && window.solana && window.solana.isPhantom) {
        try {
          const response = await window.solana.connect()
          setWalletAddress(response.publicKey.toString())
          console.log("Wallet connected:", response.publicKey.toString())
        } catch (error) {
          console.error("User rejected the request or error occurred:", error)
        }
      } else {
        // Phantom not installed, redirect to download
        alert("Phantom wallet not found. Redirecting to download page.")
        window.open("https://phantom.app/", "_blank")
      }
    } catch (error) {
      console.error("Error connecting to Phantom wallet:", error)
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectWallet = () => {
    playClickSound()
    setWalletAddress(null)
    if (typeof window !== "undefined" && window.solana) {
      window.solana.disconnect()
    }
  }

  const openSaveScoreModal = () => {
    playClickSound()
    setShowSaveScoreModal(true)
    setShowAbout(false)
    setShowLeaderboard(false)
  }

  const closeSaveScoreModal = () => {
    playClickSound()
    setShowSaveScoreModal(false)
  }

  const startGame = () => {
    resetGameState()
    setGameEndReason(null)
    setShowCharacterSelect(false)
    playBackgroundMusic()
  }

  const backToCharacterSelect = () => {
    stopGame()
    stopAllAudio()
    setShowCharacterSelect(true)
    resetGameState()
  }

  const handleSaveScoreSuccess = () => {
    closeSaveScoreModal()
    openLeaderboard()
  }

  const handleScoreSave = (playerName: string, walletAddress?: string) => {
    console.log("Score saved:", { playerName, walletAddress, score })
    handleSaveScoreSuccess()
  }

  const startLevelTransition = useCallback(
    (activateRage: boolean) => {
      if (isTransitioning) return

      setIsTransitioning(1)
      setTransitionOpacity(0)

      const fadeInInterval = setInterval(() => {
        setTransitionOpacity((prev) => {
          const newOpacity = Math.min(prev + 0.05, 1)
          if (newOpacity >= 1) {
            clearInterval(fadeInInterval)

            if (activateRage) {
              gameStateRef.current.gameSpeedMultiplier = 1.1
            } else {
              gameStateRef.current.gameSpeedMultiplier = 1
            }

            const fadeOutInterval = setInterval(() => {
              setTransitionOpacity((prev) => {
                const newOpacity = Math.max(prev - 0.05, 0)
                if (newOpacity <= 0) {
                  clearInterval(fadeOutInterval)
                  setIsTransitioning(0)
                }
                return newOpacity
              })
            }, 30)
          }
          return newOpacity
        })
      }, 30)
    },
    [isTransitioning],
  )

  const selectCharacter = (index: number) => {
    setSelectedCharacter(index)
    playCharacterSound(index)

    if (index === 2) {
      setShowHappyTwitter(true)
    } else {
      setShowHappyTwitter(false)
    }
  }

  // Main game effect
  useEffect(() => {
    if (showCharacterSelect) {
      stopGame()
      return
    }

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const loadImage = (src: string): Promise<HTMLImageElement> => {
      return new Promise((resolve) => {
        const img = new Image()
        if (/^https?:\/\//.test(src)) {
          img.crossOrigin = "anonymous"
        }
        img.src = src
        img.onload = () => resolve(img)
        img.onerror = (error) => {
          console.warn(`Failed to load image: ${src}. Using fallback.`, error)
          const canvas = document.createElement("canvas")
          canvas.width = 56
          canvas.height = 56
          const ctx = canvas.getContext("2d")
          if (ctx) {
            ctx.fillStyle = "#ff0000"
            ctx.fillRect(0, 0, 56, 56)
          }
          const fallbackImg = new Image()
          fallbackImg.src = canvas.toDataURL()
          fallbackImg.onload = () => resolve(fallbackImg)
          fallbackImg.onerror = (e) => {
            console.error("Failed to load fallback image, resolving with empty image:", e)
            resolve(new Image())
          }
        }
      })
    }

    const loadObstacleSprites = async () => {
      const treeSprites = await Promise.all(IMAGES.TREES.map(loadImage))
      const snowmanSprites = await Promise.all(IMAGES.SNOWMEN.map(loadImage))
      const ramenPowerUp = await loadImage("/ramen-bowl-obstacle.png")

      return { treeSprites, snowmanSprites, ramenPowerUp }
    }

    const initGame = async () => {
      const selectedCharData = IMAGES.CHARACTERS[selectedCharacter]
      const playerSprite = await loadImage(selectedCharData.sprite)
      const { treeSprites, snowmanSprites, ramenPowerUp } = await loadObstacleSprites()
      obstacleSpritesRef.current = { treeSprites, snowmanSprites, ramenPowerUp }

      gameStateRef.current.player.sprite = playerSprite
      gameStateRef.current.player.characterIndex = selectedCharacter
      gameStateRef.current.player.displayWidth = GAME_CONSTANTS.PLAYER_WIDTH * selectedCharData.sizeMultiplier
      gameStateRef.current.player.displayHeight = GAME_CONSTANTS.PLAYER_HEIGHT * selectedCharData.sizeMultiplier
      gameStateRef.current.isRunning = true

      const getRandomObstacleData = () => {
        const isTreasureChance = Math.random() < 0.15 // 15% chance for treasure
        if (isTreasureChance) {
          return {
            sprite: ramenPowerUp,
            isFinnObstacleFlag: false,
            isTreasure: true,
          }
        }

        const useTree = Math.random() > 0.2
        const obstacleSet = useTree ? treeSprites : snowmanSprites
        const sprite = obstacleSet[Math.floor(Math.random() * obstacleSet.length)]
        return { sprite, isFinnObstacleFlag: false, isTreasure: false }
      }

      for (let i = 0; i < 6; i++) {
        const {
          sprite: newObstacleSprite,
          isFinnObstacleFlag: newIsFinnObstacleFlag,
          isTreasure,
        } = getRandomObstacleData()
        gameStateRef.current.obstacles.push({
          x: Math.random() * (GAME_CONSTANTS.CANVAS_WIDTH - 100) + GAME_CONSTANTS.CANVAS_WIDTH,
          y: Math.random() * (GAME_CONSTANTS.CANVAS_HEIGHT - 100) + 50,
          sprite: newObstacleSprite,
          isFinnObstacle: newIsFinnObstacleFlag,
          isTreasure,
        })
      }

      const drawTransitionOverlay = () => {
        if (isTransitioning) {
          ctx.fillStyle = `rgba(0, 0, 0, ${transitionOpacity})`
          ctx.fillRect(0, 0, GAME_CONSTANTS.CANVAS_WIDTH, GAME_CONSTANTS.CANVAS_HEIGHT)
        }
      }

      const drawPlayer = () => {
        const { player } = gameStateRef.current
        if (player.sprite) {
          ctx.save()
          ctx.translate(player.x - gameStateRef.current.cameraX, player.y)

          if (gameStateRef.current.isGameOver) {
            ctx.rotate(-Math.PI / 2)
          }

          let currentSprite = player.sprite
          const characterData = IMAGES.CHARACTERS[player.characterIndex]

          if (player.characterIndex === 1 && player.isWizardAttacking && characterData.attackSprite) {
            const attackSprite = new Image()
            attackSprite.src = characterData.attackSprite
            currentSprite = attackSprite
          } else if (player.characterIndex === 0 && characterData.walkingSprite) {
            const walkingSprite = new Image()
            walkingSprite.src = characterData.walkingSprite
            currentSprite = walkingSprite
          }

          ctx.drawImage(
            currentSprite,
            -player.displayWidth / 2,
            -player.displayHeight / 2,
            player.displayWidth,
            player.displayHeight,
          )
          ctx.restore()
        }
      }

      const drawObstacles = () => {
        gameStateRef.current.obstacles.forEach((obstacle) => {
          if (obstacle.sprite && obstacle.sprite.complete) {
            let obstacleDrawWidth = GAME_CONSTANTS.OBSTACLE_WIDTH
            let obstacleDrawHeight = GAME_CONSTANTS.OBSTACLE_HEIGHT

            if (obstacle.isFinnObstacle) {
              obstacleDrawWidth = GAME_CONSTANTS.FINN_OBSTACLE_WIDTH
              obstacleDrawHeight = GAME_CONSTANTS.FINN_OBSTACLE_HEIGHT
            }

            ctx.drawImage(
              obstacle.sprite,
              obstacle.x - gameStateRef.current.cameraX - obstacleDrawWidth / 2,
              obstacle.y - obstacleDrawHeight,
              obstacleDrawWidth,
              obstacleDrawHeight,
            )
          } else {
            console.warn("Obstacle sprite not loaded or invalid, skipping draw:", obstacle.sprite)
          }
        })
      }

      const drawSkiTrail = () => {
        ctx.strokeStyle = COLORS.skiTrail
        ctx.lineWidth = 3
        ctx.beginPath()
        gameStateRef.current.trailPoints.forEach((point, index) => {
          const x = point.x - gameStateRef.current.cameraX
          if (index === 0) {
            ctx.moveTo(x, point.y)
          } else {
            ctx.lineTo(x, point.y)
          }
        })
        ctx.stroke()
      }

      const drawUI = () => {
        ctx.fillStyle = "#FFFFFF"
        ctx.strokeStyle = "#000000"
        ctx.lineWidth = 3
        ctx.font = `${isMobile ? "14px" : "18px"} 'JetBrains Mono', monospace`

        const scoreText = `分数: ${Math.floor(gameStateRef.current.score)}`
        const scoreWidth = ctx.measureText(scoreText).width
        ctx.strokeText(scoreText, GAME_CONSTANTS.CANVAS_WIDTH - scoreWidth - 20, 35)
        ctx.fillText(scoreText, GAME_CONSTANTS.CANVAS_WIDTH - scoreWidth - 20, 35)

        const currentTime = gameStateRef.current.isGameOver
          ? gameTime
          : Math.floor((Date.now() - gameStateRef.current.startTime) / 1000)
        const timeString = new Date(currentTime * 1000).toISOString().substr(14, 5)
        ctx.strokeText(timeString, 20, 35)
        ctx.fillText(timeString, 20, 35)

        const player = gameStateRef.current.player
        if (player.characterIndex === 1) {
          let abilityText = ""
          if (wizardRecharging) {
            abilityText = `E技能: 充能中 ${Math.ceil(wizardAbilityCooldown / 60)}秒`
          } else {
            abilityText = `E技能: 准备就绪 (${wizardAbilityUses}/5)`
          }

          ctx.fillStyle = "#FFFFFF"
          ctx.strokeStyle = "#000000"
          ctx.lineWidth = 2
          ctx.strokeText(abilityText, 20, 70)
          ctx.fillText(abilityText, 20, 70)
        } else if (player.characterIndex === 8) {
          const cooldownText =
            player.specialAbilityCooldown > 0
              ? `冲刺: ${Math.ceil(player.specialAbilityCooldown / 60)}秒`
              : "冲刺: 准备就绪"

          ctx.fillStyle = "#FFFFFF"
          ctx.strokeStyle = "#000000"
          ctx.strokeText(cooldownText, 20, 70)
          ctx.fillText(cooldownText, 20, 70)
        } else if ([9, 10, 11].includes(player.characterIndex)) {
          const abilityStatusText = player.isFinnActivated ? "技能: 激活中" : "技能: 准备就绪"

          ctx.fillStyle = "#FFFFFF"
          ctx.strokeStyle = "#000000"
          ctx.strokeText(abilityStatusText, 20, 70)
          ctx.fillText(abilityStatusText, 20, 70)

          if (player.isFinnActivated) {
            ctx.font = `${isMobile ? "20px" : "30px"} 'JetBrains Mono', monospace`
            ctx.fillStyle = "#FFFFFF"
            ctx.strokeStyle = "#000000"
            ctx.lineWidth = 4
            const activatedText = `${IMAGES.CHARACTERS[player.characterIndex].name.toLowerCase()} 已激活！`
            const textWidth = ctx.measureText(activatedText).width
            ctx.strokeText(
              activatedText,
              (GAME_CONSTANTS.CANVAS_WIDTH - textWidth) / 2,
              GAME_CONSTANTS.CANVAS_HEIGHT / 2 - 50,
            )
            ctx.fillText(
              activatedText,
              (GAME_CONSTANTS.CANVAS_WIDTH - textWidth) / 2,
              GAME_CONSTANTS.CANVAS_HEIGHT / 2 - 50,
            )
          }
        }

        ctx.fillStyle = "white"
        ctx.font = "bold 16px JetBrains Mono"
        ctx.strokeStyle = "black"
        ctx.lineWidth = 2

        // Treasure count
        const treasureText = `宝物: ${treasureCount}`
        ctx.strokeText(treasureText, 20, 120)
        ctx.fillText(treasureText, 20, 120)

        // OKB earnings
        const okbText = `OKB: ${totalOKBEarned.toFixed(3)}`
        ctx.strokeText(okbText, 20, 145)
        ctx.fillText(okbText, 20, 145)

        // Next reward milestone
        const nextMilestone = Math.ceil(treasureCount / 25) * 25
        const remaining = nextMilestone - treasureCount
        const milestoneText = `下一个奖励: ${remaining} 宝物`
        ctx.font = "12px JetBrains Mono"
        ctx.strokeText(milestoneText, 20, 165)
        ctx.fillText(milestoneText, 20, 165)

        if (showRewardNotification) {
          ctx.fillStyle = "rgba(255, 215, 0, 0.9)"
          ctx.fillRect(GAME_CONSTANTS.CANVAS_WIDTH / 2 - 150, 100, 300, 60)
          ctx.strokeStyle = "black"
          ctx.lineWidth = 2
          ctx.strokeRect(GAME_CONSTANTS.CANVAS_WIDTH / 2 - 150, 100, 300, 60)

          ctx.fillStyle = "black"
          ctx.font = "bold 14px JetBrains Mono"
          ctx.textAlign = "center"
          ctx.fillText(rewardMessage, GAME_CONSTANTS.CANVAS_WIDTH / 2, 135)
          ctx.textAlign = "left"
        }
      }

      const checkCollisions = () => {
        const player = gameStateRef.current.player
        const obstacles = gameStateRef.current.obstacles

        for (let i = obstacles.length - 1; i >= 0; i--) {
          const obstacle = obstacles[i]

          const pLeft = player.x - player.displayWidth / 2
          const pRight = player.x + player.displayWidth / 2
          const pTop = player.y - player.displayHeight / 2
          const pBottom = player.y + player.displayHeight / 2

          const obstacleCollisionWidth = 40
          const obstacleCollisionHeight = 40
          const oLeft = obstacle.x - obstacleCollisionWidth / 2
          const oRight = obstacle.x + obstacleCollisionWidth / 2
          const oTop = obstacle.y - obstacleCollisionHeight
          const oBottom = obstacle.y

          if (pLeft < oRight && pRight > oLeft && pTop < oBottom && pBottom > oTop) {
            if (obstacle.isTreasure) {
              // Simple treasure collection - just give 0.00001 OKB per ramen
              setTreasureCount((prev) => prev + 1)
              setTotalOKBEarned((prev) => prev + 0.00001)

              // Remove the treasure
              gameStateRef.current.obstacles.splice(i, 1)

              try {
                const audio = new Audio("/wizard-attack-sound.mp3")
                audio.volume = 0.3
                audio.play().catch(console.error)
              } catch (error) {
                console.error("Failed to play collection sound:", error)
              }

              continue
            }
            // Regular obstacle collision - end game
            return true
          }
        }
        return false
      }

      const updateGame = () => {
        if (gameStateRef.current.isGameOver || !gameStateRef.current.isRunning) return

        const { player, obstacles, trailPoints } = gameStateRef.current
        const currentTime = Date.now()

        if (player.invulnerabilityDuration > 0) {
          player.invulnerabilityDuration--
          if (player.invulnerabilityDuration <= 0) {
            player.isInvulnerable = false
          }
        }

        if (player.isWizardAttacking) {
          player.wizardAttackDuration--
          if (player.wizardAttackDuration <= 0) {
            player.isWizardAttacking = false
          }
        }

        const gameElapsedTime = currentTime - gameStateRef.current.startTime
        const canSpawnObstacles = gameElapsedTime > 3000

        const targetCameraX = player.x - GAME_CONSTANTS.CANVAS_WIDTH * 0.3
        gameStateRef.current.cameraX += (targetCameraX - gameStateRef.current.cameraX) * 0.1

        if (player.specialAbilityCooldown > 0) {
          player.specialAbilityCooldown--
        }
        if (player.specialAbilityDuration > 0) {
          player.specialAbilityDuration--
          if (player.specialAbilityDuration === 0) {
            player.specialAbilityActive = false
          }
        }

        if (wizardAbilityCooldown > 0) {
          setWizardAbilityCooldown((prev) => {
            const newCooldown = prev - 1
            if (newCooldown === 0 && wizardRecharging) {
              setWizardRecharging(false)
              setWizardAbilityUses(5) // Restore all 5 uses
            }
            return newCooldown
          })
        }

        const characterIndex = gameStateRef.current.player.characterIndex
        const currentSpeedMultiplier = gameStateRef.current.gameSpeedMultiplier

        if (characterIndex === 8 && player.specialAbilityActive) {
          player.x += GAME_CONSTANTS.MOVEMENT_SPEED * 3
        }

        if (player.isMovingUp) {
          player.velocityY = Math.max(player.velocityY - 0.5, -GAME_CONSTANTS.MOVEMENT_SPEED * 1.2)
        } else {
          player.velocityY = Math.min(player.velocityY + GAME_CONSTANTS.GRAVITY, GAME_CONSTANTS.MOVEMENT_SPEED * 1.2)
        }

        player.y += player.velocityY
        player.x += GAME_CONSTANTS.MOVEMENT_SPEED * currentSpeedMultiplier * 0.5

        if (player.y < 50) player.y = 50
        if (player.y > GAME_CONSTANTS.CANVAS_HEIGHT - 70) player.y = GAME_CONSTANTS.CANVAS_HEIGHT - 70

        trailPoints.unshift({ x: player.x, y: player.y + 10 })
        if (trailPoints.length > 50) {
          trailPoints.pop()
        }

        gameStateRef.current.obstacles = obstacles
          .map((obstacle) => ({
            ...obstacle,
            x: obstacle.x - GAME_CONSTANTS.MOVEMENT_SPEED * currentSpeedMultiplier * 0.5,
          }))
          .filter((obstacle) => obstacle.x > gameStateRef.current.cameraX - 3000)

        if (canSpawnObstacles && gameStateRef.current.frameCount % GAME_CONSTANTS.TREE_GENERATION_INTERVAL === 0) {
          const sprites = obstacleSpritesRef.current
          if (sprites) {
            const getRandomObstacleData = () => {
              const isTreasureChance = Math.random() < 0.12 // 12% chance for treasure during gameplay
              if (isTreasureChance) {
                return {
                  sprite: sprites.ramenPowerUp,
                  isFinnObstacleFlag: false,
                  isTreasure: true,
                }
              }

              let sprite: HTMLImageElement
              const isFinnObstacleFlag = false
              const useTree = Math.random() > 0.2
              const obstacleSet = useTree ? sprites.treeSprites : sprites.snowmanSprites
              sprite = obstacleSet[Math.floor(Math.random() * obstacleSet.length)]
              return { sprite, isFinnObstacleFlag, isTreasure: false }
            }
            const {
              sprite: newObstacleSprite,
              isFinnObstacleFlag: newIsFinnObstacleFlag,
              isTreasure,
            } = getRandomObstacleData()
            gameStateRef.current.obstacles.push({
              x: gameStateRef.current.cameraX + GAME_CONSTANTS.CANVAS_WIDTH + 50,
              y: Math.random() * (GAME_CONSTANTS.CANVAS_HEIGHT - 100) + 50,
              sprite: newObstacleSprite,
              isFinnObstacle: newIsFinnObstacleFlag,
              isTreasure,
            })
          }
        }

        if (gameStateRef.current.frameCount % 60 === 0) {
          gameStateRef.current.score += 10
        }

        const hasCollision = checkCollisions()
        if (hasCollision && !player.isInvulnerable) {
          console.log("[v0] Collision detected - ending game")
          gameStateRef.current.isGameOver = true
          gameStateRef.current.isRunning = false
          setTimeout(() => {
            playGameOverSound()
            setGameEndReason("collision")
          }, 50)
          return // Exit immediately to prevent further updates
        }

        gameStateRef.current.frameCount++
      }

      const gameLoop = () => {
        if (!gameStateRef.current.isRunning) return

        ctx.clearRect(0, 0, GAME_CONSTANTS.CANVAS_WIDTH, GAME_CONSTANTS.CANVAS_HEIGHT)

        drawSkiTrail()
        drawObstacles()
        drawPlayer()
        drawUI()
        drawTransitionOverlay()

        if (!gameStateRef.current.isGameOver) {
          updateGame()
          setScore(gameStateRef.current.score)
        }

        if (gameStateRef.current.isRunning) {
          animationFrameRef.current = requestAnimationFrame(gameLoop)
        }
      }

      window.addEventListener("keydown", handleKeyDown)
      window.addEventListener("keyup", handleKeyUp)

      canvas.addEventListener("touchstart", handleTouchStart, { passive: false })
      canvas.addEventListener("touchend", handleTouchEnd, { passive: false })

      gameLoop()

      return () => {
        stopGame()
        window.removeEventListener("keydown", handleKeyDown)
        window.removeEventListener("keyup", handleKeyUp)
        canvas.removeEventListener("touchstart", handleTouchStart)
        canvas.removeEventListener("touchend", handleTouchEnd)
      }
    }

    initGame()
  }, [
    gameEndReason,
    gameTime,
    showCharacterSelect,
    selectedCharacter,
    isMobile,
    isTransitioning,
    startLevelTransition,
    playFinnAbilitySound,
    stopAllAudio,
    transitionOpacity,
    wizardAbilityCooldown,
  ])

  const resetGame = () => {
    setScore(0)
    setTreasureCount(0)
    setTotalOKBEarned(0)
    setShowRewardNotification(false)
    setGameEndReason(null)
    setShowCharacterSelect(true)
  }

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen ${isMobile ? "p-2" : "p-4"} relative`}
      style={{
        backgroundImage: `url("/asian-dragon-background.jpg")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Top Navigation - removed connect wallet button */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex space-x-6">
          {/* Use openLeaderboard function instead of inline onClick */}
          <button
            className="text-white hover:text-gray-300 transition-colors"
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: isMobile ? "12px" : "14px",
              textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
            }}
            onClick={openLeaderboard}
          >
            排行榜
          </button>
          <button
            className="text-white hover:text-gray-300 transition-colors"
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: isMobile ? "12px" : "14px",
              textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
            }}
            onClick={() => {
              playClickSound()
              window.open("https://x.com/playokpo", "_blank")
            }}
          >
            twitter
          </button>
          <button
            className="text-white hover:text-gray-300 transition-colors"
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: isMobile ? "12px" : "14px",
              textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
            }}
            onClick={() => {
              playClickSound()
              window.open("https://okay.fun/", "_blank")
            }}
          >
            okay.fun
          </button>
        </div>
      </div>

      {showCharacterSelect ? (
        <>
          <h1
            className={`${isMobile ? "text-2xl" : "text-4xl"} font-bold mb-8 text-white`}
            style={{
              fontFamily: "JetBrains Mono, monospace",
              textShadow: "4px 4px 8px rgba(0,0,0,0.8), 2px 2px 4px rgba(0,0,0,0.6)",
            }}
          >
            OKPO
          </h1>

          <div
            className={`bg-black/20 backdrop-blur-sm ${isMobile ? "p-4" : "p-8"} rounded-lg border-2 border-white shadow-2xl ${isMobile ? "w-full max-w-sm" : "max-w-md"}`}
          >
            <h2
              className={`${isMobile ? "text-lg" : "text-2xl"} font-bold mb-6 text-white text-center`}
              style={{
                fontFamily: "JetBrains Mono, monospace",
                textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
              }}
            >
              选择角色
            </h2>

            {/* Added Twitter buttons for Peace and Tear characters in character selection */}
            <div className={`grid ${isMobile ? "grid-cols-2 gap-3" : "grid-cols-2 gap-4"} mb-6`}>
              {IMAGES.CHARACTERS.map((character, index) => (
                <div key={index} className="relative">
                  <button
                    onClick={() => selectCharacter(index)}
                    className={`relative ${isMobile ? "p-2" : "p-3"} rounded-lg border-2 transition-all duration-200 w-full ${
                      selectedCharacter === index
                        ? "border-white bg-white/20 shadow-lg transform scale-105"
                        : "border-gray-300 bg-cream-50/80 hover:border-white/60 hover:bg-white/10"
                    }`}
                  >
                    <div
                      className={`${isMobile ? "w-12 h-12" : "w-16 h-16"} mx-auto mb-2 flex items-center justify-center`}
                    >
                      <img
                        src={character.sprite || "/placeholder.svg"}
                        alt={character.name}
                        style={{
                          imageRendering: "pixelated",
                          width: isMobile
                            ? "48px"
                            : `${GAME_CONSTANTS.PLAYER_WIDTH * (character.sizeMultiplier || 1)}px`,
                          height: isMobile
                            ? "48px"
                            : `${GAME_CONSTANTS.PLAYER_HEIGHT * (character.sizeMultiplier || 1)}px`,
                          objectFit: "contain",
                        }}
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg?height=56&width=56&text=" + character.name
                        }}
                      />
                    </div>
                    <p
                      className={`text-white text-center ${isMobile ? "text-xs" : "text-sm"} font-bold leading-tight`}
                      style={{
                        fontFamily: '"JetBrains Mono", monospace',
                        textShadow:
                          "1px 1px 0px #000000, -1px -1px 0px #000000, 1px -1px 0px #000000, -1px 1px 0px #000000",
                        letterSpacing: "0.5px",
                        wordBreak: "break-word",
                        hyphens: "auto",
                      }}
                    >
                      {character.name}
                    </p>
                  </button>

                  {index === 2 && selectedCharacter === 2 && (
                    <div className="absolute top-full mt-3 left-1/2 transform -translate-x-1/2 z-30">
                      <button
                        onClick={() => window.open("https://x.com/bazingahappy", "_blank")}
                        className="px-3 py-2 text-sm bg-gray-900/95 border-2 border-white/70 text-white rounded-md hover:bg-gray-800/95 hover:border-white transition-all duration-200 shadow-xl backdrop-blur-sm"
                        style={{
                          fontFamily: "JetBrains Mono, monospace",
                          fontWeight: "500",
                          letterSpacing: "0.5px",
                        }}
                      >
                        twitter
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex flex-col items-center space-y-4 mt-8">
              <Button
                onClick={startGame}
                disabled={selectedCharacter === null}
                className={`${isMobile ? "px-8 py-4 text-lg" : "px-12 py-6 text-xl"} bg-white text-black hover:bg-gray-100 font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed w-full max-w-sm`}
                style={{
                  fontFamily: "JetBrains Mono, monospace",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
                }}
              >
                开始游戏
              </Button>

              <Button
                onClick={() => setShowSaveScoreModal(true)}
                className={`${isMobile ? "px-8 py-4 text-lg" : "px-12 py-6 text-xl"} bg-white text-black hover:bg-gray-100 font-bold shadow-lg w-full max-w-sm`}
                style={{
                  fontFamily: "JetBrains Mono, monospace",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
                }}
              >
                保存分数
              </Button>
            </div>
          </div>
        </>
      ) : (
        <>
          <h1
            className={`${isMobile ? "text-2xl" : "text-4xl"} font-bold mb-2 text-white`}
            style={{
              fontFamily: '"8-BIT WONDER", monospace',
              textShadow:
                "2px 2px 4px rgba(0,0,0,0.8), -2px -2px 4px rgba(0,0,0,0.8), 2px -2px 4px rgba(0,0,0,0.8), -2px 2px 4px rgba(0,0,0,0.8)",
            }}
          >
            OKPO
          </h1>
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={
                isMobile ? Math.min(GAME_CONSTANTS.CANVAS_WIDTH, window.innerWidth - 20) : GAME_CONSTANTS.CANVAS_WIDTH
              }
              height={isMobile ? Math.min(GAME_CONSTANTS.CANVAS_HEIGHT, 300) : GAME_CONSTANTS.CANVAS_HEIGHT}
              className={`border-4 border-white rounded-lg ${isMobile ? "w-full" : ""}`}
              style={{
                touchAction: "none",
                maxWidth: isMobile ? "100%" : "none",
                height: isMobile ? "auto" : "auto",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                boxShadow: "0 0 20px rgba(255, 255, 255, 0.3)",
              }}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            />
            {gameEndReason !== null && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <div className="text-white text-center space-y-4">
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={backToCharacterSelect}
                      className={`${isMobile ? "px-3 py-2 text-sm" : "px-4 py-2"} bg-white text-black rounded hover:bg-gray-100 shadow-lg`}
                      style={{
                        fontFamily: "JetBrains Mono, monospace",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
                      }}
                    >
                      选择角色
                    </button>
                    <button
                      onClick={startGame}
                      className={`${isMobile ? "px-3 py-2 text-sm" : "px-4 py-2"} bg-white text-black rounded hover:bg-gray-100 shadow-lg`}
                      style={{
                        fontFamily: "JetBrains Mono, monospace",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
                      }}
                    >
                      再次游戏
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <p
            className={`${isMobile ? "text-xs" : "text-sm"} text-white/60 text-center mt-4`}
            style={{
              fontFamily: "JetBrains Mono, monospace",
              textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
            }}
          >
            按住空格键向上移动
          </p>
        </>
      )}

      {/* Leaderboard Modal */}
      {showLeaderboard && <LeaderboardModal onClose={closeLeaderboard} isMobile={isMobile} />}

      {/* Updated save score functionality to properly handle score saving */}
      {showSaveScoreModal && (
        <SaveScoreFormModal
          onClose={closeSaveScoreModal}
          isMobile={isMobile}
          currentScore={score}
          onSave={handleScoreSave}
        />
      )}

      {treasureCount > 0 && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-white text-sm font-bold">
          宝物: {treasureCount}
        </div>
      )}
    </div>
  )
}

export default SnowBored

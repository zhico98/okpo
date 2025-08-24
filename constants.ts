export const GAME_CONSTANTS = {
  CANVAS_WIDTH: 900,
  CANVAS_HEIGHT: 500,
  PLAYER_WIDTH: 56,
  PLAYER_HEIGHT: 56,
  GRAVITY: 0.2,
  MOVEMENT_SPEED: 3, // Reduced from 5 to 3 to slow down overall game speed
  JUMP_STRENGTH: -7,
  TREE_GENERATION_INTERVAL: 90, // Her 90 frame'de bir ağaç
  OBSTACLE_WIDTH: 25, // Reduced from 35 to 25 for normal characters
  OBSTACLE_HEIGHT: 50, // Reduced from 70 to 50 for normal characters
  FINN_OBSTACLE_WIDTH: 30, // Reduced from 40
  FINN_OBSTACLE_HEIGHT: 30, // Reduced from 40
}

export const COLORS = {
  sky: "#E6F3FF", // Soft heavenly blue
  ground: "#F5F0E8", // Warm cream/beige
  snow: "#FFFFFF", // Pure white
  skiTrail: "#D4D4AA", // Soft golden trail
}

export const IMAGES = {
  BACKGROUND: "/heaven-background.png",
  CHARACTERS: [
    {
      name: "小美",
      sprite: "/xiaomei.png",
      sizeMultiplier: 1.2,
    },
    {
      name: "李小龍",
      sprite: "/bruce-lee.png",
      sizeMultiplier: 1.3,
    },
    {
      name: "Happy",
      sprite: "/happy.png",
      sizeMultiplier: 1.0,
    },
    {
      name: "热的",
      sprite: "/hot-character.png",
      sizeMultiplier: 1.0,
    },
  ],
  TREES: ["/golden-sun-obstacle.png"],
  SNOWMEN: ["/golden-sun-obstacle.png"],
}

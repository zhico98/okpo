-- Create leaderboard table for storing game scores
CREATE TABLE IF NOT EXISTS leaderboard (
  id SERIAL PRIMARY KEY,
  player_name VARCHAR(255) NOT NULL,
  score INTEGER NOT NULL,
  wallet_address VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert some sample data
INSERT INTO leaderboard (player_name, score, wallet_address) VALUES
('Royce', 8500, NULL),
('FINN', 4000, NULL),
('RAMYO', 4000, NULL),
('WETTO', 3200, NULL)
ON CONFLICT DO NOTHING;

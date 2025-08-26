-- Create leaderboard table for storing game scores
CREATE TABLE IF NOT EXISTS leaderboard (
  id SERIAL PRIMARY KEY,
  player_name VARCHAR(255) NOT NULL,
  score INTEGER NOT NULL,
  wallet_address VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security for data protection
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read leaderboard scores (public leaderboard)
CREATE POLICY "Allow public read access to leaderboard" ON leaderboard FOR SELECT USING (true);

-- Create policy to allow anyone to insert new scores
CREATE POLICY "Allow public insert to leaderboard" ON leaderboard FOR INSERT WITH CHECK (true);

-- Insert some sample data
INSERT INTO leaderboard (player_name, score, wallet_address) VALUES
('Royce', 8500, NULL),
('FINN', 4000, NULL),
('RAMYO', 4000, NULL),
('WETTO', 3200, NULL)
ON CONFLICT DO NOTHING;

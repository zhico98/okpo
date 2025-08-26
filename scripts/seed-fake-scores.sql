-- Insert fake high scores for initial leaderboard population
INSERT INTO leaderboard (player_name, score, wallet_address) VALUES
('子阳', 2050, NULL),
('浩然', 1890, NULL),
('君尧', 1750, NULL),
('死的', 1620, NULL),
('明泽', 1480, NULL),
('梅扎尔', 1350, NULL)
ON CONFLICT DO NOTHING;

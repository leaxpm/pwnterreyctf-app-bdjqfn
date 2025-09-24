
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create events table
CREATE TABLE IF NOT EXISTS events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    organizer VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('CTF', 'Taller', 'Charla')),
    start_time VARCHAR(10) NOT NULL,
    end_time VARCHAR(10) NOT NULL,
    location VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    date VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create badges table
CREATE TABLE IF NOT EXISTS badges (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(100) NOT NULL,
    color VARCHAR(7) NOT NULL,
    requirements JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    avatar VARCHAR(500),
    stats JSONB DEFAULT '{"eventsAttended": 0, "ctfsCompleted": 0, "workshopsTaken": 0, "pointsEarned": 0, "profileComplete": false}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_favorites table
CREATE TABLE IF NOT EXISTS user_favorites (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    event_id UUID REFERENCES events(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, event_id)
);

-- Create user_badges table
CREATE TABLE IF NOT EXISTS user_badges (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    badge_id UUID REFERENCES badges(id) ON DELETE CASCADE NOT NULL,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, badge_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_events_type ON events(type);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_favorites_event_id ON user_favorites(event_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_badge_id ON user_badges(badge_id);

-- Enable Row Level Security (RLS)
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

-- Create policies for events (public read, authenticated write)
CREATE POLICY "Events are viewable by everyone" ON events
    FOR SELECT USING (true);

CREATE POLICY "Events can be created by authenticated users" ON events
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Events can be updated by authenticated users" ON events
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Create policies for badges (public read, authenticated write)
CREATE POLICY "Badges are viewable by everyone" ON badges
    FOR SELECT USING (true);

CREATE POLICY "Badges can be created by authenticated users" ON badges
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create policies for users (users can only see and modify their own data)
CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON users
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Create policies for user_favorites (users can only see and modify their own favorites)
CREATE POLICY "Users can view their own favorites" ON user_favorites
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites" ON user_favorites
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites" ON user_favorites
    FOR DELETE USING (auth.uid() = user_id);

-- Create policies for user_badges (users can only see their own badges, system can insert)
CREATE POLICY "Users can view their own badges" ON user_badges
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert user badges" ON user_badges
    FOR INSERT WITH CHECK (true);

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO users (id, name, email)
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', 'Usuario'), NEW.email);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Insert sample events
INSERT INTO events (title, organizer, type, start_time, end_time, location, description, date) VALUES
('PwnterreyCTF 2024', 'PwnterreyCTF Team', 'CTF', '09:00', '18:00', 'Centro de Convenciones', 'Competencia de seguridad informática con retos de diferentes categorías', '2024-03-15'),
('Taller de Web Hacking', 'Security Expert', 'Taller', '14:00', '17:00', 'Aula 101', 'Aprende técnicas de hacking web y cómo defenderte', '2024-03-16'),
('Introducción a la Criptografía', 'Dr. Crypto', 'Charla', '10:00', '11:30', 'Auditorio Principal', 'Fundamentos de criptografía moderna y sus aplicaciones', '2024-03-17'),
('Binary Exploitation Workshop', 'Pwn Master', 'Taller', '15:00', '18:00', 'Lab de Computación', 'Técnicas avanzadas de explotación de binarios', '2024-03-18'),
('OSINT para Principiantes', 'Intel Analyst', 'Charla', '11:00', '12:00', 'Sala de Conferencias', 'Técnicas de inteligencia de fuentes abiertas', '2024-03-19');

-- Insert sample badges
INSERT INTO badges (name, description, icon, color, requirements) VALUES
('Primer Paso', 'Completa tu perfil', 'user-check', '#4CAF50', '[{"type": "profile_complete", "value": 1, "description": "Completa tu perfil con nombre y email"}]'),
('Participante', 'Asiste a tu primer evento', 'calendar-check', '#2196F3', '[{"type": "events_attended", "value": 1, "description": "Asiste a 1 evento"}]'),
('CTF Novato', 'Completa tu primer CTF', 'flag', '#FF9800', '[{"type": "ctfs_completed", "value": 1, "description": "Completa 1 CTF"}]'),
('Estudiante', 'Toma tu primer taller', 'book-open', '#9C27B0', '[{"type": "workshops_taken", "value": 1, "description": "Toma 1 taller"}]'),
('Activo', 'Asiste a 5 eventos', 'activity', '#F44336', '[{"type": "events_attended", "value": 5, "description": "Asiste a 5 eventos"}]'),
('CTF Experto', 'Completa 3 CTFs', 'award', '#FF5722', '[{"type": "ctfs_completed", "value": 3, "description": "Completa 3 CTFs"}]'),
('Coleccionista de Puntos', 'Gana 100 puntos', 'star', '#FFC107', '[{"type": "points_earned", "value": 100, "description": "Gana 100 puntos"}]'),
('Veterano', 'Asiste a 10 eventos', 'shield', '#607D8B', '[{"type": "events_attended", "value": 10, "description": "Asiste a 10 eventos"}]');

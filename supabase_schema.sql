-- Create personal_notes table
CREATE TABLE personal_notes (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security
ALTER TABLE personal_notes ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to manage only their own notes
CREATE POLICY "Users can manage their own notes" 
ON personal_notes FOR ALL 
USING (auth.uid() = user_id);

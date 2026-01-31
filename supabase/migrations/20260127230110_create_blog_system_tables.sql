/*
  # Create Blog System Tables

  1. New Tables
    - `blog_categories`
      - `id` (uuid, primary key)
      - `name` (text, unique category name)
      - `slug` (text, unique URL-friendly slug)
      - `description` (text, category description)
      - `color` (text, hex color for UI)
      - `icon` (text, Lucide icon name)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `blog_articles`
      - `id` (uuid, primary key)
      - `title` (text, article title)
      - `slug` (text, unique URL-friendly slug)
      - `excerpt` (text, short summary)
      - `content` (text, full HTML content)
      - `category_id` (uuid, foreign key to blog_categories)
      - `image_url` (text, URL of article image)
      - `author` (text, author name)
      - `read_time` (integer, estimated minutes to read)
      - `seo_title` (text, SEO optimized title)
      - `seo_description` (text, SEO meta description)
      - `seo_keywords` (text, comma-separated keywords)
      - `published` (boolean, publication status)
      - `published_at` (timestamptz, publication date)
      - `created_by` (uuid, admin user ID)
      - `generation_prompt` (text, original prompt used)
      - `ai_model_used` (text, AI model identifier)
      - `views_count` (integer, view counter)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Public can read published articles and categories
    - Only admins can create, update, delete
    
  3. Indexes
    - Index on slug for fast lookup
    - Index on published and published_at for listing
    - Index on category_id for filtering
*/

-- Create blog_categories table
CREATE TABLE IF NOT EXISTS blog_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  color text DEFAULT '#f97316',
  icon text DEFAULT 'BookOpen',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create blog_articles table
CREATE TABLE IF NOT EXISTS blog_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text NOT NULL,
  content text NOT NULL,
  category_id uuid REFERENCES blog_categories(id) ON DELETE SET NULL,
  image_url text,
  author text DEFAULT 'Équipe Aissociate',
  read_time integer DEFAULT 5,
  seo_title text,
  seo_description text,
  seo_keywords text,
  published boolean DEFAULT true,
  published_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  generation_prompt text,
  ai_model_used text DEFAULT 'google/gemini-2.5-flash-image',
  views_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_blog_articles_slug ON blog_articles(slug);
CREATE INDEX IF NOT EXISTS idx_blog_articles_published ON blog_articles(published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_articles_category ON blog_articles(category_id);
CREATE INDEX IF NOT EXISTS idx_blog_categories_slug ON blog_categories(slug);

-- Enable RLS
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_articles ENABLE ROW LEVEL SECURITY;

-- Policies for blog_categories

-- Anyone can read categories
CREATE POLICY "Anyone can read categories"
  ON blog_categories
  FOR SELECT
  USING (true);

-- Only admins can insert categories
CREATE POLICY "Admins can insert categories"
  ON blog_categories
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Only admins can update categories
CREATE POLICY "Admins can update categories"
  ON blog_categories
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Only admins can delete categories
CREATE POLICY "Admins can delete categories"
  ON blog_categories
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Policies for blog_articles

-- Anyone can read published articles
CREATE POLICY "Anyone can read published articles"
  ON blog_articles
  FOR SELECT
  USING (published = true);

-- Admins can read all articles
CREATE POLICY "Admins can read all articles"
  ON blog_articles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Only admins can insert articles
CREATE POLICY "Admins can insert articles"
  ON blog_articles
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Only admins can update articles
CREATE POLICY "Admins can update articles"
  ON blog_articles
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Only admins can delete articles
CREATE POLICY "Admins can delete articles"
  ON blog_articles
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_admin = true
    )
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_blog_categories_updated_at ON blog_categories;
CREATE TRIGGER update_blog_categories_updated_at
  BEFORE UPDATE ON blog_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_blog_articles_updated_at ON blog_articles;
CREATE TRIGGER update_blog_articles_updated_at
  BEFORE UPDATE ON blog_articles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default categories
INSERT INTO blog_categories (name, slug, description, color, icon) VALUES
  ('Formation', 'formation', 'Articles sur la formation professionnelle et l''apprentissage', '#3b82f6', 'GraduationCap'),
  ('Intelligence Artificielle', 'intelligence-artificielle', 'Découvrez comment l''IA transforme le monde professionnel', '#8b5cf6', 'Bot'),
  ('Business', 'business', 'Stratégies et conseils pour développer votre activité', '#10b981', 'TrendingUp'),
  ('Marketing', 'marketing', 'Techniques et outils pour booster votre visibilité', '#f59e0b', 'Megaphone'),
  ('Technologie', 'technologie', 'Les dernières innovations et tendances tech', '#06b6d4', 'Cpu')
ON CONFLICT (slug) DO NOTHING;
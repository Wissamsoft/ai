/*
  # Heart Disease Prediction System Tables

  1. New Tables
    - `heart_disease_data`
      - `id` (uuid, primary key) - Unique identifier
      - `age` (integer) - Patient age in years
      - `sex` (integer) - Sex (1 = male, 0 = female)
      - `cp` (integer) - Chest pain type (0-3)
      - `trestbps` (integer) - Resting blood pressure in mm Hg
      - `chol` (integer) - Serum cholesterol in mg/dl
      - `fbs` (integer) - Fasting blood sugar > 120 mg/dl (1 = true, 0 = false)
      - `restecg` (integer) - Resting ECG results (0-2)
      - `thalach` (integer) - Maximum heart rate achieved
      - `exang` (integer) - Exercise induced angina (1 = yes, 0 = no)
      - `oldpeak` (decimal) - ST depression induced by exercise
      - `slope` (integer) - Slope of peak exercise ST segment (0-2)
      - `ca` (integer) - Number of major vessels colored by fluoroscopy (0-3)
      - `thal` (integer) - Thalassemia (1 = normal, 2 = fixed defect, 3 = reversible defect)
      - `target` (integer) - Diagnosis (1 = heart disease, 0 = no heart disease)
      - `created_at` (timestamptz) - Record creation timestamp

    - `predictions`
      - `id` (uuid, primary key) - Unique identifier
      - `patient_name` (text) - Optional patient name
      - `age` (integer) - Patient age
      - `sex` (integer) - Patient sex
      - `cp` (integer) - Chest pain type
      - `trestbps` (integer) - Resting blood pressure
      - `chol` (integer) - Cholesterol level
      - `fbs` (integer) - Fasting blood sugar
      - `restecg` (integer) - Resting ECG
      - `thalach` (integer) - Max heart rate
      - `exang` (integer) - Exercise angina
      - `oldpeak` (decimal) - ST depression
      - `slope` (integer) - ST slope
      - `ca` (integer) - Major vessels
      - `thal` (integer) - Thalassemia
      - `prediction_result` (integer) - Predicted result (0 or 1)
      - `probability` (decimal) - Prediction probability percentage
      - `created_at` (timestamptz) - Prediction timestamp

  2. Security
    - Enable RLS on both tables
    - Allow public read access to heart_disease_data (reference data)
    - Allow public insert/read on predictions for demo purposes
*/

CREATE TABLE IF NOT EXISTS heart_disease_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  age integer NOT NULL,
  sex integer NOT NULL CHECK (sex IN (0, 1)),
  cp integer NOT NULL CHECK (cp BETWEEN 0 AND 3),
  trestbps integer NOT NULL,
  chol integer NOT NULL,
  fbs integer NOT NULL CHECK (fbs IN (0, 1)),
  restecg integer NOT NULL CHECK (restecg BETWEEN 0 AND 2),
  thalach integer NOT NULL,
  exang integer NOT NULL CHECK (exang IN (0, 1)),
  oldpeak decimal(4,2) NOT NULL,
  slope integer NOT NULL CHECK (slope BETWEEN 0 AND 2),
  ca integer NOT NULL CHECK (ca BETWEEN 0 AND 4),
  thal integer NOT NULL CHECK (thal BETWEEN 0 AND 3),
  target integer NOT NULL CHECK (target IN (0, 1)),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_name text DEFAULT '',
  age integer NOT NULL,
  sex integer NOT NULL CHECK (sex IN (0, 1)),
  cp integer NOT NULL CHECK (cp BETWEEN 0 AND 3),
  trestbps integer NOT NULL,
  chol integer NOT NULL,
  fbs integer NOT NULL CHECK (fbs IN (0, 1)),
  restecg integer NOT NULL CHECK (restecg BETWEEN 0 AND 2),
  thalach integer NOT NULL,
  exang integer NOT NULL CHECK (exang IN (0, 1)),
  oldpeak decimal(4,2) NOT NULL,
  slope integer NOT NULL CHECK (slope BETWEEN 0 AND 2),
  ca integer NOT NULL CHECK (ca BETWEEN 0 AND 4),
  thal integer NOT NULL CHECK (thal BETWEEN 0 AND 3),
  prediction_result integer NOT NULL CHECK (prediction_result IN (0, 1)),
  probability decimal(5,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE heart_disease_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to heart disease data"
  ON heart_disease_data
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow public insert predictions"
  ON predictions
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public read predictions"
  ON predictions
  FOR SELECT
  TO anon
  USING (true);
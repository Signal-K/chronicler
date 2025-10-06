import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export interface Planet {
  id: number;
  name: string;
  type: string;
  radius: number; // Earth radii
  mass: number; // Earth masses
  temperature: number; // Kelvin
  gravity: number; // m/s²
  orbitalPeriod: number; // Earth days
  color: string;
  secondaryColor?: string;
  discovered: boolean;
  hasLife: boolean;
}

export const usePlanets = () => {
  const [planets, setPlanets] = useState<Planet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPlanets();
  }, []);

  const fetchPlanets = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('classifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform classifications data to planet format
      const transformedPlanets: Planet[] = data?.map((classification: any) => ({
        id: classification.id,
        name: classification.planet_name || `Planet ${classification.id}`,
        type: classification.classification || 'Unknown',
        radius: 1.0 + Math.random() * 2, // Mock data for now
        mass: 0.5 + Math.random() * 5,
        temperature: 200 + Math.random() * 200,
        gravity: 8 + Math.random() * 10,
        orbitalPeriod: 50 + Math.random() * 300,
        color: getPlanetColor(classification.classification),
        secondaryColor: getSecondaryColor(classification.classification),
        discovered: true, // All classifications are discovered
        hasLife: classification.classification?.toLowerCase().includes('habitable') || 
                classification.classification?.toLowerCase().includes('earth') ||
                Math.random() > 0.7, // Random chance for life
      })) || [];

      setPlanets(transformedPlanets);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch planets');
      console.error('Error fetching planets:', err);
    } finally {
      setLoading(false);
    }
  };

  return { planets, loading, error, refetch: fetchPlanets };
};

// Helper functions to assign colors based on classification
const getPlanetColor = (classification: string): string => {
  if (!classification) return '#95A5A6';
  
  const type = classification.toLowerCase();
  if (type.includes('earth') || type.includes('habitable')) return '#4A90E2';
  if (type.includes('desert') || type.includes('mars')) return '#E74C3C';
  if (type.includes('forest') || type.includes('vegetation')) return '#27AE60';
  if (type.includes('ice') || type.includes('frozen')) return '#F39C12';
  if (type.includes('gas') || type.includes('jupiter')) return '#9B59B6';
  if (type.includes('volcanic') || type.includes('lava')) return '#E67E22';
  
  return '#95A5A6'; // Default rocky planet
};

const getSecondaryColor = (classification: string): string => {
  if (!classification) return '#BDC3C7';
  
  const type = classification.toLowerCase();
  if (type.includes('earth') || type.includes('habitable')) return '#7CB342';
  if (type.includes('desert') || type.includes('mars')) return '#FF8A65';
  if (type.includes('forest') || type.includes('vegetation')) return '#66BB6A';
  if (type.includes('ice') || type.includes('frozen')) return '#FFB74D';
  if (type.includes('gas') || type.includes('jupiter')) return '#BA68C8';
  if (type.includes('volcanic') || type.includes('lava')) return '#FFAB40';
  
  return '#BDC3C7'; // Default
};
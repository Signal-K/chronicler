import { useState } from 'react';
import { supabase } from '../../lib/supabase';

interface Anomaly {
  id: number;
  content: string | null;
  ticId: string | null;
  anomalytype: string | null;
  avatar_url: string | null;
  configuration: any;
  anomalyConfiguration: any;
}

interface ClassificationData {
  author: string; // user UUID
  anomaly: number; // anomaly ID
  content: string | null;
  media: string; // JSON string of image URL
  classificationtype: string; // "bumble"
  classificationConfiguration: string; // JSON string with plots, timestamp, selected
}

export function useClassification() {
  const [currentAnomaly, setCurrentAnomaly] = useState<Anomaly | null>(null);
  const [anomalyImageUrl, setAnomalyImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch a random bumble anomaly
  const fetchRandomAnomaly = async () => {
    setIsLoading(true);
    setError(null);

    try {
        const { data, error: fetchError } = await supabase
            .from("anomalies")
            .select("*")
            .eq("anomalytype", 'bumble')
            .order('id', { ascending: false })
            .limit(1)
            .single();

        if (fetchError) throw fetchError;

        if (data) {
            setCurrentAnomaly(data);
            await getAnomalyImageUrl(data.id);
        };
    } catch (err: any) {
        console.error("Error fetching anomaly: ", err);
        setError(err instanceof Error ? err.message : "Failed to fetch anomaly");
    } finally {
        setIsLoading(false);
    };
  };

    const getAnomalyImageUrl = async (anomalyId: number) => {
        try {
            const { data } = supabase.storage
                .from('bumble')
                .getPublicUrl(`${anomalyId}.jpeg`);

            setAnomalyImageUrl(data.publicUrl);
        } catch (err) {
            console.error('Error getting image URL:', err);
            setError(err instanceof Error ? err.message : 'Failed to get image URL');
        };
    };

    // Submit a classification
    const submitClassification = async (
        selectedBeeType: string,
        plotIndices: number[],
    ): Promise<boolean> => {
        if (!currentAnomaly) {
            setError("No anomaly selected");
            return false;
        };

        setIsLoading(true);
        setError(null);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                throw new Error("User not authenticated");
            };

            const classificationConfiguration = {
                plots: plotIndices,
                timestamp: Date.now(),
                selected: selectedBeeType,
            };

            const classificationData: ClassificationData = {
                author: user.id,
                anomaly: currentAnomaly.id,
                content: `${selectedBeeType}`,
                media: JSON.stringify({ imageUrl: anomalyImageUrl }),
                classificationtype: 'bumble',
                classificationConfiguration: JSON.stringify(classificationConfiguration),
            };

            const { error: insertError } = await supabase
                .from("classifications")
                .insert(classificationData);

            if (insertError) throw insertError;
            return true;
        } catch (err) {
            console.error("Error submitting classification: ", err);
             setError(err instanceof Error ? err.message : 'Failed to submit classification');
    return false;
  } finally {
    setIsLoading(false);
  }
  };

  return {
    currentAnomaly,
    anomalyImageUrl,
    isLoading,
    error,
    fetchRandomAnomaly,
    submitClassification,
  };
}
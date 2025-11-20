import { useEffect, useState } from 'react';

export interface DayNightState {
  isDaytime: boolean;
  timeOfDay: 'dawn' | 'day' | 'dusk' | 'night';
  hour: number;
}

export function useDayNightCycle(): DayNightState {
    const [dayNightState, setDayNightState] = useState<DayNightState>(() => {
        const hour = new Date().getHours();
        return {
            isDaytime: hour >= 6 && hour < 20,
            timeOfDay: getTimeOfDay(hour),
            hour,
        };
    });

    useEffect(() => {
        const checkTime = () => {
            const now = new Date();
            const hour = now.getHours();
            const isDaytime = hour >= 6 && hour < 20;
            const timeOfDay = getTimeOfDay(hour);

            setDayNightState(prev => {
                if (prev.hour !== hour) {
                    return { isDaytime, timeOfDay, hour };
                };

                return prev;
            });
        };

        const interval = setInterval(checkTime, 60000);
        checkTime();
        return () => clearInterval(interval);
    }, []);

    return dayNightState;
};

function getTimeOfDay(hour: number): 'dawn' | 'day' | 'dusk' | 'night' {
  if (hour >= 5 && hour < 7) return 'dawn';
  if (hour >= 7 && hour < 18) return 'day';
  if (hour >= 18 && hour < 20) return 'dusk';
  return 'night';
}

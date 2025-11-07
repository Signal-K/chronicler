import * as Location from 'expo-location';
import { getCurrentWeather, WeatherData } from './weather';

export interface LocationData {
  latitude: number;
  longitude: number;
  city?: string;
  region?: string;
  country?: string;
}

/**
 * Request location permissions from the user
 */
export async function requestLocationPermissions(): Promise<boolean> {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Error requesting location permissions:', error);
    return false;
  }
}

/**
 * Get the user's current location
 */
export async function getUserLocation(): Promise<LocationData | null> {
    try {
        const hasPermission = await requestLocationPermissions();
        if (!hasPermission) {
            console.log("Location permission not granted");
            return null;
        };

        const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
        });

        const { latitude, longitude } = location.coords;

        try {
            const geocode = await Location.reverseGeocodeAsync({
                latitude,
                longitude,
            });

            if (geocode.length > 0) {
                const place = geocode[0];
                return {
                    latitude,
                    longitude,
                    city: place.city || undefined,
                    region: place.region || undefined,
                    country: place.country || undefined,
                };
            };
        } catch (geocodeError) {
            console.warn("Reverse geocoding failed: ", geocodeError);
        };

        return {
            longitude,
            latitude,
        };
    } catch (error) {
        console.error("Error getting user location: ", error);
        return null;
    };
};

/**
 * Get weather data for the user's current location
 */
export async function getWeatherForCurrentLocation(): Promise<WeatherData | null> {
    try {
        const location = await getUserLocation();
        if (!location) {
            console.log("Could not get user location");
            return null;
        };

        const weather = await getCurrentWeather(location.latitude, location.longitude);
        return weather;
    } catch (error) {
        console.error("Error getting weather, ", error);
        return null;
    };
};

/**
 * Check if it's currently raining at the user's location
 */
export async function isRainingAtUserLocation(): Promise<boolean> {
    try {
        const weather = await getWeatherForCurrentLocation();
        if (!weather) {
            return false;
        };

        return weather.isRaining;
    } catch (error) {
        console.error("Error checking rain status: ", error);
        return false;
    };
};

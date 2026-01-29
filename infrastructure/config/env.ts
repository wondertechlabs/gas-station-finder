export function getGoogleMapsApiKey(): string | null {
  return process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || null;
}

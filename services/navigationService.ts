import * as Linking from 'expo-linking';
import { Alert, Platform } from 'react-native';
import { GasStation } from '@/types/gasStation';

class NavigationServiceClass {
  async navigateToStation(station: GasStation): Promise<void> {
    const { latitude, longitude } = station.coordinates;
    
    try {
      // Try Waze first
      const wazeUrl = `waze://?ll=${latitude},${longitude}&navigate=yes&z=15`;
      const canOpenWaze = await Linking.canOpenURL(wazeUrl);
      
      if (canOpenWaze) {
        await Linking.openURL(wazeUrl);
        return;
      }

      // Fallback to Google Maps
      const googleMapsUrl = Platform.select({
        ios: `maps://?daddr=${latitude},${longitude}`,
        android: `geo:${latitude},${longitude}?q=${latitude},${longitude}(${encodeURIComponent(station.name)})`,
        web: `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`,
      }) || `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

      const canOpenMaps = await Linking.canOpenURL(googleMapsUrl);
      
      if (canOpenMaps) {
        await Linking.openURL(googleMapsUrl);
      } else {
        // Final fallback to web Google Maps
        const webUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
        await Linking.openURL(webUrl);
      }
    } catch (error) {
      console.error('Error opening navigation:', error);
      Alert.alert(
        'Error de Navegación',
        'No se pudo abrir la aplicación de navegación. Intenta instalar Waze o Google Maps.',
        [{ text: 'OK' }]
      );
    }
  }

  async openInWaze(station: GasStation): Promise<boolean> {
    try {
      const { latitude, longitude } = station.coordinates;
      const wazeUrl = `waze://?ll=${latitude},${longitude}&navigate=yes&z=15`;
      
      const canOpen = await Linking.canOpenURL(wazeUrl);
      if (canOpen) {
        await Linking.openURL(wazeUrl);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error opening Waze:', error);
      return false;
    }
  }

  async openInGoogleMaps(station: GasStation): Promise<boolean> {
    try {
      const { latitude, longitude } = station.coordinates;
      const url = Platform.select({
        ios: `maps://?daddr=${latitude},${longitude}`,
        android: `geo:${latitude},${longitude}?q=${latitude},${longitude}(${encodeURIComponent(station.name)})`,
        web: `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`,
      }) || `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error opening Google Maps:', error);
      return false;
    }
  }

  getNavigationOptions(): { name: string; action: (station: GasStation) => Promise<boolean> }[] {
    return [
      {
        name: 'Waze',
        action: this.openInWaze.bind(this),
      },
      {
        name: 'Google Maps',
        action: this.openInGoogleMaps.bind(this),
      },
    ];
  }
}

export const NavigationService = new NavigationServiceClass();
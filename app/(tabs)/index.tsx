import { AppleMaps } from 'expo-maps';

export default function MapTab() {
  return <AppleMaps.View
    style={{ flex: 1 }}
    cameraPosition={{
      coordinates: {
        latitude: 37.8199,
        longitude: -122.4783
      },
      zoom: 12
    }}
  polygons={
    [
      {
        id: '1',
        coordinates: [{ latitude: 37.8199, longitude: -122.4783 }, { latitude: 36.1234, longitude: -121.1234 }, { latitude: 35.1234, longitude: -120.1234 }]
      }
    ]
  }
    markers={
      [
        {
          id: '1',
          coordinates: {
            latitude: 37.8199,
            longitude: -122.4783
          }
        },
        {
          id: '2',
          coordinates: {
            latitude: 36.1234,
            longitude: -121.1234
          }
        },
        {
          id: '3',
          coordinates: {
            latitude: 35.1234,
            longitude: -120.1234
          }
        }
      ]
    }
  />;
}
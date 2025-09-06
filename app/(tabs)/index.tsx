import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '~/constants/colors';


export default function MapTab() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mapPlaceholder}>
        <View style={styles.iconContainer}>
          <Ionicons name="map" size={64} color={Colors.primary} />
        </View>
        <Text style={styles.placeholderTitle}>Mapa Interactivo</Text>
        <Text style={styles.placeholderText}>
          El mapa estará disponible próximamente con todas las estaciones de servicio de Managua
        </Text>
        
        <View style={styles.comingSoonBadge}>
          <Text style={styles.comingSoonText}>Próximamente</Text>
        </View>
      </View>

      <View style={styles.infoCard}>
        <View style={styles.titleContainer}>
          <Text style={styles.infoTitle}>Características del Mapa</Text>
        </View>
        
        <View style={styles.featureList}>
          <View style={styles.featureItem}>
            <View style={[styles.featureDot, { backgroundColor: Colors.success }]} />
            <Text style={styles.feature}>Ubicación en tiempo real</Text>
          </View>
          <View style={styles.featureItem}>
            <View style={[styles.featureDot, { backgroundColor: Colors.secondary }]} />
            <Text style={styles.feature}>Estaciones cercanas</Text>
          </View>
          <View style={styles.featureItem}>
            <View style={[styles.featureDot, { backgroundColor: Colors.warning }]} />
            <Text style={styles.feature}>Precios actualizados</Text>
          </View>
          <View style={styles.featureItem}>
            <View style={[styles.featureDot, { backgroundColor: Colors.accent }]} />
            <Text style={styles.feature}>Navegación directa</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
    paddingTop: 0,
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    margin: 16,
    marginTop: 8,
    borderRadius: 20,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  iconContainer: {
    marginBottom: 24,
    padding: 20,
    backgroundColor: Colors.gray50,
    borderRadius: 24,
  },
  placeholderTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
    maxWidth: 280,
  },
  comingSoonBadge: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  comingSoonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textInverse,
  },
  infoCard: {
    backgroundColor: Colors.background,
    margin: 16,
    marginTop: 0,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  titleContainer: {
    padding: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
  },
  featureList: {
    padding: 24,
    paddingTop: 20,
    gap: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  featureDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  feature: {
    fontSize: 16,
    color: Colors.text,
    lineHeight: 24,
    fontWeight: '500',
  },
});
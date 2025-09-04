import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/colors';

export default function NotFoundScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={styles.content}>
        <Text style={styles.errorCode}>404</Text>
        <Text style={styles.text}>Esta pantalla no existe.</Text>
        <Text style={styles.subtext}>
          La página que buscas no se encuentra disponible
        </Text>
        
        <View style={styles.linkContainer}>
          <Link href="/" style={styles.link}>
            <Text style={styles.linkText}>Ir al inicio</Text>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundSecondary,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  errorCode: {
    fontSize: 72,
    fontWeight: '900',
    color: Colors.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtext: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  linkContainer: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    overflow: 'hidden',
  },
  link: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  linkText: {
    fontSize: 18,
    color: Colors.textInverse,
    fontWeight: '600',
  },
});
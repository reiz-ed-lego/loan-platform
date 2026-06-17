import { LoanApplicationForm } from '@app/ui';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import { BRAND_B_ACCENT, Navbar } from './components/Navbar';

export default function App() {
  return (
    <SafeAreaView style={styles.screen}>
      <Navbar />
      <ScrollView contentContainerStyle={styles.content}>
        <LoanApplicationForm
          accentColor={BRAND_B_ACCENT}
          onSubmit={(application) =>
            console.log('Brand B application', application)
          }
        />
      </ScrollView>
      <StatusBar style="dark" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#ffffff' },
  content: { padding: 24 },
});

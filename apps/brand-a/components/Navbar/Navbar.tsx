import { Text, View } from 'react-native';
import { styles } from './styles';

// Brand A navbar: solid accent bar, left-aligned wordmark with a logo dot.
export const BRAND_A_ACCENT = '#2563eb';

export function Navbar() {
  return (
    <View style={styles.bar}>
      <View style={styles.logoDot} />
      <Text style={styles.title}>QuickLoan</Text>
    </View>
  );
}

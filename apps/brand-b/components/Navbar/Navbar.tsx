import { Text, View } from 'react-native';
import { styles } from './styles';

// Brand B navbar: light bar, centered serif-style wordmark, colored bottom rule.
export const BRAND_B_ACCENT = '#059669';

export function Navbar() {
  return (
    <View style={styles.bar}>
      <Text style={styles.title}>GreenFund</Text>
      <Text style={styles.subtitle}>personal lending</Text>
    </View>
  );
}

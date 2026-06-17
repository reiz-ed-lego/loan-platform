import { Text, View } from 'react-native';
import { styles } from './styles';

// Brand A navbar: solid accent bar, left-aligned wordmark with a logo dot.
export { BRAND_A_ACCENT } from './tokens';

export function Navbar() {
  return (
    <View style={styles.bar}>
      <View style={styles.logoDot} />
      <Text style={styles.title}>QuickLoan</Text>
    </View>
  );
}

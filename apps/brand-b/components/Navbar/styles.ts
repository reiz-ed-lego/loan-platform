import { StyleSheet } from 'react-native';
import { BRAND_B_ACCENT } from './Navbar';

export const styles = StyleSheet.create({
  bar: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 16,
    backgroundColor: '#f8fafc',
    borderBottomWidth: 3,
    borderBottomColor: BRAND_B_ACCENT,
  },
  title: {
    color: '#064e3b',
    fontSize: 22,
    fontWeight: '700',
  },
  subtitle: {
    color: '#059669',
    fontSize: 12,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginTop: 2,
  },
});

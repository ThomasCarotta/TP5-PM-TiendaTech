// styles/global.js
import { StyleSheet } from 'react-native';
import { colors } from './colors';
import { typography } from './typography';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screenContainer: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  title: {
    ...typography.h2,
    color: colors.text,
    marginBottom: 16,
  },
  subtitle: {
    ...typography.h3,
    color: colors.text,
    marginBottom: 12,
  },
  section: {
    marginBottom: 24,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
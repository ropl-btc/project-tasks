import { StyleSheet, Platform } from 'react-native';

export const commonStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    padding: Platform.OS === 'ios' ? 0 : 4,
    minHeight: 48,
  },
  textContainer: {
    flex: 1,
    marginLeft: 8,
    minHeight: 48,
    justifyContent: 'center',
  },
  textWrapper: {
    paddingVertical: 12,
  },
  bottomPillContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
  },
});
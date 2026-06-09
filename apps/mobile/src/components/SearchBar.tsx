import { StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, radius, spacing } from '../theme';

export function SearchBar({
  value,
  onChangeText,
  placeholder = 'Search cameras, tools, tents...',
}: {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.icon}>🔍</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textDim}
      />
      {value.length > 0 && (
        <Text style={styles.clear} onPress={() => onChangeText('')}>✕</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
  },
  icon: { fontSize: 16, marginRight: spacing.sm },
  input: {
    flex: 1,
    color: colors.text,
    paddingVertical: spacing.md,
    fontSize: 15,
  },
  clear: { color: colors.textDim, fontSize: 14, padding: spacing.xs },
});

import { Link, Stack } from 'expo-router';
import { StyleSheet } from 'react-native';

import ThemedText from '@/components/text/ThemedText';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
        <ThemedText type="font_md">This screen does not exist.</ThemedText>
        <Link href="/" style={styles.link}>
          <ThemedText type="font_md">Go to home screen!</ThemedText>
        </Link>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});

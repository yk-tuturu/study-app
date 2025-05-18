import { StyleSheet, Text, type TextProps } from 'react-native';
import colors from '@/constants/Colors';


export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'font_xs' | 'font_sm' | 'font_md' | 'font_lg' | 'font_xl' | "font_xxl" | "subtitle";
};

function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {

  return (
    <Text
      style={[
        type === 'default' ? styles.default : undefined,
        type === 'font_xs' ? styles.font_xs : undefined,
        type === 'font_sm' ? styles.font_sm : undefined,
        type === 'font_md' ? styles.font_md : undefined,
        type === 'font_lg' ? styles.font_lg : undefined,
        type === 'font_xl' ? styles.font_xl : undefined,
        type === 'font_xxl' ? styles.font_xxl : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        style,
        {color: colors.accent}
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24
  },
  font_xs: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "JockeyOne"
  },
  font_sm: {
    fontSize: 24,
    lineHeight: 32,
    fontFamily: "JockeyOne"
  },
  font_md: {
    fontSize: 32,
    lineHeight: 32,
    fontFamily: "JockeyOne"
  },
  font_lg: {
    fontSize: 48,
    lineHeight: 48,
    fontFamily: "JockeyOne"
  },
  font_xl: {
    fontSize: 72,
    lineHeight: 72,
    fontFamily: "JockeyOne"
  },
  font_xxl: {
    fontSize: 120,
    lineHeight: 120,
    fontFamily: "JockeyOne"
  },
  subtitle: {
    fontSize: 16
  }
});

export default ThemedText;

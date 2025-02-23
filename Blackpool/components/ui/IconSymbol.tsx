import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { SymbolWeight } from 'expo-symbols';
import React from 'react';
import { OpaqueColorValue, StyleProp, ViewStyle } from 'react-native';

const MAPPING = {
  // MaterialIcons names mapped to SFSymbols
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'account.circle.fill': 'account-circle',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
  'sun': 'sun',
  'cloud.sun.fill': 'wb-sunny',
  
  // Adding FontAwesome mappings
  'sun': 'sun', // FontAwesome sun icon
} as Partial<
  Record<
    import('expo-symbols').SymbolViewProps['name'],
    React.ComponentProps<typeof MaterialIcons>['name'] | React.ComponentProps<typeof FontAwesome5>['name']
  >
>;

export type IconSymbolName = keyof typeof MAPPING;

/**
 * An icon component that uses native SFSymbols on iOS, and MaterialIcons on Android and web. This ensures a consistent look across platforms, and optimal resource usage.
 *
 * Icon `name`s are based on SFSymbols and require manual mapping to MaterialIcons or FontAwesome.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<ViewStyle>;
  weight?: SymbolWeight;
}) {
  if (MAPPING[name] === 'sun') {
    return <FontAwesome5 name="sun" size={size} color={color} style={style} />;
  }

  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}

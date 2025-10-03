export const sizeMap = {
  sm: 36,
  md: 44,
  lg: 52,
} as const;

export type IconButtonVariant = 'solid' | 'outline';
export type IconButtonSizeKey = keyof typeof sizeMap; // 'sm' | 'md' | 'lg'
export type IconButtonSize = IconButtonSizeKey | number;

export type IconButtonColor =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'error'
  | 'warning'
  | 'info'
  | 'inherit'
  | 'default';

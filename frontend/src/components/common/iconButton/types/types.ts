import type { ButtonHTMLAttributes } from 'react';
import type { IconButtonVariant, IconButtonColor, IconButtonSize } from '../constants';

export interface StyledIconButtonProps {
  $variant: IconButtonVariant;
  $color: IconButtonColor;
  $activeColor?: IconButtonColor;
  $size: IconButtonSize;
  $isActive: boolean;
}

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
  variant?: IconButtonVariant;
  color?: IconButtonColor;
  activeColor?: IconButtonColor;
  size?: IconButtonSize;
  isActive?: boolean;
  loading?: boolean;
}

export type { IconButtonVariant, IconButtonColor, IconButtonSize };

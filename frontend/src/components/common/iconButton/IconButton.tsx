import { forwardRef } from 'react';
import { IconButtonProps } from './types/types';
import { StyledIconButton } from './styled/styled';


export const TodoIconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function TodoIconButton(
  {
    variant = 'outline',
    color = 'default',
    activeColor,
    size = 'md',
    isActive = false,
    loading = false,
    disabled,
    type,
    ...rest
  },
  ref
) {
  const isDisabled = disabled ?? loading;
  return (
    <StyledIconButton
      ref={ref}
      type={type ?? 'button'}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      $variant={variant}
      $color={color}
      $activeColor={activeColor}
      $size={size}
      $isActive={isActive}
      {...rest}
    />
  );
});

export default TodoIconButton;

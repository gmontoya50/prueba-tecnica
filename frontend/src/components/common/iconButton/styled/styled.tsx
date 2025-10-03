import { styled, alpha } from '@mui/material/styles';
import type { Theme } from '@mui/material/styles';
import { sizeMap } from '../constants';
import type { IconButtonColor, StyledIconButtonProps } from '../types/types';

const resolveColor = (theme: Theme, colorKey: IconButtonColor) => {
  if (colorKey === 'inherit') {
    return {
      main: theme.palette.text.primary,
      contrastText: 'inherit',
      dark: theme.palette.text.primary,
      isInherit: true,
    };
  }
  if (colorKey === 'default') {
    return {
      main: theme.palette.text.secondary,
      contrastText: theme.palette.background.paper,
      dark: theme.palette.text.primary,
      isInherit: false,
    };
  }
  const entry = (theme.palette as Record<string, any>)[colorKey];
  if (entry?.main) {
    return {
      main: entry.main,
      contrastText: entry.contrastText ?? theme.palette.getContrastText(entry.main),
      dark: entry.dark ?? entry.main,
      isInherit: false,
    };
  }
  return {
    main: theme.palette.primary.main,
    contrastText: theme.palette.primary.contrastText,
    dark: theme.palette.primary.dark ?? theme.palette.primary.main,
    isInherit: false,
  };
};

export const StyledIconButton = styled('button', {
  shouldForwardProp: (prop: PropertyKey) =>
    !['$variant', '$color', '$activeColor', '$size', '$isActive'].includes(String(prop)),
})<StyledIconButtonProps>(({
  theme,
  disabled,
  $variant,
  $color,
  $activeColor,
  $size,
  $isActive,
}) => {
  const resolvedSize = typeof $size === 'number' ? $size : (sizeMap[$size] ?? sizeMap.md);

  const baseColor = resolveColor(theme, $color);
  const activeColor = resolveColor(theme, $activeColor ?? $color);
  const stateColor = $isActive ? activeColor : baseColor;

  const getContrast = (c: typeof stateColor) => (c.isInherit ? 'inherit' : c.contrastText);

  let backgroundColor = 'transparent';
  let borderColor = 'transparent';
  let colorValue = baseColor.isInherit && !$isActive ? 'inherit' : stateColor.main;
  let hoverBackgroundColor = stateColor.isInherit
    ? theme.palette.action.hover
    : alpha(stateColor.main, 0.12);

  if ($variant === 'solid') {
    backgroundColor = stateColor.isInherit ? theme.palette.action.selected : stateColor.main;
    colorValue = getContrast(stateColor);
    hoverBackgroundColor = stateColor.isInherit
      ? theme.palette.action.hover
      : (stateColor.dark ?? stateColor.main);
  } else {
    borderColor = baseColor.isInherit ? theme.palette.divider : alpha(baseColor.main, 0.6);
    backgroundColor = $isActive
      ? activeColor.isInherit
        ? theme.palette.action.selected
        : activeColor.main
      : 'transparent';
    colorValue = $isActive
      ? getContrast(activeColor)
      : baseColor.isInherit
        ? 'inherit'
        : baseColor.main;
    hoverBackgroundColor = $isActive
      ? activeColor.isInherit
        ? theme.palette.action.hover
        : (activeColor.dark ?? activeColor.main)
      : baseColor.isInherit
        ? theme.palette.action.hover
        : alpha(baseColor.main, 0.08);
  }

  return {
    appearance: 'none',
    border: '1px solid',
    borderColor,
    borderRadius: '50%',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: resolvedSize,
    height: resolvedSize,
    minWidth: resolvedSize,
    minHeight: resolvedSize,
    padding: 0,
    outline: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    userSelect: 'none',
    backgroundColor,
    color: colorValue,
    transition:
      'background-color 120ms ease, color 120ms ease, border-color 120ms ease, transform 90ms ease',
    pointerEvents: disabled ? 'none' : undefined,
    opacity: disabled ? 0.6 : 1,
    '&:hover': { backgroundColor: disabled ? backgroundColor : hoverBackgroundColor },
    '&:not(:disabled):active': { transform: 'scale(0.94)' },
    '&:focus-visible': {
      boxShadow: disabled
        ? 'none'
        : `0 0 0 3px ${alpha(
            ($isActive ? activeColor : baseColor).isInherit
              ? theme.palette.text.primary
              : ($isActive ? activeColor : baseColor).main,
            0.25
          )}`,
    },
    '&:disabled': {
      color: theme.palette.action.disabled,
      backgroundColor: theme.palette.action.disabledBackground,
      borderColor: 'transparent',
    },
  };
});

export type { StyledIconButtonProps as InternalIconButtonStyleProps };

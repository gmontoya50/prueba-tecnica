import { FC } from 'react';
import { Box, Button, CircularProgress, Paper, Stack, Typography } from '@mui/material';

import { FilterValue } from '../../../hooks/useTodos/types/types';
import { ITodoFiltersProps } from './types/types';

const FILTERS: Array<{ label: string; value: FilterValue }> = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Completed', value: 'completed' },
];

const TodoFilters: FC<ITodoFiltersProps> = ({
  activeFilter,
  onFilterChange,
  itemsLeft,
  onClearCompleted,
  clearing,
  disableClear,
}) => {
  return (
    <Paper elevation={6} sx={{ borderRadius: { sm: 2, md: 4 }, px: 3, py: 2 }}>
      <Stack
        direction={{ xs: 'column', sm: 'column', md: 'row' }}
        spacing={2}
        alignItems={{ xs: 'flex-start', md: 'center' }}
        justifyContent="space-between"
      >
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: { xs: 'center', md: 'left' }, width: { xs: '100%', md: 'auto' } }}
        >
          {itemsLeft} {itemsLeft === 1 ? 'item' : 'items'} left
        </Typography>
        <Stack
          direction={{ xs: 'column', sm: 'column', md: 'row' }}
          spacing={1}
          sx={{ width: { xs: '100%', md: 'auto' } }}
        >
          {FILTERS.map(({ label, value }) => (
            <Button
              key={value}
              variant={activeFilter === value ? 'contained' : 'text'}
              color={activeFilter === value ? 'primary' : 'inherit'}
              size="small"
              onClick={() => onFilterChange(value)}
              sx={{
                px: 2.5,
                borderRadius: 999,
                fontWeight: activeFilter === value ? 600 : 500,
                boxShadow:
                  activeFilter === value ? '0 10px 25px -15px rgba(99,102,241,0.7)' : 'none',
                color: activeFilter === value ? undefined : 'text.secondary',
                width: { xs: '100%', md: 'auto' },
              }}
            >
              {label}
            </Button>
          ))}
        </Stack>
        <Box sx={{ alignSelf: { xs: 'stretch', md: 'auto' } }}>
          <Button
            color="inherit"
            size="small"
            onClick={onClearCompleted}
            disabled={clearing || disableClear}
            sx={{ px: 0, minWidth: 0, width: { xs: '100%', md: 'auto' } }}
          >
            {clearing ? <CircularProgress size={18} /> : 'Clear Completed'}
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
};

export default TodoFilters;

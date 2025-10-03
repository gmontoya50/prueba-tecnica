import { FC } from 'react';
import { Box, Container, IconButton, Stack, Typography } from '@mui/material';

import { DataIcon } from '../icons/Icons';
import { ITodoHeaderProps } from './types/types';

const TodoHeader: FC<ITodoHeaderProps> = ({ bgClass, toggleTheme, isDarkMode }) => {
  return (
    <Box
      className={bgClass}
      sx={{
        py: { xs: 8, md: 15 },
      }}
    >
      <Container maxWidth={'md'}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography
            variant="h2"
            sx={{
              letterSpacing: '0.55rem',
              fontWeight: 800,
              color: 'primary.contrastText',
            }}
          >
            TODO
          </Typography>
          <IconButton
            aria-label="toggle theme"
            onClick={toggleTheme}
            sx={{
              width: 48,
              height: 48,
              bgcolor: 'rgba(255,255,255,0.2)',
              color: 'primary.contrastText',
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.35)',
              },
            }}
          >
            {isDarkMode ? <DataIcon name="sun" /> : <DataIcon name="moon" />}
          </IconButton>
        </Stack>
      </Container>
    </Box>
  );
};

export default TodoHeader;

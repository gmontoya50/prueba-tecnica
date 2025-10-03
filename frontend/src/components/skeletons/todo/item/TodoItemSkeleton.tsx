import { FC } from 'react';
import { Box, Skeleton, Stack } from '@mui/material';

const TodoItemSkeleton: FC = () => {
  return (
    <Stack spacing={2} direction="row" alignItems="center" mb={1} mt={1}>
      <Skeleton variant="circular" width={28} height={28} />
      <Box sx={{ flexGrow: 1 }}>
        <Skeleton variant="text" height={28} />
        <Skeleton variant="text" height={24} width="45%" />
      </Box>
    </Stack>
  );
};

export default TodoItemSkeleton;

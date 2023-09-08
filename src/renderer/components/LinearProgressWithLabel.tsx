import React from 'react';
import Box from '@mui/material/Box';
import LinearProgress, {
  LinearProgressProps,
} from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { SxProps } from '@mui/system/styleFunctionSx';

interface LinearProgressWithLabelProps {
  value: number;
  title: string;
  containerProps?: SxProps;
  additionalText?: string;
}

const LinearProgressWithLabel = (
  props: LinearProgressProps & LinearProgressWithLabelProps
) => {
  const { containerProps, additionalText, ...rest } = props;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        ...containerProps,
      }}
    >
      <Box sx={{ width: '100%' }}>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body1" color="text.secondary">
            {props.title}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {`${Math.round(props.value)}%`} {additionalText}
          </Typography>
        </Stack>
        <LinearProgress variant="determinate" {...rest} />
      </Box>
    </Box>
  );
};

export default LinearProgressWithLabel;

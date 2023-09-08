import React from 'react';
import Box from '@mui/material/Box';

interface TabPanelProps {
  children: React.ReactNode;
  index: number;
  value: number;
}

export const CustomTabPanel = (props: TabPanelProps) => {
  const { children, value, index } = props;

  if (value !== index) {
    return null;
  }

  return (
    <div>
      <Box sx={{ pt: 3 }}>{children}</Box>
    </div>
  );
};

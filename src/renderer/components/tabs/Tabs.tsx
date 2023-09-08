import React from 'react';
import { useSearchParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Base from '@mui/material/Tabs';
import { CustomTabPanel } from './CustomTabPanel';

interface TabElement {
  label: string;
  Component: React.FC;
}

interface TabsProps {
  tabs: TabElement[];
}

const Tabs = ({ tabs }: TabsProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const value = searchParams.get('tab') ?? 0;

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setSearchParams({ tab: newValue.toString() });
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', ml: '20px' }}>
        <Base
          sx={{
            '& .MuiTab-root.Mui-selected': {
              color: '#D97D54',
            },
          }}
          TabIndicatorProps={{
            style: {
              backgroundColor: '#D97D54',
            },
          }}
          textColor="secondary"
          value={+value}
          onChange={handleChange}
        >
          {tabs.map(({ label }) => (
            <Tab key={label} label={label} />
          ))}
        </Base>
      </Box>
      {tabs.map(({ label, Component }, index) => (
        <CustomTabPanel key={label} value={+value} index={index}>
          <Component />
        </CustomTabPanel>
      ))}
    </Box>
  );
};

export default Tabs;

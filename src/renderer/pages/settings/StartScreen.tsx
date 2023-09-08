import React, { useState } from 'react';
import { useSnackbar } from 'notistack';
import MenuItem from '@mui/material/MenuItem';
import Container from '@mui/material/Container';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { LOADING_TYPE } from '../../constants';
import { getType, saveType } from '../../helpers/local-storage/loadingType';
import {
  getSymbolCount,
  saveSymbolCount,
} from '../../helpers/local-storage/didYouKnowSymbolCount';
import { useTranslation } from 'react-i18next';

const StartScreen = () => {
  const [type, setType] = useState<LOADING_TYPE>(
    () => (getType() as LOADING_TYPE) ?? LOADING_TYPE.MIXED
  );
  const [symbolsPerSecond, setSymbolsPerSecond] = useState<number>(() => {
    const stored = getSymbolCount();
    return stored ? +stored : 15;
  });

  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();

  const handleChange = (e: SelectChangeEvent) => {
    setType(e.target.value as LOADING_TYPE);
    saveType(e.target.value);
    enqueueSnackbar('Changes have been saved', { variant: 'success' });
  };

  const handleChangeSymbols = (e: SelectChangeEvent) => {
    setSymbolsPerSecond(+e.target.value);
    saveSymbolCount(e.target.value);
    enqueueSnackbar('Changes have been saved', { variant: 'success' });
  };

  return (
    <Container>
      <InputLabel>
        {t('pages.settings.tabs.startScreen.startScreenTitle')}
      </InputLabel>
      <Select value={type} onChange={handleChange}>
        <MenuItem value={LOADING_TYPE.MIXED}>
          {t('pages.settings.tabs.startScreen.mixed')}
        </MenuItem>
        <MenuItem value={LOADING_TYPE.DID_YOU_KNOW}>
          {t('pages.settings.tabs.startScreen.didYouKnow')}
        </MenuItem>
        <MenuItem value={LOADING_TYPE.IRREGULAR_VERBS}>
          {t('pages.settings.tabs.startScreen.irregularVerbs')}
        </MenuItem>
      </Select>
      {(type === LOADING_TYPE.MIXED || type === LOADING_TYPE.DID_YOU_KNOW) && (
        <>
          <InputLabel sx={{ mt: 2 }}>
            {t('pages.settings.tabs.startScreen.symbolsPerSecond')}
          </InputLabel>
          <Select
            value={symbolsPerSecond.toString()}
            onChange={handleChangeSymbols}
          >
            {perSecond.map((value) => (
              <MenuItem key={value} value={value}>
                {value}
              </MenuItem>
            ))}
          </Select>
        </>
      )}
    </Container>
  );
};

const perSecond = [5, 10, 15, 20, 25];

export default StartScreen;

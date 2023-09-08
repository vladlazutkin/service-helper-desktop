import React, { useState } from 'react';
import { useSnackbar } from 'notistack';
import Container from '@mui/material/Container';
import InputLabel from '@mui/material/InputLabel';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';
import { getLang, saveLang } from '../../helpers/local-storage/language';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import {
  getOpenDrawerOnMouse,
  saveOpenDrawerOnMouse,
} from '../../helpers/local-storage/openDrawerOnMouse';
import Stack from '@mui/material/Stack';

const General = () => {
  const [lang, setLang] = useState<string>(() => getLang() ?? 'en');
  const [openDrawerOnMouse, setOpenDrawerOnMouse] = useState<boolean>(
    () => getOpenDrawerOnMouse() ?? true
  );

  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();

  const handleChange = async (e: SelectChangeEvent) => {
    const language = e.target.value;
    setLang(language);
    saveLang(language);
    await i18next.changeLanguage(language);
    enqueueSnackbar(t('notifications.changesSaved'), { variant: 'success' });
  };

  const handleChangeOpenDrawerOnMouse = () => {
    saveOpenDrawerOnMouse(openDrawerOnMouse ? '0' : '1');
    setOpenDrawerOnMouse(!openDrawerOnMouse);
    enqueueSnackbar(t('notifications.changesSaved'), { variant: 'success' });
  };

  return (
    <Container>
      <Stack spacing={2} alignItems="start">
        <InputLabel>
          {t('pages.settings.tabs.general.languageTitle')}
        </InputLabel>
        <Select
          MenuProps={{
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'left',
            },
            transformOrigin: {
              vertical: 'top',
              horizontal: 'left',
            },
          }}
          value={lang}
          onChange={handleChange}
        >
          <MenuItem value="en">English</MenuItem>
          <MenuItem value="ua">Українська</MenuItem>
          <MenuItem value="ru">Русский (осуждаю)</MenuItem>
        </Select>

        <FormControlLabel
          control={
            <Checkbox
              color="error"
              checked={openDrawerOnMouse}
              onChange={handleChangeOpenDrawerOnMouse}
            />
          }
          label={t('pages.settings.tabs.general.openDrawerOnMouseHover')}
        />
      </Stack>
    </Container>
  );
};

export default General;

import React from 'react';
import { MenuItem, TextField } from '@mui/material';
import i18n from '../../i18n/setup';

export const LanguageSwitcher: React.FC = () => {
  const [lang, setLang] = React.useState(
    i18n.language.startsWith('ru') ? 'ru' : i18n.language.startsWith('tk') ? 'tk' : 'en',
  );
  const change = (v: string) => {
    setLang(v);
    i18n.changeLanguage(v);
  };
  return (
    <TextField select size="small" value={lang} onChange={(e) => change(e.target.value)} sx={{ width: 120 }}>
      <MenuItem value="en">English</MenuItem>
      <MenuItem value="ru">Русский</MenuItem>
      <MenuItem value="tk">Türkmençe</MenuItem>
    </TextField>
  );
};

export default LanguageSwitcher;


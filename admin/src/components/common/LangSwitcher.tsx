import React from 'react';
import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { setLocale, Locale } from '@/store/localeSlice';
import i18n from '@/i18n/setup';

export const LangSwitcher: React.FC = () => {
  const dispatch = useDispatch();
  const locale = useSelector((s: RootState) => s.locale.locale);
  const handleChange = (e: SelectChangeEvent) => {
    const next = e.target.value as Locale;
    dispatch(setLocale(next));
    i18n.changeLanguage(next);
  };
  return (
    <Select size="small" value={locale} onChange={handleChange} sx={{ mr: 1, minWidth: 80 }}>
      <MenuItem value="en">EN</MenuItem>
      <MenuItem value="ru">RU</MenuItem>
      <MenuItem value="tk">TK</MenuItem>
    </Select>
  );
};


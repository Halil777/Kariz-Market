import { MenuItem, Select } from '@mui/material'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { setLanguage } from '../../store/uiSlice'
import i18n from '../../i18n'

export default function LangSwitcher() {
  const dispatch = useAppDispatch()
  const lang = useAppSelector((s) => s.ui.language)
  const handleChange = (e: any) => {
    const next = e.target.value as string
    dispatch(setLanguage(next))
    i18n.changeLanguage(next)
  }
  return (
    <Select size="small" value={lang} onChange={handleChange} sx={{ mr: 1, minWidth: 80 }}>
      <MenuItem value="en">EN</MenuItem>
      <MenuItem value="ru">RU</MenuItem>
      <MenuItem value="tk">TM</MenuItem>
    </Select>
  )
}


import { IconButton, Tooltip } from '@mui/material'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import { toggleMode } from '../../store/uiSlice'

export default function ThemeToggle() {
  const dispatch = useAppDispatch()
  const mode = useAppSelector((s) => s.ui.mode)
  return (
    <Tooltip title={mode === 'dark' ? 'Light mode' : 'Dark mode'}>
      <IconButton color="inherit" onClick={() => dispatch(toggleMode())}>
        {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
      </IconButton>
    </Tooltip>
  )
}


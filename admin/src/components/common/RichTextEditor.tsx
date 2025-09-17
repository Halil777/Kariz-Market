import React from 'react';
import { Box, ButtonGroup, IconButton, Paper } from '@mui/material';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';

type Props = {
  value?: string;
  onChange?: (html: string) => void;
  minHeight?: number;
};

export const RichTextEditor: React.FC<Props> = ({ value = '', onChange, minHeight = 120 }) => {
  const ref = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (ref.current && ref.current.innerHTML !== value) {
      ref.current.innerHTML = value || '';
    }
  }, [value]);

  const exec = (cmd: string) => document.execCommand(cmd, false);

  return (
    <Paper variant="outlined" sx={{ p: 1 }}>
      <ButtonGroup size="small" sx={{ mb: 1 }}>
        <IconButton onClick={() => exec('bold')}><FormatBoldIcon fontSize="small" /></IconButton>
        <IconButton onClick={() => exec('italic')}><FormatItalicIcon fontSize="small" /></IconButton>
        <IconButton onClick={() => exec('underline')}><FormatUnderlinedIcon fontSize="small" /></IconButton>
        <IconButton onClick={() => exec('insertUnorderedList')}><FormatListBulletedIcon fontSize="small" /></IconButton>
        <IconButton onClick={() => exec('insertOrderedList')}><FormatListNumberedIcon fontSize="small" /></IconButton>
      </ButtonGroup>
      <Box
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={() => onChange?.(ref.current?.innerHTML || '')}
        sx={{ minHeight, outline: 'none', px: 1, py: 0.5 }}
      />
    </Paper>
  );
};

export default RichTextEditor;


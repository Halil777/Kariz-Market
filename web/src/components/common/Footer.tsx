import React from 'react';
import { Box, Container, Link as MLink, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const Footer: React.FC = () => {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <Box component="footer" sx={{ borderTop: 1, borderColor: 'divider', mt: 2, py: 3 }}>
      <Container sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="body2">{t('footer.copyright', { year })}</Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <MLink component={Link} to="/about">{t('footer.about')}</MLink>
          <MLink component={Link} to="/contact">{t('footer.contact')}</MLink>
          <MLink component={Link} to="/privacy">{t('footer.privacy')}</MLink>
          <MLink component={Link} to="/terms">{t('footer.terms')}</MLink>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;

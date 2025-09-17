import React from 'react';
import { Box, Typography } from '@mui/material';
import { fetchBanners } from '../../api/banners';
import i18n from '../../i18n/setup';
import { API_BASE_URL } from '../../api/client';

type Slide = { id: number; color: string; image?: string };

type Props = {
  intervalMs?: number;
  slides?: Slide[];
  height?: number | string;
};

export const BannerCarousel: React.FC<Props> = ({
  intervalMs = 4000,
  slides = [
    { id: 1, color: '#fde6cf' },
    { id: 2, color: '#e0f0ff' },
    { id: 3, color: '#e9f7ef' },
  ],
  height = 340,
}) => {
  const [index, setIndex] = React.useState(0);
  const [remote, setRemote] = React.useState<any[] | null>(null);
  const count = (remote?.length || slides.length);

  React.useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [count, intervalMs]);

  React.useEffect(() => {
    fetchBanners().then(setRemote).catch(() => setRemote(null));
  }, []);

  const apiOrigin = (() => { try { return new URL(API_BASE_URL).origin; } catch { return ''; } })();
  const currentSlides = remote?.map((b, idx) => ({
    id: idx + 1,
    color: '#f5f5f7',
    image: b.imageUrl?.startsWith('http') ? b.imageUrl : `${apiOrigin}${b.imageUrl}`,
    meta: b,
  })) || slides;

  return (
    <Box sx={{ position: 'relative', borderRadius: 3, overflow: 'hidden', bgcolor: 'grey.100', boxShadow: 1 }}>
      {/* Track */}
      <Box
        sx={{
          display: 'flex',
          width: `${count * 100}%`,
          transform: `translateX(-${(100 / count) * index}%)`,
          transition: 'transform 600ms ease',
          height,
        }}
      >
        {currentSlides.map((s: any) => (
          <Box
            key={s.id}
            sx={{
              flex: '0 0 100%',
              height: '100%',
              bgcolor: s.color,
              backgroundImage: s.image
                ? `url(${s.image})`
                : 'linear-gradient(90deg, rgba(0,0,0,0.02), rgba(0,0,0,0.05))',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'relative',
            }}
          />
        ))}
      </Box>

      {/* Overlay text for current slide if present */}
      {remote && remote.length > 0 && (
        <Box sx={{ position: 'absolute', inset: 0, p: { xs: 2, md: 4 }, display: 'flex', alignItems: 'center' }}>
          {(() => {
            const meta = (remote as any[])[index % remote.length];
            if (!meta) return null;
            const lang = i18n.language.startsWith('ru') ? 'ru' : (i18n.language.startsWith('tk') || i18n.language.startsWith('tm') ? 'tm' : 'ru');
            const title = lang === 'ru' ? meta.titleRu : meta.titleTm;
            const subtitle = lang === 'ru' ? meta.subtitleRu : meta.subtitleTm;
            if (!title && !subtitle) return null;
            return (
              <Box sx={{ maxWidth: { xs: '80%', md: '50%' }, bgcolor: 'rgba(255,255,255,0.85)', p: { xs: 2, md: 3 }, borderRadius: 2 }}>
                {title && <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>{title}</Typography>}
                {subtitle && <Typography variant="body1" sx={{ '& p': { m: 0 } }} dangerouslySetInnerHTML={{ __html: subtitle }} />}
              </Box>
            );
          })()}
        </Box>
      )}

      {/* Dots */}
      <Box sx={{ position: 'absolute', left: 0, right: 0, bottom: 10, display: 'flex', justifyContent: 'center', gap: 1 }}>
        {Array.from({ length: count }).map((_, i) => (
          <Box
            key={i}
            onClick={() => setIndex(i)}
            sx={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              cursor: 'pointer',
              bgcolor: i === index ? 'primary.main' : 'grey.400',
              boxShadow: i === index ? 2 : 0,
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default BannerCarousel;

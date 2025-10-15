import React from 'react';
import { Box, Typography } from '@mui/material';
import Slider from 'react-slick';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useTranslation } from 'react-i18next';
import { fetchBanners, type Banner } from '../../api/banners';
import { API_BASE_URL } from '../../api/client';

type Slide = { id: number; color: string; image?: string; meta?: Banner };

type Props = {
  intervalMs?: number;
  slides?: Slide[];
  height?: number | string;
};

const FALLBACK_SLIDES: Slide[] = [
  { id: 1, color: '#fde6cf' },
  { id: 2, color: '#e0f0ff' },
  { id: 3, color: '#e9f7ef' },
];

export const BannerCarousel: React.FC<Props> = ({ intervalMs = 4000, slides = FALLBACK_SLIDES, height = 340 }) => {
  const sliderRef = React.useRef<Slider | null>(null);
  const [remote, setRemote] = React.useState<Banner[] | null>(null);
  const [index, setIndex] = React.useState(0);
  const { i18n } = useTranslation();

  React.useEffect(() => {
    fetchBanners()
      .then(setRemote)
      .catch(() => setRemote(null));
  }, []);

  const language = React.useMemo<'ru' | 'tk'>(() => (i18n.language?.toLowerCase().startsWith('ru') ? 'ru' : 'tk'), [i18n.language]);

  const apiOrigin = React.useMemo(() => {
    try {
      return new URL(API_BASE_URL).origin;
    } catch {
      return '';
    }
  }, []);

  const remoteSlides = React.useMemo<Slide[]>(() => {
    if (!remote || remote.length === 0) return [];
    return remote
      .filter((banner) => banner.isActive !== false)
      .map((banner, idx) => ({
        id: idx + 1,
        color: '#f5f5f7',
        image: banner.imageUrl?.startsWith('http') ? banner.imageUrl : `${apiOrigin}${banner.imageUrl}`,
        meta: banner,
      }));
  }, [remote, apiOrigin]);

  const currentSlides = remoteSlides.length > 0 ? remoteSlides : slides;
  const count = currentSlides.length;

  const handleBeforeChange = React.useCallback((_: number, next: number) => {
    setIndex(next);
  }, []);

  const slidesToShow = React.useMemo(() => {
    if (count >= 2) return 2;
    return 1;
  }, [count]);

  const sliderSettings = React.useMemo(
    () => ({
      dots: count > 1,
      arrows: false,
      infinite: count > 1,
      autoplay: count > 1,
      autoplaySpeed: intervalMs,
      pauseOnHover: true,
      slidesToShow,
      slidesToScroll: 1,
      speed: 600,
      centerMode: false,
      centerPadding: '0px',
      beforeChange: handleBeforeChange,
      responsive: [
        {
          breakpoint: 900,
          settings: {
            slidesToShow: Math.min(2, Math.max(1, slidesToShow)),
          },
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 1,
            centerMode: false,
          },
        },
      ],
    }),
    [count, intervalMs, handleBeforeChange, slidesToShow],
  );

  React.useEffect(() => {
    if (count === 0) {
      setIndex(0);
      return;
    }
    if (index >= count) {
      setIndex(0);
      sliderRef.current?.slickGoTo(0, true);
    }
  }, [count, index]);

  React.useEffect(() => {
    sliderRef.current?.slickGoTo(0, true);
    setIndex(0);
  }, [remoteSlides.length]);

  const currentMeta = remoteSlides.length > 0 && count > 0 ? remoteSlides[index % remoteSlides.length]?.meta ?? null : null;

  const localized = React.useCallback(
    <T extends Record<string, unknown>>(entity: T | null | undefined, base: string) => {
      if (!entity) return undefined;
      const primaryKey = `${base}${language === 'ru' ? 'Ru' : 'Tm'}` as keyof T;
      const fallbackKey = `${base}${language === 'ru' ? 'Tm' : 'Ru'}` as keyof T;
      return (
        (entity[primaryKey] as string | null | undefined) ??
        (entity[fallbackKey] as string | null | undefined) ??
        (entity[base as keyof T] as string | null | undefined)
      );
    },
    [language],
  );

  return (
    <Box
      sx={{
        position: 'relative',
        borderRadius: 3,
        overflow: 'hidden',
        bgcolor: 'grey.100',
        boxShadow: 1,
        '.slick-slider': { height, overflow: 'visible' },
        '.slick-list': { height: '100%', mx: '-5px', overflow: 'visible' },
        '.slick-slide': {
          px: '5px',
          transition: 'box-shadow 0.4s ease',
        },
        '.slick-slide > div': { height: '100%' },
        '.slick-slide .banner-carousel__slide': {
          height: '100%',
          borderRadius: 24,
          overflow: 'hidden',
          transition: 'box-shadow 0.4s ease',
          boxShadow: 1,
        },
        '.banner-carousel__image': {
          display: 'block',
          width: '100%',
          height: '100%',
        },
        '.slick-slide.slick-active .banner-carousel__slide': {
          boxShadow: 4,
        },
        '.slick-dots': { bottom: 16 },
        '.slick-dots li button:before': {
          fontSize: 10,
          color: 'rgba(255,255,255,0.55)',
          opacity: 1,
        },
        '.slick-dots li.slick-active button:before': { color: '#fff' },
      }}
    >
      <Slider
        ref={(instance) => {
          sliderRef.current = instance;
        }}
        {...sliderSettings}
      >
        {currentSlides.map((slide) => (
          <Box
            key={slide.id}
            className='banner-carousel__slide'
            sx={{
              position: 'relative',
              width: '100%',
              height: '100%',
              bgcolor: slide.color,
            }}
          >
            {slide.image ? (
              <LazyLoadImage
                src={slide.image}
                alt={localized(slide.meta, 'title') || 'banner'}
                effect='blur'
                draggable={false}
                width='100%'
                height='100%'
                style={{ objectFit: 'cover', display: 'block' }}
                wrapperClassName='banner-carousel__image'
              />
            ) : (
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, rgba(0,0,0,0.02), rgba(0,0,0,0.05))',
                }}
              />
            )}
          </Box>
        ))}
      </Slider>

      {currentMeta && (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            p: { xs: 2, md: 4 },
            display: 'flex',
            alignItems: 'center',
            pointerEvents: 'none',
          }}
        >
          {(() => {
            const title = localized(currentMeta, 'title');
            const subtitle = localized(currentMeta, 'subtitle');
            if (!title && !subtitle) return null;
            return (
              <Box
                sx={{
                  maxWidth: { xs: '80%', md: '50%' },
                  bgcolor: 'rgba(255,255,255,0.85)',
                  p: { xs: 2, md: 3 },
                  borderRadius: 2,
                }}
              >
                {title && (
                  <Typography variant='h4' sx={{ fontWeight: 800, mb: 1 }}>
                    {title}
                  </Typography>
                )}
                {subtitle && (
                  <Typography variant='body1' sx={{ '& p': { m: 0 } }} dangerouslySetInnerHTML={{ __html: subtitle }} />
                )}
              </Box>
            );
          })()}
        </Box>
      )}
    </Box>
  );
};

export default BannerCarousel;

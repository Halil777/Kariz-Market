import React from "react";
import { Box, IconButton, Typography } from "@mui/material";
import Slider from "react-slick";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useTranslation } from "react-i18next";
import { ArrowBackIosNew, ArrowForwardIos } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { fetchBanners, type Banner } from "../../api/banners";
import { API_BASE_URL } from "../../api/client";

type SlideLink = { href: string; external: boolean };

type Slide = {
  id: number;
  color: string;
  image?: string;
  meta?: Banner;
  href?: string;
  external?: boolean;
};

type Props = {
  intervalMs?: number;
  slides?: Slide[];
  height?: number | string;
};

const FALLBACK_SLIDES: Slide[] = [
  { id: 1, color: "#fde6cf" },
  { id: 2, color: "#e0f0ff" },
  { id: 3, color: "#e9f7ef" },
];

export const BannerCarousel: React.FC<Props> = ({
  intervalMs = 4000,
  slides = FALLBACK_SLIDES,
  height = 340,
}) => {
  const sliderRef = React.useRef<Slider | null>(null);
  const [remote, setRemote] = React.useState<Banner[] | null>(null);
  const [index, setIndex] = React.useState(0);
  const { i18n } = useTranslation();

  const resolvedHeight = React.useMemo(
    () => (typeof height === "number" ? `${height}px` : height),
    [height]
  );

  React.useEffect(() => {
    fetchBanners()
      .then(setRemote)
      .catch(() => setRemote(null));
  }, []);

  const language = React.useMemo<"ru" | "tk">(
    () => (i18n.language?.toLowerCase().startsWith("ru") ? "ru" : "tk"),
    [i18n.language]
  );

  const apiOrigin = React.useMemo(() => {
    try {
      return new URL(API_BASE_URL).origin;
    } catch {
      return "";
    }
  }, []);

  const isExternalHref = React.useCallback((href: string) => {
    const trimmed = href.trim();
    return /^(?:[a-z][a-z0-9+.-]*:)?\/\//i.test(trimmed) ||
      /^mailto:/i.test(trimmed) ||
      /^tel:/i.test(trimmed);
  }, []);

  const normalizeInternalPath = React.useCallback((path: string) => {
    if (!path) return path;
    return path.startsWith("/") ? path : `/${path}`;
  }, []);

  const resolveBannerLink = React.useCallback(
    (banner?: Banner | null): SlideLink | null => {
      if (!banner) return null;

      const productId = banner.productId ?? undefined;
      if (productId !== undefined && productId !== null) {
        const value = `${productId}`.trim();
        if (value) {
          return { href: `/product/${value}`, external: false };
        }
      }

      const categoryId = banner.categoryId ?? undefined;
      const subcategoryId = banner.subcategoryId ?? undefined;

      if (
        categoryId !== undefined &&
        categoryId !== null &&
        subcategoryId !== undefined &&
        subcategoryId !== null
      ) {
        const categoryValue = `${categoryId}`.trim();
        const subcategoryValue = `${subcategoryId}`.trim();
        if (categoryValue && subcategoryValue) {
          return {
            href: `/catalog/${categoryValue}?subcategory=${subcategoryValue}`,
            external: false,
          };
        }
      }

      if (subcategoryId !== undefined && subcategoryId !== null) {
        const value = `${subcategoryId}`.trim();
        if (value) {
          return {
            href: `/catalog?subcategory=${value}`,
            external: false,
          };
        }
      }

      if (categoryId !== undefined && categoryId !== null) {
        const value = `${categoryId}`.trim();
        if (value) {
          return {
            href: `/catalog/${value}`,
            external: false,
          };
        }
      }

      const rawLink =
        banner.linkUrl ??
        banner.link ??
        banner.url ??
        banner.redirectUrl ??
        undefined;

      if (rawLink) {
        const trimmed = rawLink.trim();
        if (!trimmed) return null;
        if (isExternalHref(trimmed)) {
          return { href: trimmed, external: true };
        }
        return { href: normalizeInternalPath(trimmed), external: false };
      }

      return null;
    },
    [isExternalHref, normalizeInternalPath]
  );

  const getSlideLink = React.useCallback(
    (slide: Slide): SlideLink | null => {
      if (slide.href) {
        const trimmed = slide.href.trim();
        if (!trimmed) return null;
        if (slide.external ?? isExternalHref(trimmed)) {
          return { href: trimmed, external: slide.external ?? isExternalHref(trimmed) };
        }
        return { href: normalizeInternalPath(trimmed), external: false };
      }
      return resolveBannerLink(slide.meta);
    },
    [isExternalHref, normalizeInternalPath, resolveBannerLink]
  );

  const remoteSlides = React.useMemo<Slide[]>(() => {
    if (!remote || remote.length === 0) return [];
    return remote
      .filter((banner) => banner.isActive !== false)
      .map((banner, idx) => ({
        id: idx + 1,
        color: "#f5f5f7",
        image: banner.imageUrl?.startsWith("http")
          ? banner.imageUrl
          : `${apiOrigin}${banner.imageUrl}`,
        meta: banner,
        ...(resolveBannerLink(banner) ?? {}),
      }));
  }, [remote, apiOrigin, resolveBannerLink]);

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
      centerPadding: "0px",
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
    [count, intervalMs, handleBeforeChange, slidesToShow]
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

  const currentMeta =
    remoteSlides.length > 0 && count > 0
      ? remoteSlides[index % remoteSlides.length]?.meta ?? null
      : null;

  const localized = React.useCallback(
    <T extends Record<string, unknown>>(
      entity: T | null | undefined,
      base: string
    ) => {
      if (!entity) return undefined;
      const primaryKey = `${base}${language === "ru" ? "Ru" : "Tm"}` as keyof T;
      const fallbackKey = `${base}${
        language === "ru" ? "Tm" : "Ru"
      }` as keyof T;
      return (
        (entity[primaryKey] as string | null | undefined) ??
        (entity[fallbackKey] as string | null | undefined) ??
        (entity[base as keyof T] as string | null | undefined)
      );
    },
    [language]
  );

  return (
    <Box
      sx={{
        position: "relative",
        borderRadius: 3,
        overflow: "hidden",
        bgcolor: "grey.100",
        boxShadow: 1,
        ".slick-slider": { height: resolvedHeight, overflow: "visible" },
        ".slick-list": { height: "100%", mx: "-5px", overflow: "visible" },
        ".slick-slide": {
          px: "5px",
          transition: "box-shadow 0.4s ease",
        },
        ".slick-slide > div": { height: "100%" },
        ".slick-slide .banner-carousel__slide": {
          height: resolvedHeight,
          borderRadius: 2,
          overflow: "hidden",
          transition: "box-shadow 0.4s ease",
          boxShadow: 1,
        },
        ".banner-carousel__image": {
          display: "block",
          width: "100%",
          height: "100%",
        },
        ".slick-slide.slick-active .banner-carousel__slide": {
          boxShadow: 4,
        },
        ".slick-dots": { bottom: 16 },
        ".slick-dots li button:before": {
          fontSize: 10,
          color: "rgba(255,255,255,0.55)",
          opacity: 1,
        },
        ".slick-dots li.slick-active button:before": { color: "#fff" },
      }}
    >
      <Slider
        ref={(instance) => {
          sliderRef.current = instance;
        }}
        {...sliderSettings}
      >
        {currentSlides.map((slide) => {
          const link = getSlideLink(slide);
          const clickableProps: Record<string, unknown> = link
            ? link.external
              ? {
                  component: "a" as const,
                  href: link.href,
                  target: "_blank",
                  rel: "noopener noreferrer",
                }
              : { component: RouterLink, to: link.href }
            : {};

          return (
            <Box
              key={slide.id}
              className="banner-carousel__slide"
              {...clickableProps}
              sx={{
                position: "relative",
                width: "100%",
                height: resolvedHeight,
                bgcolor: slide.color,
                display: "block",
                borderRadius: 2,
                overflow: "hidden",
                transition: "box-shadow 0.4s ease, transform 0.3s ease",
                boxShadow: 1,
                cursor: link ? "pointer" : "default",
                textDecoration: "none",
                color: "inherit",
                outline: "none",
                "&:focus-visible": {
                  outline: (theme) => `3px solid ${theme.palette.primary.main}`,
                  outlineOffset: 2,
                },
              }}
            >
              {slide.image ? (
                <LazyLoadImage
                  src={slide.image}
                  alt={localized(slide.meta, "title") || "banner"}
                  effect="blur"
                  draggable={false}
                  width="100%"
                  height="100%"
                  style={{
                    display: "block",
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center",
                  }}
                  wrapperClassName="banner-carousel__image"
                />
              ) : (
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    background:
                      "linear-gradient(90deg, rgba(0,0,0,0.02), rgba(0,0,0,0.05))",
                  }}
                />
              )}
            </Box>
          );
        })}
      </Slider>

      {count > 1 && (
        <>
          <IconButton
            aria-label="Previous banner"
            onClick={() => sliderRef.current?.slickPrev()}
            sx={{
              position: "absolute",
              top: "50%",
              left: { xs: 8, md: 16 },
              transform: "translateY(-50%)",
              bgcolor: "rgba(255,255,255,0.9)",
              boxShadow: 3,
              zIndex: 2,
              color: "text.primary",
              "&:hover": { bgcolor: "rgba(255,255,255,1)" },
              "&:focus-visible": {
                outline: (theme) => `3px solid ${theme.palette.primary.main}`,
                outlineOffset: 2,
              },
            }}
          >
            <ArrowBackIosNew fontSize="small" />
          </IconButton>
          <IconButton
            aria-label="Next banner"
            onClick={() => sliderRef.current?.slickNext()}
            sx={{
              position: "absolute",
              top: "50%",
              right: { xs: 8, md: 16 },
              transform: "translateY(-50%)",
              bgcolor: "rgba(255,255,255,0.9)",
              boxShadow: 3,
              zIndex: 2,
              color: "text.primary",
              "&:hover": { bgcolor: "rgba(255,255,255,1)" },
              "&:focus-visible": {
                outline: (theme) => `3px solid ${theme.palette.primary.main}`,
                outlineOffset: 2,
              },
            }}
          >
            <ArrowForwardIos fontSize="small" />
          </IconButton>
        </>
      )}

      {currentMeta && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            p: { xs: 2, md: 4 },
            display: "flex",
            alignItems: "center",
            pointerEvents: "none",
          }}
        >
          {(() => {
            const title = localized(currentMeta, "title");
            const subtitle = localized(currentMeta, "subtitle");
            if (!title && !subtitle) return null;
            return (
              <Box
                sx={{
                  maxWidth: { xs: "80%", md: "50%" },
                  bgcolor: "rgba(255,255,255,0.85)",
                  p: { xs: 2, md: 3 },
                  borderRadius: 2,
                }}
              >
                {title && (
                  <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
                    {title}
                  </Typography>
                )}
                {subtitle && (
                  <Typography
                    variant="body1"
                    sx={{ "& p": { m: 0 } }}
                    dangerouslySetInnerHTML={{ __html: subtitle }}
                  />
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

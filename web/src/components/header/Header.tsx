import React from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  Badge,
  Container,
  Typography,
  Link as MLink,
  Divider,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import AppsIcon from "@mui/icons-material/Apps";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import SearchIcon from "@mui/icons-material/Search";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import FlightOutlinedIcon from "@mui/icons-material/FlightOutlined";
import BusinessCenterOutlinedIcon from "@mui/icons-material/BusinessCenterOutlined";
import LanguageIcon from "@mui/icons-material/Language";
import CheckIcon from "@mui/icons-material/Check";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store/store';
import { set as setWishlist } from '../../store/slices/wishlistSlice';
import { fetchWishlist } from '../../api/wishlist';
import { useTranslation } from "react-i18next";

const LOGO_URL = "/logo/logo.png";

export const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const [languageAnchor, setLanguageAnchor] =
    React.useState<null | HTMLElement>(null);
  const activeLanguage = i18n.language?.toLowerCase().startsWith("ru")
    ? "ru"
    : "tk";

  const languages = React.useMemo(() => {
    const lang = i18n.language?.toLowerCase().startsWith('ru') ? 'ru' : i18n.language?.toLowerCase().startsWith('tk') ? 'tk' : 'en';
    const labels = {
      en: { tk: 'Turkmen', ru: 'Russian' },
      ru: { tk: 'Туркменский', ru: 'Русский' },
      tk: { tk: 'Türkmençe', ru: 'Rusça' },
    } as const;
    return [
      { code: 'tk', label: labels[lang].tk, short: 'TM' },
      { code: 'ru', label: labels[lang].ru, short: 'RU' },
    ];
  }, [i18n.language]);

  const quickLinks = React.useMemo(
    () => [
      {
        icon: <CreditCardOutlinedIcon fontSize="small" />,
        label: t("header.links.installments"),
        to: "/catalog",
      },
      {
        icon: <FlightOutlinedIcon fontSize="small" />,
        label: t("header.links.travel"),
        to: "/catalog",
      },
      {
        icon: <BusinessCenterOutlinedIcon fontSize="small" />,
        label: t("header.links.business"),
        to: "/catalog",
      },
      { label: t("header.links.promotions"), to: "/catalog" },
      { label: t("header.links.services"), to: "/catalog" },
      { label: t("header.links.express"), to: "/catalog" },
    ],
    [t]
  );

  const openLanguageMenu = (event: React.MouseEvent<HTMLElement>) => {
    setLanguageAnchor(event.currentTarget);
  };

  const closeLanguageMenu = () => setLanguageAnchor(null);

  const selectLanguage = (code: string) => {
    if (code !== activeLanguage) {
      i18n.changeLanguage(code);
    }
    closeLanguageMenu();
  };

  const activeLanguageShort =
    languages.find((l) => l.code === activeLanguage)?.short ??
    activeLanguage.toUpperCase();

  React.useEffect(() => {
    fetchWishlist().then((list:any[]) => dispatch(setWishlist(list.map((w:any) => w.productId)))).catch(() => {})
    // Cart could be synced similarly if needed
  }, [dispatch]);

  // Badges
  const cartCount = useSelector((s: RootState) => s.cart.items.reduce((sum, it) => sum + it.qty, 0));
  const wishlistCount = useSelector((s: RootState) => s.wishlist.ids.length);

  return (
    <Box component="header">
      <AppBar position="static" color="primary" enableColorOnDark>
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ gap: 1.5, py: 1 }}>
            <Box
              component={Link}
              to="/"
              sx={{ height: "70px", display: "flex", alignItems: "center" }}
            >
              <Box
                component="img"
                src={LOGO_URL}
                alt="Kariz"
                sx={{ height: 100, width: 150 }}
              />
            </Box>

            <Button
              component={Link}
              to="/catalog"
              startIcon={<AppsIcon />}
              sx={{
                borderRadius: 999,
                px: 2.5,
                height: 44,
                textTransform: "none",
                fontWeight: 700,
                bgcolor: "primary.light",
                color: "primary.contrastText",
                boxShadow: "none",
                "&:hover": { bgcolor: "primary.main" },
              }}
              variant="contained"
            >
              {t("header.catalogButton")}
            </Button>

            <Box sx={{ flex: 1, mx: 1.5, display: { xs: "none", sm: "flex" } }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  bgcolor: "background.paper",
                  borderRadius: 999,
                  px: 1,
                  py: 0.5,
                  width: "100%",
                  border: "2px solid",
                  borderColor: "primary.light",
                }}
              >
                <Button
                  size="small"
                  startIcon={<PlaceOutlinedIcon />}
                  endIcon={<ArrowDropDownIcon />}
                  sx={{
                    textTransform: "none",
                    borderRadius: 999,
                    color: "text.primary",
                    bgcolor: "action.hover",
                    px: 1.5,
                    mr: 1,
                    minWidth: 0,
                  }}
                >
                  {t("header.locationButton")}
                </Button>
                <Box
                  component="input"
                  placeholder={t("header.searchPlaceholder") as string}
                  aria-label={t("header.searchPlaceholder") as string}
                  sx={{
                    flex: 1,
                    border: 0,
                    outline: "none",
                    fontSize: 16,
                    px: 1,
                    bgcolor: "transparent",
                    color: "text.primary",
                  }}
                />
                <IconButton
                  type="submit"
                  sx={{
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                    "&:hover": { bgcolor: "primary.dark" },
                  }}
                >
                  <SearchIcon />
                </IconButton>
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                color: "primary.contrastText",
                gap: 0.5,
              }}
            >
              <Button
                color="inherit"
                startIcon={<LanguageIcon />}
                endIcon={<ArrowDropDownIcon />}
                onClick={openLanguageMenu}
                sx={{
                  textTransform: "none",
                  fontWeight: 700,
                  px: 1.5,
                  minWidth: 0,
                }}
                aria-haspopup="menu"
                aria-controls={languageAnchor ? "language-menu" : undefined}
                aria-expanded={languageAnchor ? "true" : undefined}
              >
                {activeLanguageShort}
              </Button>
              <Menu
                id="language-menu"
                anchorEl={languageAnchor}
                open={Boolean(languageAnchor)}
                onClose={closeLanguageMenu}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
              >
                {languages.map((language) => (
                  <MenuItem
                    key={language.code}
                    selected={language.code === activeLanguage}
                    onClick={() => selectLanguage(language.code)}
                  >
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      {language.code === activeLanguage ? (
                        <CheckIcon fontSize="small" />
                      ) : null}
                    </ListItemIcon>
                    <ListItemText
                      primary={language.label}
                      secondary={language.short}
                    />
                  </MenuItem>
                ))}
              </Menu>

              <IconButton component={Link} to="/account" color="inherit">
                <Badge variant="dot" color="secondary" overlap="circular">
                  <PersonOutlineIcon />
                </Badge>
              </IconButton>
              <IconButton component={Link} to="/account/wishlist" color="inherit">
                <Badge badgeContent={wishlistCount} color="secondary">
                  <FavoriteBorderIcon />
                </Badge>
              </IconButton>
              <IconButton component={Link} to="/cart" color="inherit">
                <Badge badgeContent={cartCount} color="secondary">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Box
        sx={{
          bgcolor: "background.paper",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Container maxWidth="lg">
          <Toolbar
            disableGutters
            variant="dense"
            sx={{ gap: 2, minHeight: 44 }}
          >
            <Box
              sx={{
                display: "flex",
                gap: 2,
                alignItems: "center",
                color: "text.secondary",
                flexWrap: "wrap",
              }}
            >
              {quickLinks.map((link, idx) => (
                <MLink
                  key={`${link.label}-${idx}`}
                  component={Link}
                  to={link.to}
                  underline="none"
                  color="inherit"
                  sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                >
                  {link.icon}
                  {link.label}
                </MLink>
              ))}
            </Box>

            <Box sx={{ flex: 1 }} />

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                color: "text.secondary",
              }}
            >
              <PlaceOutlinedIcon fontSize="small" />
              <Typography variant="body2">{t("header.city")}</Typography>
              <Divider flexItem orientation="vertical" />
              <MLink component={Link} to="#" underline="hover" color="primary">
                {t("header.changeCity")}
              </MLink>
            </Box>
          </Toolbar>
        </Container>
      </Box>
    </Box>
  );
};

export default Header;

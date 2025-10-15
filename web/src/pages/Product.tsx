import React from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Stack,
  Chip,
  Skeleton,
  IconButton,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchProduct, fetchHomeHighlights, type ProductSummary } from "../api/products";
import { absoluteAssetUrl } from "../api/client";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  addItem as addCartItem,
  removeItem as removeCartItem,
  updateQty as updateCartQty,
} from "../store/slices/cartSlice";
import { addToCart as apiAddToCart } from "../api/cart";
import { toggle as toggleWishlist } from "../store/slices/wishlistSlice";
import { toggleWishlist as apiToggleWishlist } from "../api/wishlist";
import type { RootState } from "../store/store";
import { ProductCard } from "../components/products/ProductCard";

export const ProductPage: React.FC = () => {
  const { i18n, t } = useTranslation();
  const { id } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ["web", "product", id],
    queryFn: () => fetchProduct(id!),
    enabled: !!id,
  });
  const product = data as ProductSummary | undefined;
  const [imgIndex, setImgIndex] = React.useState(0);
  const [qty, setQty] = React.useState(0);
  const { data: highlights, isLoading: isRecommendationsLoading } = useQuery({
    queryKey: ["web", "product", "recommendations"],
    queryFn: () => fetchHomeHighlights(12),
  });

  const images = product?.images?.length ? product.images : [];
  const active = images[imgIndex];
  const price = product ? Number(product.price) : 0;
  const compareAt = product?.compareAt ?? null;
  const discount =
    compareAt && price && compareAt > price
      ? Math.round(((compareAt - price) / compareAt) * 100)
      : null;

  const dispatch = useDispatch();
  const cartItem = useSelector((s: RootState) =>
    product ? s.cart.items.find((item) => item.id === product.id) : undefined
  );
  const isWished = useSelector((s: RootState) =>
    product ? s.wishlist.ids.includes(product.id) : false
  );

  React.useEffect(() => {
    if (cartItem?.qty && cartItem.qty > 0) setQty(cartItem.qty);
    else setQty(0);
  }, [cartItem?.qty]);
  const uiLang: "ru" | "tk" = i18n.language?.toLowerCase().startsWith("ru")
    ? "ru"
    : "tk";
  const localizedName = React.useMemo(() => {
    if (!product) return "";
    return uiLang === "ru"
      ? product.nameRu ?? product.nameTk ?? ""
      : product.nameTk ?? product.nameRu ?? "";
  }, [product, uiLang]);

  const syncCartQty = React.useCallback(
    async (nextQty: number) => {
      if (!product) return;
      const name = localizedName || product.id;
      setQty(nextQty);
      if (nextQty <= 0) {
        dispatch(removeCartItem(product.id));
      } else if (!cartItem) {
        dispatch(
          addCartItem({
            id: product.id,
            name,
            price: Number(product.price),
            qty: nextQty,
            imageUrl: product.images?.[0],
          })
        );
      } else {
        dispatch(updateCartQty({ id: product.id, qty: nextQty }));
      }
      try {
        if (nextQty > 0) {
          await apiAddToCart(product.id, Number(product.price), nextQty);
        }
      } catch (error) {
        console.error("Failed to sync cart quantity", error);
      }
    },
    [cartItem, dispatch, localizedName, product]
  );

  const onAddToCart = () => {
    const current = qty || 0;
    void syncCartQty(current + 1);
  };

  const onIncreaseQty = () => {
    void syncCartQty(qty + 1);
  };

  const onDecreaseQty = () => {
    const next = qty - 1;
    void syncCartQty(next < 0 ? 0 : next);
  };

  const onToggleWishlist = async () => {
    if (!product) return;
    dispatch(toggleWishlist(product.id));
    try {
      await apiToggleWishlist(product.id);
    } catch (error) {
      console.error("Failed to toggle wishlist", error);
    }
  };

  const recommendationProducts = React.useMemo(() => {
    const deals = highlights?.deals ?? [];
    if (!product) return deals;
    return deals.filter((item) => item.id !== product.id);
  }, [highlights?.deals, product]);

  return (
    <Box
      sx={{
        display: "grid",
        gap: 2,
        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
      }}
    >
      <Card variant="outlined" sx={{ p: 2 }}>
        {isLoading ? (
          <Skeleton variant="rectangular" height={360} />
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "80px 1fr" },
              gap: 2,
            }}
          >
            <Stack
              spacing={1}
              direction={{ xs: "row", sm: "column" }}
              sx={{
                overflowX: { xs: "auto", sm: "hidden" },
                overflowY: { xs: "hidden", sm: "auto" },
                height: { xs: "auto", sm: 360 },
                pr: { sm: 1 },
                mr: { sm: -1 },
              }}
            >
              {images.map((img, i) => (
                <Box
                  key={i}
                  component="img"
                  src={absoluteAssetUrl(img)}
                  alt={`thumb-${i}`}
                  onMouseEnter={() => setImgIndex(i)}
                  sx={{
                    width: 72,
                    height: 72,
                    objectFit: "cover",
                    borderRadius: 1,
                    border: i === imgIndex ? "2px solid" : "1px solid",
                    borderColor: i === imgIndex ? "primary.main" : "divider",
                    cursor: "pointer",
                  }}
                />
              ))}
            </Stack>
            <Box
              sx={{
                position: "relative",
                minHeight: 360,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "grey.50",
                borderRadius: 2,
              }}
            >
              {active ? (
                <Box
                  component="img"
                  src={absoluteAssetUrl(active)}
                  alt={localizedName}
                  sx={{
                    maxWidth: "100%",
                    maxHeight: 420,
                    objectFit: "contain",
                  }}
                />
              ) : (
                <Skeleton variant="rectangular" width="100%" height={360} />
              )}
              {discount ? (
                <Chip
                  size="small"
                  color="error"
                  label={t("product.discountBadge", { value: discount })}
                  sx={{ position: "absolute", top: 8, left: 8 }}
                />
              ) : null}
            </Box>
          </Box>
        )}
      </Card>

      <Box>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          {localizedName || "—"}
        </Typography>
        <Stack direction="row" spacing={1} alignItems="baseline" sx={{ my: 2 }}>
          <Typography variant="h5" color="primary" sx={{ fontWeight: 800 }}>
            {product ? `${price.toFixed(2)} m` : ""}
          </Typography>
          {compareAt && compareAt > price ? (
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ textDecoration: "line-through" }}
            >{`${Number(compareAt).toFixed(2)} m`}</Typography>
          ) : null}
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          {qty > 0 ? (
            <Stack direction="row" spacing={0.5} alignItems="center">
              <IconButton
                color="primary"
                size="small"
                onClick={onDecreaseQty}
                aria-label={t("product.decreaseQty", { defaultValue: "Decrease quantity" })}
              >
                <RemoveIcon fontSize="small" />
              </IconButton>
              <Typography variant="subtitle1" sx={{ minWidth: 32, textAlign: "center" }}>
                {qty}
              </Typography>
              <IconButton
                color="primary"
                size="small"
                onClick={onIncreaseQty}
                aria-label={t("product.increaseQty", { defaultValue: "Increase quantity" })}
              >
                <AddIcon fontSize="small" />
              </IconButton>
            </Stack>
          ) : (
            <Button variant="contained" onClick={onAddToCart}>
              {t("product.addToCart", { defaultValue: "Add to cart" })}
            </Button>
          )}
          <Button
            variant={isWished ? "contained" : "outlined"}
            color="secondary"
            onClick={onToggleWishlist}
            startIcon={isWished ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
          >
            {t("product.wishlist")}
          </Button>
        </Stack>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {t("product.vendorLabel", { defaultValue: "Vendor" })}: {product?.vendorId
              ? t("product.vendorMarketplace", { defaultValue: "Marketplace vendor" })
              : t("product.vendorGlobal", { defaultValue: "Global" })}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t("product.skuLabel", { defaultValue: "SKU" })}: {product?.id?.slice(0, 8)}
          </Typography>
        </Box>
      </Box>

      <Card variant="outlined" sx={{ gridColumn: "1 / -1" }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {t("product.specsTitle", { defaultValue: "Characteristics" })}
          </Typography>
          {product?.specs && product.specs.length > 0 ? (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                columnGap: 3,
                rowGap: 1.5,
              }}
            >
              {product.specs.map((row, idx) => {
                const title =
                  uiLang === "ru"
                    ? row.titleRu || row.titleTk
                    : row.titleTk || row.titleRu;
                const text =
                  uiLang === "ru"
                    ? row.textRu || row.textTk
                    : row.textTk || row.textRu;
                if (!title && !text) return null;
                return (
                  <Box
                    key={idx}
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "auto 1fr auto",
                      alignItems: "baseline",
                      columnGap: 1,
                    }}
                  >
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ whiteSpace: "nowrap" }}
                    >
                      {title || "—"}
                    </Typography>
                    <Box
                      sx={{
                        borderBottom: "1px dotted",
                        borderColor: "divider",
                        height: 0,
                        mb: "0.2em",
                      }}
                    />
                    <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                      {text || "—"}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary">
              {t("product.specsEmpty", {
                defaultValue: "No characteristics provided.",
              })}
            </Typography>
          )}
        </CardContent>
      </Card>

      <Box sx={{ gridColumn: "1 / -1" }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          {t("product.recommendationsTitle", { defaultValue: "Recommended products" })}
        </Typography>
        {isRecommendationsLoading ? (
          <Stack direction="row" spacing={2}>
            <CircularProgress size={24} />
            <Typography variant="body2" color="text.secondary">
              {t("product.recommendationsLoading", { defaultValue: "Loading discounts..." })}
            </Typography>
          </Stack>
        ) : recommendationProducts.length > 0 ? (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(auto-fill, minmax(220px, 1fr))",
                md: "repeat(auto-fill, minmax(240px, 1fr))",
              },
              gap: 2,
            }}
          >
            {recommendationProducts.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary">
            {t("product.recommendationsEmpty", { defaultValue: "No discounted products available right now." })}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

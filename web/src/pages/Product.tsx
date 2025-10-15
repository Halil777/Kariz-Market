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
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchProduct, type ProductSummary } from "../api/products";
import { absoluteAssetUrl } from "../api/client";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { addItem as addCartItem } from "../store/slices/cartSlice";
import { addToCart as apiAddToCart } from "../api/cart";

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

  const images = product?.images?.length ? product.images : [];
  const active = images[imgIndex];
  const price = product ? Number(product.price) : 0;
  const compareAt = product?.compareAt ?? null;
  const discount =
    compareAt && price && compareAt > price
      ? Math.round(((compareAt - price) / compareAt) * 100)
      : null;

  const dispatch = useDispatch();
  const uiLang: "ru" | "tk" = i18n.language?.toLowerCase().startsWith("ru")
    ? "ru"
    : "tk";
  const localizedName = React.useMemo(() => {
    if (!product) return "";
    return uiLang === "ru"
      ? product.nameRu ?? product.nameTk ?? ""
      : product.nameTk ?? product.nameRu ?? "";
  }, [product, uiLang]);

  const onAddToCart = async () => {
    if (!product) return;
    const name = localizedName || product.id;
    dispatch(
      addCartItem({
        id: product.id,
        name,
        price: Number(product.price),
        qty: 1,
        imageUrl: product.images?.[0],
      })
    );
    try {
      await apiAddToCart(product.id, Number(product.price), 1);
    } catch {}
  };

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
                  label={`-${discount}%`}
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
        <Stack direction="row" spacing={1}>
          <Button variant="contained" onClick={onAddToCart}>
            Add to Cart
          </Button>
          <Button variant="outlined">Wishlist</Button>
        </Stack>
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Vendor: {product?.vendorId ? "Marketplace vendor" : "Global"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            SKU: {product?.id?.slice(0, 8)}
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
    </Box>
  );
};

import React from "react";
import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { BannerCarousel } from "../components/home/BannerCarousel";
import { ProductGridSection } from "../components/products/ProductGridSection";
import { fetchHomeHighlights } from "../api/products";

export const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const { data, isLoading } = useQuery({
    queryKey: ["home-highlights"],
    queryFn: () => fetchHomeHighlights(10),
    staleTime: 1000 * 60 * 5,
  });

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <BannerCarousel />
      </Box>
      <ProductGridSection
        title={t("home.topProducts")}
        products={data?.top}
        loading={isLoading}
      />
      <ProductGridSection
        title={t("home.bestDeals")}
        products={data?.deals}
        loading={isLoading}
      />
    </Box>
  );
};

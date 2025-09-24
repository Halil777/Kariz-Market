import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Drawer,
  Toolbar,
  List,
  ListItemButton,
  ListItemText,
  Chip,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { fetchCategoryTree, type CategoryNode } from "../api/categories";
import { fetchProducts, type ProductSummary } from "../api/products";
import ProductCard from "../components/products/ProductCard";
// import { fetchCategoryTree, type CategoryNode } from "@/api/categories";
// import { fetchProducts, type ProductSummary } from "@/api/products";
// import ProductCard from "@/components/products/ProductCard";

export const CatalogPage: React.FC = () => {
  const { data: tree = [] } = useQuery({
    queryKey: ["web", "categories", "tree"],
    queryFn: fetchCategoryTree,
  });
  const roots = (tree as CategoryNode[]) || [];
  const [selectedRootId, setSelectedRootId] = useState<string | undefined>(undefined);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>(undefined);
  const activeCategoryId = selectedCategoryId || selectedRootId;
  const { data: products = [] } = useQuery({
    queryKey: ["web", "products", activeCategoryId],
    queryFn: () => fetchProducts(activeCategoryId),
  });

  return (
    <Box display="flex" gap={2}>
      <Drawer variant="permanent" open PaperProps={{ sx: { position: "relative", width: 260 } }}>
        <Toolbar />
        <Box sx={{ p: 1.5 }}>
          <Typography variant="subtitle2" sx={{ mb: 1.5 }}>Categories</Typography>
          <List dense>
            {roots.map((c) => (
              <ListItemButton key={c.id} selected={selectedRootId === c.id} onClick={() => { setSelectedRootId(c.id); setSelectedCategoryId(undefined); }}>
                <ListItemText primary={(c as any).nameTk || c.name} primaryTypographyProps={{ noWrap: true }} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box flex={1}>
        {/* Nested subcategories view */}
        <Box sx={{ p: 1, mb: 1.5 }}>
          {(() => {
            const root = roots.find((r) => r.id === selectedRootId)
            const subs = root?.children || []
            return (
              <Box>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>Subcategories</Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                  <Chip label="All" color={!selectedCategoryId ? 'primary' : 'default'} size="small" onClick={() => setSelectedCategoryId(undefined)} />
                  {subs.map((s) => (
                    <Chip key={s.id} label={(s as any).nameTk || s.name} size="small" color={selectedCategoryId === s.id ? 'primary' : 'default'} onClick={() => setSelectedCategoryId(s.id)} />
                  ))}
                </Box>
                {/* grand-children under each subcategory */}
                <Box sx={{ display: 'grid', gap: 1.5, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
                  {subs.map((s) => (
                    <Box key={s.id}>
                      <Typography variant="subtitle2" sx={{ mb: 0.5 }}>{(s as any).nameTk || s.name}</Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {(s.children || []).map((g) => (
                          <Chip key={g.id} label={(g as any).nameTk || g.name} size="small" color={selectedCategoryId === g.id ? 'primary' : 'default'} onClick={() => setSelectedCategoryId(g.id)} />
                        ))}
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            )
          })()}
        </Box>
        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: {
              xs: "repeat(2, 1fr)",
              sm: "repeat(3, 1fr)",
              md: "repeat(4, 1fr)",
              lg: "repeat(5, 1fr)",
            },
          }}
        >
          {(products as ProductSummary[]).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

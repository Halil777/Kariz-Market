import React, { useEffect, useState } from "react";
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
import { useTranslation } from "react-i18next";

export const CatalogPage: React.FC = () => {
  const { i18n } = useTranslation();
  const { data: tree = [] } = useQuery({
    queryKey: ["web", "categories", "tree"],
    queryFn: fetchCategoryTree,
  });
  const roots = (tree as CategoryNode[]) || [];
  const [selectedRootId, setSelectedRootId] = useState<string | undefined>(
    undefined
  );
  useEffect(() => {
    if (!selectedRootId && roots.length) setSelectedRootId(roots[0].id);
  }, [roots, selectedRootId]);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const toggleExpanded = (id: string) =>
    setExpanded((p) => ({ ...p, [id]: !p[id] }));
  const uiLang: "ru" | "tk" = i18n.language?.toLowerCase().startsWith("ru")
    ? "ru"
    : "tk";
  const catName = (c?: any) => {
    if (!c) return "";
    return uiLang === "ru"
      ? c.nameRu ?? c.nameTk ?? c.name
      : c.nameTk ?? c.nameRu ?? c.name;
  };

  return (
    <Box display="flex" gap={2}>
      <Drawer
        variant="permanent"
        open
        PaperProps={{ sx: { position: "relative", width: 180 } }}
      >
        <Toolbar />
        <Box sx={{ p: 1.5 }}>
          <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
            Categories
          </Typography>
          <List dense>
            {roots.map((c) => (
              <ListItemButton
                key={c.id}
                selected={selectedRootId === c.id}
                onMouseEnter={() => setSelectedRootId(c.id)}
                onClick={() => setSelectedRootId(c.id)}
              >
                <ListItemText
                  primary={catName(c)}
                  primaryTypographyProps={{ noWrap: true }}
                />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box flex={1}>
        {(() => {
          const root = roots.find((r) => r.id === selectedRootId);
          const subs = root?.children || [];
          const colStyles = {
            display: "grid",
            gap: 2,
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              md: "repeat(3, 1fr)",
              lg: "repeat(4, 1fr)",
            },
          } as const;
          const itemLimit = 7;
          return (
            <Box sx={{ p: 2 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                {catName(root) || "Categories"}
              </Typography>
              <Box sx={colStyles}>
                {subs.map((s) => {
                  const items = s.children || [];
                  const open = !!expanded[s.id];
                  const visible = open ? items : items.slice(0, itemLimit);
                  return (
                    <Box key={s.id}>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 700, mb: 1 }}
                      >
                        {catName(s)}
                      </Typography>
                      <List dense sx={{ py: 0 }}>
                        {visible.map((g) => (
                          <Box key={g.id} sx={{ mb: 0.5 }}>
                            <ListItemText
                              primary={catName(g)}
                              primaryTypographyProps={{ variant: "body2" }}
                            />
                            {/* Show deeper subcategories under each third-level item */}
                            {Array.isArray(g.children) &&
                              g.children.length > 0 && (
                                <Box
                                  sx={{
                                    display: "flex",
                                    gap: 0.75,
                                    flexWrap: "wrap",
                                    mt: 0.25,
                                  }}
                                >
                                  {g.children.map((h: any) => (
                                    <Chip
                                      key={h.id}
                                      size="small"
                                      variant="outlined"
                                      label={catName(h)}
                                    />
                                  ))}
                                </Box>
                              )}
                          </Box>
                        ))}
                      </List>
                      {items.length > itemLimit && (
                        <Chip
                          size="small"
                          label={open ? "Less" : "More"}
                          onClick={() => toggleExpanded(s.id)}
                        />
                      )}
                    </Box>
                  );
                })}
              </Box>
            </Box>
          );
        })()}
      </Box>
    </Box>
  );
};

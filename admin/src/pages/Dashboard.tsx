import React from 'react';
import { Typography, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import { StatCard } from '@/components/dashboard/StatCard';
import { SalesLineChart } from '@/components/dashboard/SalesLineChart';
import { BestCategoriesBar } from '@/components/dashboard/BestCategoriesBar';
import { RecentOrdersTable } from '@/components/dashboard/RecentOrdersTable';
import { SystemAlerts } from '@/components/dashboard/SystemAlerts';

export const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <Typography variant="h5" gutterBottom>{t('dashboard.title')}</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title={t('dashboard.totalSales')} value="$45,231.89" delta={20.1} positive icon={<MonetizationOnOutlinedIcon />} currency="$" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title={t('dashboard.totalOrders')} value={2350} delta={18.3} positive icon={<ListAltOutlinedIcon />} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title={t('dashboard.activeVendors')} value={128} delta={5.1} positive icon={<StorefrontOutlinedIcon />} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title={t('dashboard.activeCustomers')} value={1540} delta={-1.2} positive={false} icon={<PeopleAltOutlinedIcon />} />
        </Grid>

        <Grid item xs={12} md={6}>
          <SalesLineChart />
        </Grid>
        <Grid item xs={12} md={6}>
          <BestCategoriesBar />
        </Grid>

        <Grid item xs={12} md={6}>
          <RecentOrdersTable />
        </Grid>
        <Grid item xs={12} md={6}>
          <SystemAlerts />
        </Grid>
      </Grid>
    </>
  );
};

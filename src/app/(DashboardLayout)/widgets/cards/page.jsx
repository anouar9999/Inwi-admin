'use client'

import { Grid } from '@mui/material';
import Breadcrumb from '@/app/(DashboardLayout)/layout/shared/breadcrumb/Breadcrumb';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';

import PaymentGateways from '@/app/(DashboardLayout)/components/dashboards/ecommerce/PaymentGateways';
import RecentTransactions from '@/app/(DashboardLayout)/components/dashboards/ecommerce/RecentTransactions';
import TopCards from '@/app/(DashboardLayout)/components/dashboards/modern/TopCards';
import UpcomingAcitivity from '@/app/(DashboardLayout)/components/widgets/cards/UpcomingActivity';
import ComplexCard from '@/app/(DashboardLayout)/components/widgets/cards/ComplexCard';
import MusicCard from '@/app/(DashboardLayout)/components/widgets/cards/ParticipantCardGrid';
import EcommerceCard from '@/app/(DashboardLayout)/components/widgets/cards/EcommerceCard';
import FollowerCard from '@/app/(DashboardLayout)/components/widgets/cards/FollowerCard';
import FriendCard from '@/app/(DashboardLayout)/components/widgets/cards/FriendCard';
import ProfileCard from '@/app/(DashboardLayout)/components/widgets/cards/ProfileCard';

import Settings from '@/app/(DashboardLayout)/components/widgets/cards/Settings';
import GiftCard from '@/app/(DashboardLayout)/components/widgets/cards/GiftCard';


const BCrumb = [
  {
    to: '/',
    title: 'Home',
  },
  {
    title: 'Cards',
  },
];

const WidgetCards = () => {
  return (
    <PageContainer title="Cards" description="this is Cards">
    {/* breadcrumb */}
    <Breadcrumb title="Cards" items={BCrumb} />
    {/* end breadcrumb */}
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <TopCards />
      </Grid>
      <Grid item xs={12}>
        <ComplexCard />
      </Grid>
      <Grid item xs={12}>
        <EcommerceCard />
      </Grid>
      <Grid item xs={12}>
        <MusicCard />
      </Grid>
      <Grid item xs={12}>
        <FollowerCard />
      </Grid>
      <Grid item xs={12}>
        <FriendCard />
      </Grid>
      <Grid item xs={12}>
        <ProfileCard />
      </Grid>
      <Grid item xs={12} sm={6} lg={4}>
        <Settings />
      </Grid>
      <Grid item xs={12} lg={8}>
        <GiftCard />
      </Grid>
      <Grid item xs={12} sm={6} lg={4}>
        <PaymentGateways />
      </Grid>
      <Grid item xs={12} sm={6} lg={4}>
        <UpcomingAcitivity />
      </Grid>
      <Grid item xs={12} sm={6} lg={4}>
        <RecentTransactions />
      </Grid>
    </Grid>
    </PageContainer>
  );
};

export default WidgetCards;

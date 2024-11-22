"use client"

import Grid from '@mui/material/Grid'
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import ProfileBanner from '@/app/(DashboardLayout)/components/apps/userprofile/profile/ProfileBanner';
import FriendsCard from '@/app/(DashboardLayout)/components/apps/userprofile/friends/FriendsCard';

const Friends = () => {
  return (
    <PageContainer title="Friends" description="this is Friends">
      <Grid container spacing={3}>
        <Grid item sm={12}>
          <ProfileBanner />
        </Grid>
        <Grid item sm={12}>
          <FriendsCard />
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default Friends;

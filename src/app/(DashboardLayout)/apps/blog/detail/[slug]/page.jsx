"use client"

import BlogDetail from "@/app/(DashboardLayout)/components/apps/blog/detail";
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';

const BlogPost = () => {
  return (
    <PageContainer title="Blog Detail" description="this is Blog Detail">

      <BlogDetail />
    </PageContainer>
  );
};

export default BlogPost;

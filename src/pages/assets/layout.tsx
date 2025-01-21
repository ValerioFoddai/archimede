import { Outlet } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/dashboard-layout';

export function AssetsLayout() {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}

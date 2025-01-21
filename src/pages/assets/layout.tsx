import { Outlet } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/dashboard-layout';
import { AssetsSidebar } from '../../components/layout/assets-sidebar';

export function AssetsLayout() {
  return (
    <DashboardLayout>
      <div className="flex h-full gap-6">
        <AssetsSidebar />
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </DashboardLayout>
  );
}

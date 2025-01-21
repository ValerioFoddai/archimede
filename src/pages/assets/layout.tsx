import { Outlet } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/dashboard-layout';
import { AssetsSidebar } from '../../components/layout/assets-sidebar';

export function AssetsLayout() {
  return (
    <DashboardLayout>
      <div className="space-y-6 pb-16">
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="lg:w-1/5">
            <AssetsSidebar />
          </aside>
          <div className="flex-1">
            <Outlet />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

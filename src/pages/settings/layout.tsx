import { Outlet } from 'react-router-dom';
import { DashboardLayout } from '../../components/layout/dashboard-layout';
import { SettingsSidebar } from './components/settings-sidebar';

export function SettingsLayout() {
  return (
    <DashboardLayout>
      <div className="flex h-full gap-6">
        <SettingsSidebar />
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </DashboardLayout>
  );
}

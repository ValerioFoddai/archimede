import { Routes, Route, Navigate } from 'react-router-dom';
import { ImportSelectionPage } from './selection';
import { CustomImportPage } from './custom';
import { HypeImportPage } from './hype';

export function ImportPage() {
  return (
    <Routes>
      <Route index element={<ImportSelectionPage />} />
      <Route path="custom" element={<CustomImportPage />} />
      <Route path="hype" element={<HypeImportPage />} />
      <Route path="*" element={<Navigate to="/transactions/import" replace />} />
    </Routes>
  );
}

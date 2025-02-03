import { Routes, Route, Navigate } from 'react-router-dom';
import { ImportSelectionPage } from './selection';
import { CustomImportPage } from './custom';
import { HypeImportPage } from './hype';
import { FinecoImportPage } from './fineco';
import { SellaImportPage } from './sella';
import { RevolutImportPage } from './revolut';

export function ImportPage() {
  return (
    <Routes>
      <Route index element={<ImportSelectionPage />} />
      <Route path="custom" element={<CustomImportPage />} />
      <Route path="hype" element={<HypeImportPage />} />
      <Route path="fineco" element={<FinecoImportPage />} />
      <Route path="banca-sella" element={<SellaImportPage />} />
      <Route path="revolut" element={<RevolutImportPage />} />
      <Route path="*" element={<Navigate to="/transactions/import" replace />} />
    </Routes>
  );
}

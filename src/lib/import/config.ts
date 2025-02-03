import { BankImportConfig } from '@/types/banks';
import { hypeBankConfig } from './banks/hype';
import { revolutBankConfig } from './banks/revolut';
import { sellaBankConfig } from './banks/sella';

const bankConfigs: Record<string, BankImportConfig> = {
  'banca-sella': sellaBankConfig,
  'hype': hypeBankConfig,
  'revolut': revolutBankConfig,
};

export function getBankConfig(bankId: string): BankImportConfig {
  const config = bankConfigs[bankId.toLowerCase()];
  if (!config) {
    throw new Error(`No configuration found for bank: ${bankId}`);
  }
  return config;
}

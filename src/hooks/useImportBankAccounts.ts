import { useState, useEffect } from 'react';
import { useUserBankAccounts, type UserBankAccount } from './useUserBankAccounts';
import { useBanks } from './useBanks';

interface ImportBankAccountState {
  hasExistingAccounts: boolean;
  selectedAccountId: number | null;
  showCreateForm: boolean;
}

export function useImportBankAccounts(bankId?: string) {
  const [state, setState] = useState<ImportBankAccountState>({
    hasExistingAccounts: false,
    selectedAccountId: null,
    showCreateForm: false,
  });
  
  const { accounts, loading: accountsLoading, error: accountsError } = useUserBankAccounts();
  const { banks, loading: banksLoading } = useBanks();

  // Check for existing accounts and pre-select if possible
  useEffect(() => {
    if (!accountsLoading && accounts.length > 0) {
      setState(prev => ({
        ...prev,
        hasExistingAccounts: true,
        // If bankId is provided, try to find a matching account
        selectedAccountId: bankId 
          ? accounts.find(acc => acc.bank_id === bankId)?.id || null
          : null
      }));
    }
  }, [accounts, accountsLoading, bankId]);

  // Get relevant bank accounts for the current import
  const relevantAccounts = bankId
    ? accounts.filter(acc => acc.bank_id === bankId)
    : accounts;

  const selectedAccount = state.selectedAccountId
    ? accounts.find(acc => acc.id === state.selectedAccountId)
    : null;

  // Actions
  const selectAccount = (accountId: number | null) => {
    setState(prev => ({
      ...prev,
      selectedAccountId: accountId,
      showCreateForm: false
    }));
  };

  const showCreateForm = () => {
    setState(prev => ({
      ...prev,
      showCreateForm: true,
      selectedAccountId: null
    }));
  };

  const hideCreateForm = () => {
    setState(prev => ({
      ...prev,
      showCreateForm: false
    }));
  };

  const getSelectedBankName = () => {
    if (!bankId || !banks) return null;
    return banks.find(bank => bank.id === bankId)?.name || null;
  };

  return {
    // State
    hasExistingAccounts: state.hasExistingAccounts,
    selectedAccountId: state.selectedAccountId,
    selectedAccount,
    showCreateForm: state.showCreateForm,
    relevantAccounts,
    
    // Loading states
    loading: accountsLoading || banksLoading,
    error: accountsError,
    
    // Actions
    selectAccount,
    openCreateForm: showCreateForm,
    hideCreateForm,
    getSelectedBankName
  };
}

# [DEPRECATED] Bank Account Integration Plan

> **Note**: This document is deprecated as of January 2024. The bank account functionality has been removed in favor of a new Assets section that will provide more comprehensive asset management features in the future.

## Current Status

The bank account management functionality has been removed, but bank information is still used in transactions:
- Bank accounts page replaced with Assets placeholder
- Database tables cleaned up:
  * Dropped transaction_bank_accounts table
  * Dropped user_bank_accounts table
  * Dropped user_bank_status view
- Bank information in transactions:
  * Bank ID preserved in transactions table
  * Bank names displayed in transaction list (between Date and Merchant columns)
  * Bank column is toggleable through column visibility settings
  * Banks table maintained for import and display purposes

## Future Direction

The functionality previously planned for bank accounts will be reimagined as part of a broader Assets management feature set that will include:
- Multiple asset type tracking
- Investment monitoring
- Performance analytics
- Comprehensive reporting

For current implementation details of the Assets section, refer to the [Features Changelog](./features-changelog.md#assets-section-updates-january-2024).

## Historical Documentation

The rest of this document is preserved for historical reference but should not be used for current development.

---

[Previous documentation preserved below]

[Original content follows...]

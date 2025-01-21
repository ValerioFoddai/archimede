# Bank Account Integration Plan

## Overview
This document outlines the planned changes to integrate bank account selection into the transaction import flow while maintaining system flexibility.

## Current System
- Users can import transactions from various banks
- Bank-specific import flows handle different file formats
- Transactions can be created without bank account assignment
- System supports multiple import sources (Fineco, Hype, Banca Sella)

## Planned Changes

### 1. Enhanced Import Flow

#### Initial Bank Account Check
- System checks for existing bank accounts when import starts
- Different flows based on account existence:
  * With existing accounts:
    - Show bank account selection step
    - Pre-select matching bank account based on import source
    - Option to create new account inline
  * Without existing accounts:
    - Show suggestion to create bank account
    - Provide "Continue without bank account" option
    - Include "Remind me later" choice

#### Bank Account Creation
- Quick creation form within import flow
- Pre-filled bank selection based on import source
- Immediate availability for transaction assignment

#### Import Process
- Optional bank account selection maintained
- Automatic transaction assignment when account selected
- Preserve ability to import without account selection

### 2. Transaction Management

#### Assignment Options
- Automatic assignment during import (when account selected)
- Manual assignment through transaction form
- Bulk assignment capability for existing transactions
- Retroactive assignment for historical data

#### User Interface Updates
- Add bank account field to transaction list
- Implement bank account filters
- Show unassigned transaction indicators
- Add bulk assignment tools

### 3. Data Model Utilization

#### Transaction Bank Accounts Table
- Leverage new transaction_bank_accounts table
- Maintain optional relationships
- Support for:
  * Direct assignments during import
  * Manual assignments post-import
  * Bulk updates
  * Relationship modifications

#### Security Considerations
- Maintain RLS policies for data access
- Ensure user owns both transaction and bank account
- Preserve data integrity during bulk operations

## Implementation Priorities

1. Import Flow Enhancement
   - Add bank account selection step
   - Implement inline account creation
   - Maintain optional assignment

2. Transaction Management
   - Update transaction list view
   - Add assignment capabilities
   - Implement bulk operations

3. User Experience
   - Add helpful prompts and suggestions
   - Maintain system flexibility
   - Provide clear assignment status

## Future Considerations

- Analytics based on bank account assignments
- Enhanced reporting per account
- Transaction categorization rules per bank account
- Automated balance reconciliation
- Import history per bank account

## Migration Strategy

- Existing transactions remain unassigned initially
- Provide bulk assignment tools for historical data
- Allow gradual adoption of bank account organization
- Maintain backward compatibility for existing import flows

import { ProductNews } from '@/types/product-news'

export const LATEST_VERSION = '1.2.0'

export const productNews: ProductNews[] = [
  {
    id: '2',
    version: '1.2.0',
    versionType: 'minor',
    title: 'Banca Sella Integration',
    description: 'Added support for Banca Sella account imports with enhanced transaction matching and categorization.',
    changes: [
      'Added support for Banca Sella CSV imports - Import your transactions directly from Banca Sella\'s exported files',
      'Smart duplicate detection to prevent importing the same transaction multiple times',
      'Improved column mapping interface with field suggestions for easier setup',
      'Bulk delete capability for managing imported transactions',
      'Transaction categorization based on description patterns to help organize your data'
    ],
    createdAt: '2024-01-16T00:00:00Z',
    publishedAt: '2024-01-16T00:00:00Z'
  },
  {
    id: '1',
    version: '1.1.0',
    versionType: 'minor',
    title: 'Fineco & Hype Import Support',
    description: 'Expanded bank support with Fineco and Hype integrations, plus major improvements to the import system.',
    changes: [
      'Added support for Fineco Bank exports - Import transactions with automatic field mapping for standard Fineco columns',
      'Hype integration - Import transactions with merchant information extraction',
      'Bank-specific date format handling to ensure accurate import',
      'Specialized categorization rules for both Fineco and Hype transactions',
      'Improved duplicate detection for each bank format',
      'Enhanced error handling during import process'
    ],
    createdAt: '2024-01-01T00:00:00Z',
    publishedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '0',
    version: '1.0.0',
    versionType: 'major',
    title: 'Initial Release',
    description: 'Welcome to Archimede! Your new personal finance management tool with powerful features for tracking, analyzing, and organizing your finances.',
    changes: [
      'Transaction Management - Import, view, and organize your financial transactions',
      'Transaction Search - Find transactions by description, amount, or date',
      'Bulk Operations - Delete multiple transactions at once',
      'Expense Categories - Hierarchical category system with parent and sub-categories',
      'Custom Tags - Create, manage, and color-code tags for better organization',
      'Basic Analytics - View spending patterns with category-based charts',
      'Customizable Interface - Adjust column visibility and sort transactions your way',
      'Dark/Light Theme - Choose your preferred visual style',
      'Bank Import System - Support for CSV imports from major Italian banks',
      'Security Features - User authentication and secure data storage'
    ],
    createdAt: '2023-12-15T00:00:00Z',
    publishedAt: '2023-12-15T00:00:00Z'
  }
]

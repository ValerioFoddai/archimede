# UI & Navigation

## Layout Structure

The application uses a responsive layout system implemented in `src/components/layout/`:

### Dashboard Layout
Component: `src/components/layout/dashboard-layout.tsx`
```
+----------------+------------------+
|    Sidebar     |     TopNav      |
|                |------------------|
|   Navigation   |                 |
|     Links      |    Main Content |
|                |                 |
|    Settings    |                 |
|                |                 |
+----------------+------------------+
```

### Responsive Behavior
- Desktop: Full sidebar visible
- Tablet: Collapsible sidebar
- Mobile: Bottom navigation bar

## Navigation Components

### Sidebar
Component: `src/components/layout/sidebar/sidebar.tsx`
- Main navigation menu
- Collapsible sections
- Active state indicators
- User profile section
- Quick action buttons

### Top Navigation
Component: `src/components/layout/top-nav.tsx`
- Page title
- Search functionality
- User notifications
- Quick actions
- Profile menu

## Core UI Components

Located in `src/components/ui/`:

### Buttons (`button.tsx`)
- Primary actions
- Secondary actions
- Danger actions
- Icon buttons
- Loading states

### Forms
- Input fields (`input.tsx`)
- Select menus (`select.tsx`)
- Checkboxes (`checkbox.tsx`)
- Radio buttons
- Date pickers (`calendar.tsx`)
- Form validation (`form.tsx`)

### Feedback
- Toast notifications (`toast.tsx`)
- Progress indicators (`progress.tsx`)
- Loading states (`skeleton.tsx`)
- Error messages (`alert.tsx`)

### Overlays
- Modal dialogs (`dialog.tsx`)
- Popovers (`popover.tsx`)
- Dropdown menus (`dropdown-menu.tsx`)
- Command palette (`command.tsx`)

### Data Display
- Tables (`table.tsx`)
- Cards (`card.tsx`)
- Badges (`badge.tsx`)
- Lists
- Charts

## Page Layouts

### Transaction Pages
Location: `src/pages/transactions/`
```
+-------------------------+
|     Filter Section     |
+-------------------------+
|    Transaction List    |
|                       |
|   [Transaction Items] |
|                       |
+-------------------------+
|      Pagination       |
+-------------------------+
```

### Analytics Pages
Location: `src/pages/analytics/`
```
+-------------------------+
|    Date Range Filter   |
+-------------------------+
|     Summary Cards      |
+-------------------------+
|    Primary Chart      |
+-------------------------+
|   Secondary Charts    |
+-------------------------+
```

### Settings Pages
Location: `src/pages/settings/`
```
+-------------------------+
|   Settings Navigation  |
+-------------------------+
|                       |
|    Settings Forms     |
|                       |
+-------------------------+
```

## Interactive Elements

### Transaction Forms
Component: `src/components/transactions/transaction-form/`
- Step-by-step input
- Real-time validation
- Auto-complete suggestions
- Category selection
- Tag management

### Import Flow
Location: `src/components/transactions/import/`
- File upload interface
- Bank selection grid
- Mapping configuration
- Preview and confirmation

### Category Management
Location: `src/components/expense-categories/`
- Category tree view
- Drag-and-drop reordering
- Inline editing
- Budget allocation

## Theme System

### Color Scheme
- Primary: Brand colors
- Secondary: Supporting colors
- Accent: Highlight colors
- Semantic: Success, warning, error
- Neutral: Grays

### Typography
- Font families
- Size scale
- Weight variations
- Line heights

### Spacing
- Consistent spacing scale
- Component-specific spacing
- Responsive adjustments

### Dark Mode
- Color palette adjustments
- Component variations
- Toggle mechanism

## Accessibility Features

### Keyboard Navigation
- Focus management
- Tab order
- Keyboard shortcuts
- Focus trapping in modals

### Screen Readers
- ARIA labels
- Role attributes
- State announcements
- Description text

### Visual Accessibility
- Color contrast
- Text sizing
- Focus indicators
- Error states

## Responsive Design

### Breakpoints
```css
sm: 640px   // Mobile devices
md: 768px   // Tablets
lg: 1024px  // Desktop
xl: 1280px  // Large desktop
2xl: 1536px // Extra large screens
```

### Mobile Optimizations
- Touch targets
- Simplified navigation
- Optimized forms
- Responsive tables
- Stack layouts

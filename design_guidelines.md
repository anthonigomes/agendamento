# Design Guidelines: Sistema de Agendamento - Laboratório de Informática

## Design Approach

**Selected Approach:** Design System - Material Design  
**Justification:** This educational scheduling tool prioritizes functionality, clarity, and ease of use for teachers. Material Design's proven patterns for forms, data tables, and calendar interfaces align perfectly with Google Sheets integration and provide familiar interactions for educational users.

**Key Design Principles:**
1. Clarity First: Every element serves a clear purpose in the scheduling workflow
2. Efficiency: Minimize clicks and cognitive load for busy teachers
3. Trustworthy: Professional appearance that inspires confidence in data accuracy
4. Accessible: Large touch targets, clear labels, readable text for all users

---

## Core Design Elements

### A. Typography

**Font Family:** Roboto (via Google Fonts CDN) for consistency with Material Design and Google ecosystem

**Hierarchy:**
- Page Titles: font-size: 2rem (32px), font-weight: 500
- Section Headers: font-size: 1.5rem (24px), font-weight: 500
- Subsection Headers: font-size: 1.25rem (20px), font-weight: 500
- Body Text: font-size: 1rem (16px), font-weight: 400
- Form Labels: font-size: 0.875rem (14px), font-weight: 500, uppercase tracking
- Helper Text: font-size: 0.75rem (12px), font-weight: 400
- Button Text: font-size: 0.875rem (14px), font-weight: 500, uppercase

---

### B. Layout System

**Tailwind Spacing Units:** Use 2, 4, 6, 8, 12, 16, and 24 for consistent rhythm
- Small gaps/padding: p-2, gap-2 (8px)
- Standard spacing: p-4, gap-4 (16px)
- Section padding: p-6, p-8 (24px, 32px)
- Large separations: mb-12, mt-16 (48px, 64px)
- Component spacing: space-y-6, gap-8

**Grid Structure:**
- Main container: max-w-7xl mx-auto px-4
- Form container: max-w-2xl mx-auto
- Calendar grid: Full-width responsive grid
- Dashboard cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3

**Responsive Breakpoints:**
- Mobile-first approach
- Tablet: md: breakpoint for 2-column layouts
- Desktop: lg: breakpoint for full calendar and multi-column views

---

### C. Component Library

**1. Navigation Header**
- Fixed top bar with logo/title "Agendamento Lab de Informática"
- Right-aligned user info and quick actions (New Booking, View Schedule)
- Height: h-16, shadow elevation for depth
- Padding: px-6

**2. Scheduling Form Card**
- Elevated card with rounded corners (rounded-lg)
- Padding: p-8
- Form fields with consistent spacing: space-y-6
- Input fields:
  - Full-width with labels above
  - Height: h-12 for inputs, h-24 for textarea
  - Border radius: rounded-md
  - Focus state with ring outline
- Select dropdowns for:
  - Turno (Manhã, Tarde, Noite)
  - Dia da Semana
  - Horário de Início
  - Duração (1 or 2 aulas)
- Text inputs for:
  - Nome do Professor
  - Disciplina
  - Observações (optional textarea)
- Radio buttons for number of classes (1 or 2 aulas simultâneas)
- Submit button: Full-width, h-12, rounded-md, bold text

**3. Calendar/Schedule Grid**
- Weekly view as default
- 7 columns (days) + 1 row header for time slots
- Each cell: min-h-20, p-2
- Time slots in 30-minute or 1-hour increments
- Booked slots show: professor name, subject, pill badge for "1 aula" or "2 aulas"
- Available slots: subtle styling with hover interaction
- Grid borders for clear separation

**4. Shift/Turno Tabs**
- Three tabs: Manhã, Tarde, Noite
- Active tab indication with underline or fill
- Height: h-12
- Spacing: gap-2 between tabs
- Full-width on mobile, inline on desktop

**5. Booking Cards (List View)**
- Card per booking: rounded-lg, p-6, space-y-2
- Display: Professor name (bold), Subject, Time, Duration badge
- Action buttons: Edit, Delete (icon buttons)
- Organized in grid: grid-cols-1 md:grid-cols-2 gap-4

**6. Admin Dashboard Widgets**
- Statistics cards in grid: grid-cols-1 md:grid-cols-3 gap-6
- Each card: rounded-lg, p-6
- Large number display for stats (reservations today, this week, etc.)
- Icon + label + value structure
- Elevation shadow for depth

**7. Filter Controls**
- Horizontal filter bar with dropdowns and date picker
- Spacing: gap-4 between filter elements
- Height: h-10 for filter inputs
- Apply/Clear buttons aligned right

**8. Buttons**
- Primary CTA: h-12, px-8, rounded-md, font-weight: 500
- Secondary: h-10, px-6, rounded-md, outlined variant
- Icon buttons: h-10 w-10, rounded-full
- Button groups: gap-2

**9. Data Table (Alternative View)**
- Striped rows for readability
- Column headers with sorting indicators
- Row height: h-16, px-4
- Pagination controls at bottom
- Responsive: horizontal scroll on mobile

**10. Toast Notifications**
- Fixed position: top-right
- Max-width: max-w-md
- Padding: p-4
- Rounded: rounded-lg
- Auto-dismiss with progress bar
- Icon + message structure

**11. Modal/Dialog**
- Centered overlay
- Max-width: max-w-lg
- Padding: p-6
- Rounded corners: rounded-lg
- Header: title + close button
- Footer: action buttons aligned right

**12. Empty States**
- Centered content
- Icon (using Heroicons)
- Heading + descriptive text
- Primary CTA to add first booking
- Padding: py-24

---

### D. Icons

**Library:** Heroicons (via CDN)
- Calendar icon for scheduling
- Clock for time-related elements
- User icon for professor
- Book icon for subject/discipline
- Check/X icons for confirmation/deletion
- Plus icon for new bookings
- Pencil for edit actions
- Filter icon for controls

---

### E. Accessibility

**Form Accessibility:**
- All inputs have associated labels with htmlFor attributes
- Required fields marked with asterisk and aria-required
- Error messages with aria-live announcements
- Placeholder text provides examples
- Focus indicators on all interactive elements

**Keyboard Navigation:**
- Tab order follows logical flow
- Enter key submits forms
- Escape closes modals
- Arrow keys navigate calendar grid

**Screen Reader Support:**
- Semantic HTML (nav, main, section, article)
- ARIA labels for icon-only buttons
- Status messages announced for booking confirmations
- Table headers properly associated

**Touch Targets:**
- Minimum 44px height for all interactive elements
- Adequate spacing between clickable elements (gap-2 minimum)

---

### F. Animations

**Minimal, Purpose-Driven:**
- Fade-in for toast notifications (200ms)
- Slide-down for dropdowns (150ms)
- Modal backdrop fade (200ms)
- No unnecessary scroll animations
- Focus: immediate, no animation

---

## Images

**No hero image required.** This is a utility application focused on functionality. The interface should be clean and form-focused without large imagery.

**Small decorative elements only:**
- School/education-themed icon in header (optional, small 40x40px)
- Empty state illustrations (simple, line-art style, 200x200px max)

---

## Page-Specific Layouts

**Main Booking Page:**
- Header navigation (h-16)
- Shift tabs immediately below header
- Two-column layout on desktop: Form (left, sticky) + Calendar preview (right)
- Single column on mobile: Form stacked above calendar
- Footer with quick stats

**Schedule View Page:**
- Header with date navigation
- Shift selector tabs
- Full-width calendar grid
- Legend for booking status
- Filter sidebar (collapsible on mobile)

**Admin Dashboard:**
- Header
- Stats cards row (3 columns)
- Recent bookings list
- Quick actions panel
- Reports summary section
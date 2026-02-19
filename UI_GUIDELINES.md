# UI Guidelines - OpenRouter Traces Dashboard

## Overview
This document captures the UI/UX patterns and design system used in the OpenRouter Traces Dashboard. Use these guidelines to implement a similar style in ReactJS + TailwindCSS projects.

---

## Color System

### Base Colors
```css
--bg: #f8f9fb                    /* Main background */
--surface: #ffffff               /* Card/modal backgrounds */
--border: #e2e6ed                /* Primary border */
--border-light: #f0f2f5         /* Light borders */
```

### Text Colors
```css
--text: #1a1d26                  /* Primary text */
--text-secondary: #5f6980        /* Secondary text */
--text-tertiary: #8b95a9         /* Tertiary text */
```

### Brand Colors
```css
--primary: #4f6ef7               /* Primary brand color */
--primary-hover: #3b5de7        /* Primary hover state */
--primary-light: #eef1fe        /* Primary light background */
```

### Semantic Colors
```css
--success: #10b981               /* Success states */
--success-light: #ecfdf5        /* Success light background */

--warning: #f59e0b               /* Warning states */
--warning-light: #fffbeb        /* Warning light background */

--danger: #ef4444                /* Error/danger states */
--danger-light: #fef2f2         /* Danger light background */

--info: #6366f1                  /* Info states */
--info-light: #eef2ff           /* Info light background */
```

---

## Typography

### Font Family
- Primary: **Inter** (Google Fonts)
- Fallback: system-ui, -apple-system, sans-serif
- Monospace: **Fira Code** (for code/JSON)

### Font Sizes
```css
Base: 14px
Small: 11-12px (labels, tertiary text)
Medium: 13px (body text, inputs)
Large: 16px (headings, titles)
XL: 20px (values, stats)
XXL: 22px (page titles)
```

### Font Weights
```css
Regular: 400
Medium: 500
Semi-bold: 600
Bold: 700
```

### Text Hierarchy
- **Page titles**: 22px, bold, primary color
- **Section headings**: 13px, bold, uppercase with 0.5px letter-spacing
- **Card labels**: 12px, medium, uppercase with 0.5px letter-spacing
- **Body text**: 13px, medium
- **Tertiary text**: 11-12px, secondary color

---

## Spacing & Sizing

### Border Radius
```css
--radius-sm: 6px      /* Small elements (buttons, badges) */
--radius: 10px        /* Cards, inputs */
--radius-lg: 14px     /* Large cards, modals */
```

### Shadows
```css
--shadow-sm: 0 1px 2px rgba(0,0,0,0.04)
--shadow: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)
--shadow-md: 0 4px 12px rgba(0,0,0,0.08)
--shadow-lg: 0 12px 40px rgba(0,0,0,0.12)
```

### Container Widths
- Max content width: **1360px**
- Login card: **380px**
- Modal: **960px** max width

---

## Component Patterns

### 1. Buttons

#### Primary Button
```css
padding: 7px 16px
background: var(--primary)
color: white
border-radius: var(--radius-sm)
font-size: 13px
font-weight: 600
transition: background 0.15s
```
**Hover**: `background: var(--primary-hover)`

#### Outline Button
```css
padding: 6px 14px
border: 1.5px solid var(--border)
color: var(--text-secondary)
border-radius: var(--radius-sm)
font-size: 13px
font-weight: 500
```
**Hover**: `border-color: var(--primary); color: var(--primary)`

#### Ghost Button
```css
padding: 6px 12px
background: transparent
color: var(--text-secondary)
border-radius: var(--radius-sm)
font-size: 13px
font-weight: 500
```
**Hover**: `background: var(--bg); color: var(--text)`

---

### 2. Input Fields

#### Text Input
```css
padding: 10px 14px
border: 1.5px solid var(--border)
border-radius: var(--radius)
font-size: 14px
transition: border 0.2s
```
**Focus**: `border-color: var(--primary)`

#### Search Input (with icon)
```css
padding: 8px 12px 8px 34px
border: 1.5px solid var(--border)
border-radius: var(--radius)
font-size: 13px
background: var(--surface) url(search-icon) 10px center no-repeat
min-width: 240px
```

#### Date Select
```css
padding: 8px 12px
border: 1.5px solid var(--border)
border-radius: var(--radius)
font-size: 13px
font-weight: 500
background: var(--surface)
min-width: 160px
cursor: pointer
```

---

### 3. Cards

#### Stat Card
```css
background: var(--surface)
border: 1px solid var(--border)
border-radius: var(--radius)
padding: 18px 20px
box-shadow: var(--shadow-sm)
```
**Structure**:
- Label: 12px, uppercase, 0.5px letter-spacing, tertiary color
- Value: 24px, bold, primary text
- Sub: 12px, secondary color

#### Login Card
```css
background: var(--surface)
border-radius: var(--radius-lg)
padding: 40px
width: 380px
box-shadow: var(--shadow-lg)
text-align: center
```

---

### 4. Table

#### Table Container
```css
background: var(--surface)
border: 1px solid var(--border)
border-radius: var(--radius-lg)
box-shadow: var(--shadow-sm)
overflow: hidden
```

#### Table Header
```css
background: var(--bg)
text-align: left
padding: 10px 16px
font-size: 11px
font-weight: 600
color: var(--text-tertiary)
text-transform: uppercase
letter-spacing: 0.5px
border-bottom: 1px solid var(--border)
```

#### Table Cells
```css
padding: 12px 16px
border-bottom: 1px solid var(--border-light)
font-size: 13px
```
**Row hover**: `background: #f5f7ff`

---

### 5. Badges & Chips

#### Model Badge (Primary)
```css
display: inline-flex
align-items: center
gap: 6px
padding: 3px 10px
background: var(--primary-light)
color: var(--primary)
border-radius: 20px
font-size: 12px
font-weight: 600
max-width: 200px
overflow: hidden
text-overflow: ellipsis
white-space: nowrap
```

#### API Key Badge (Warning)
```css
font-size: 12px
padding: 2px 8px
background: var(--warning-light)
color: #b45309
border-radius: 20px
font-weight: 500
```

#### Status Badges
- **Stop** (success): `background: var(--success-light); color: #059669`
- **Length** (warning): `background: var(--warning-light); color: #b45309`
- **Tool Calls** (info): `background: var(--info-light); color: var(--info)`

#### Tool Chip
```css
padding: 4px 10px
background: var(--bg)
border: 1px solid var(--border)
border-radius: 20px
font-size: 11px
font-weight: 500
color: var(--text-secondary)
```

---

### 6. Pagination

```css
display: flex
align-items: center
justify-content: center
gap: 6px
padding: 16px
```

#### Pagination Button
```css
min-width: 34px
height: 34px
border-radius: var(--radius-sm)
font-size: 13px
font-weight: 500
color: var(--text-secondary)
border: 1px solid var(--border)
background: var(--surface)
```
**Hover (not disabled)**: `border-color: var(--primary); color: var(--primary)`
**Disabled**: `opacity: 0.4; cursor: not-allowed`
**Active**: `background: var(--primary); color: white; border-color: var(--primary)`

---

### 7. Modal

#### Overlay
```css
position: fixed
inset: 0
background: rgba(15, 18, 30, 0.45)
z-index: 100
display: flex
align-items: flex-start
justify-content: center
padding: 40px 20px
overflow-y: auto
backdrop-filter: blur(2px)
```

#### Modal Content
```css
background: var(--surface)
border-radius: var(--radius-lg)
width: 100%
max-width: 960px
box-shadow: var(--shadow-lg)
animation: modalIn 0.2s ease
```

#### Modal Header
```css
display: flex
align-items: center
justify-content: space-between
padding: 20px 24px
border-bottom: 1px solid var(--border)
```

#### Modal Body
```css
padding: 24px
max-height: calc(100vh - 200px)
overflow-y: auto
```

---

### 8. Message Bubbles (Chat-style)

#### System Message
```css
background: #f0f2f5
border: 1px solid var(--border)
border-radius: var(--radius)
padding: 12px 16px
```

#### User Message
```css
background: var(--primary-light)
border: 1px solid #d4dbfc
border-radius: var(--radius)
padding: 12px 16px
```

#### Assistant Message
```css
background: var(--success-light)
border: 1px solid #bbf7d0
border-radius: var(--radius)
padding: 12px 16px
```

#### Tool/Reasoning Message
```css
background: var(--info-light)
border: 1px solid #c7d2fe
border-radius: var(--radius)
padding: 12px 16px
```

---

### 9. Tool Call Group

#### Container
```css
border: 1.5px solid #c7d2fe
border-radius: var(--radius)
overflow: hidden
background: var(--surface)
```

#### Header
```css
display: flex
align-items: center
gap: 8px
padding: 10px 14px
background: var(--info-light)
border-bottom: 1px solid #c7d2fe
```

#### Icon
```css
width: 22px
height: 22px
background: var(--info)
border-radius: 6px
display: flex
align-items: center
justify-content: center
color: white
font-size: 11px
font-weight: 700
```

#### Arguments/Response
```css
background: #f5f7fa
border: 1px solid var(--border)
border-radius: var(--radius-sm)
padding: 10px 12px
font-family: monospace
font-size: 11.5px
line-height: 1.5
white-space: pre-wrap
word-break: break-all
max-height: 250px
overflow: auto
```

**Success response**: `background: #f0fdf4; border: 1px solid #bbf7d0; color: #166534`
**Error response**: `background: #fef2f2; border: 1px solid #fecaca; color: #991b1b`

---

### 10. Loading & Empty States

#### Loading
```css
display: flex
flex-direction: column
align-items: center
justify-content: center
padding: 60px
color: var(--text-tertiary)
```

#### Spinner
```css
width: 28px
height: 28px
border: 3px solid var(--border)
border-top-color: var(--primary)
border-radius: 50%
animation: spin 0.7s linear infinite
```

#### Empty State
```css
text-align: center
padding: 60px 20px
color: var(--text-tertiary)
```

---

## Layout Patterns

### Topbar
```css
background: var(--surface)
border-bottom: 1px solid var(--border)
padding: 0 28px
height: 56px
display: flex
align-items: center
justify-content: space-between
position: sticky
top: 0
z-index: 50
```

### Main Content
```css
max-width: 1360px
margin: 0 auto
padding: 24px 28px
```

### Stats Row
```css
display: grid
grid-template-columns: repeat(4, 1fr)
gap: 16px
margin-bottom: 24px
```

### Toolbar
```css
display: flex
align-items: center
gap: 12px
margin-bottom: 20px
flex-wrap: wrap
```

---

## Responsive Breakpoints

```css
@media (max-width: 900px) {
  .stats-row { grid-template-columns: repeat(2, 1fr) }
  .detail-grid { grid-template-columns: 1fr }
  .cost-breakdown { grid-template-columns: 1fr }
  .search-input { min-width: 160px }
}

@media (max-width: 600px) {
  .stats-row { grid-template-columns: 1fr }
  .toolbar { flex-direction: column; align-items: stretch }
  .main-content { padding: 16px }
  .topbar { padding: 0 16px }
}
```

---

## Scrollbar Styling

```css
::-webkit-scrollbar { width: 6px; height: 6px }
::-webkit-scrollbar-track { background: transparent }
::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px }
::-webkit-scrollbar-thumb:hover { background: var(--text-tertiary) }
```

---

## Animations

### Modal In
```css
@keyframes modalIn {
  from { opacity: 0; transform: translateY(12px) }
  to { opacity: 1; transform: translateY(0) }
}
```

### Spinner
```css
@keyframes spin {
  to { transform: rotate(360deg) }
}
```

---

## TailwindCSS Configuration Reference

To replicate this design system in TailwindCSS, add these values to your `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        bg: '#f8f9fb',
        surface: '#ffffff',
        border: '#e2e6ed',
        'border-light': '#f0f2f5',
        text: {
          DEFAULT: '#1a1d26',
          secondary: '#5f6980',
          tertiary: '#8b95a9',
        },
        primary: {
          DEFAULT: '#4f6ef7',
          hover: '#3b5de7',
          light: '#eef1fe',
        },
        success: {
          DEFAULT: '#10b981',
          light: '#ecfdf5',
        },
        warning: {
          DEFAULT: '#f59e0b',
          light: '#fffbeb',
        },
        danger: {
          DEFAULT: '#ef4444',
          light: '#fef2f2',
        },
        info: {
          DEFAULT: '#6366f1',
          light: '#eef2ff',
        },
      },
      borderRadius: {
        sm: '6px',
        DEFAULT: '10px',
        lg: '14px',
      },
      boxShadow: {
        sm: '0 1px 2px rgba(0,0,0,0.04)',
        DEFAULT: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        md: '0 4px 12px rgba(0,0,0,0.08)',
        lg: '0 12px 40px rgba(0,0,0,0.12)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      fontSize: {
        xs: ['11px', { lineHeight: '16px' }],
        sm: ['12px', { lineHeight: '18px' }],
        base: ['13px', { lineHeight: '20px' }],
        lg: ['14px', { lineHeight: '22px' }],
        xl: ['16px', { lineHeight: '24px' }],
        '2xl': ['20px', { lineHeight: '28px' }],
        '3xl': ['22px', { lineHeight: '30px' }],
      },
      spacing: {
        '128': '32rem',
      },
    },
  },
}
```

---

## Key Design Principles

1. **Clean & Minimal**: Use ample whitespace and subtle borders
2. **Consistent Radius**: Use `10px` for cards, `6px` for small elements
3. **Subtle Shadows**: Keep shadows light and diffuse
4. **Clear Hierarchy**: Use color, size, and weight to establish hierarchy
5. **Semantic Colors**: Use color meaningfully (success, warning, danger, info)
6. **Hover States**: Always provide visual feedback on hover
7. **Focus States**: Use primary color for focus rings
8. **Responsive**: Grid-based layouts that stack on mobile
9. **Accessibility**: High contrast text, clear focus states, semantic HTML

---

## Common Patterns

### Detail Grid (2-column)
```css
display: grid
grid-template-columns: 1fr 1fr
gap: 16px
margin-bottom: 24px
```

### Detail Item
```css
display: flex
flex-direction: column
gap: 3px
```

### Badge with Label
```css
font-size: 11px
font-weight: 600
padding: 2px 8px
border-radius: 20px
```

### Section Heading
```css
font-size: 13px
font-weight: 700
color: var(--text)
margin-bottom: 12px
display: flex
align-items: center
gap: 8px
```

---

## Iconography

- Use SVG icons inline
- Size: 16-22px typical
- Color: inherit from text or use semantic colors
- Common icons: search (🔍), refresh (↻), close (×), settings (⚙️)

---

## Font Loading

```html
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"/>
```

---

## Summary

This dashboard uses a **clean, modern design** with:
- **Inter** font family for readability
- **Light color palette** with subtle borders
- **Consistent spacing** and border radius
- **Semantic colors** for status indication
- **Card-based layouts** with subtle shadows
- **Responsive grid** that adapts to screen size
- **Modal overlays** with backdrop blur
- **Chat-style message bubbles** for conversations
- **Tool call groups** for structured data display

Use these guidelines as a reference when implementing similar UI patterns in your React + TailwindCSS projects.

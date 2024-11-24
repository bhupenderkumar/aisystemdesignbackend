# AI System Design Frontend Components

This directory contains React components for displaying AI-generated system designs with HTML rendering capabilities.

## Components

### SystemDesignDisplay

A React component that renders HTML-based system design responses with proper sanitization and styling.

```typescript
import { SystemDesignDisplay } from '../components/SystemDesignDisplay';

// Usage
<SystemDesignDisplay 
  htmlContent={designHtml}
  isLoading={false}
/>
```

Props:
- `htmlContent` (string): HTML content to display
- `isLoading` (boolean, optional): Loading state flag

Features:
- HTML sanitization using DOMPurify
- Loading state spinner
- Empty state message
- Responsive design
- Dark mode support
- Semantic HTML structure

### SystemDesignContainer

A container component that manages API calls and state for system design generation.

```typescript
import { SystemDesignContainer } from '../containers/SystemDesignContainer';

// Usage
<SystemDesignContainer />
```

Features:
- API integration with backend
- User ID generation and persistence
- Error handling
- Loading states
- Responsive textarea for prompts
- Dark mode support

## Environment Variables

- `REACT_APP_API_BASE_URL`: Backend API base URL (default: http://localhost:3001)

## Dependencies

- `dompurify`: HTML sanitization
- `uuid`: User ID generation

## Development

1. Install dependencies:
```bash
npm install
```

2. Set environment variables:
```bash
REACT_APP_API_BASE_URL=http://localhost:3001
```

3. Start development server:
```bash
npm start
```

## API Integration

The components expect the backend to provide HTML responses in the following format:

```html
<div class="system-design">
    <h1 class="design-title">System Design: [Title]</h1>
    <section class="overview">
        <!-- Overview content -->
    </section>
    <section class="components">
        <!-- Components content -->
    </section>
    <section class="data-flow">
        <!-- Data flow content -->
    </section>
    <section class="technical-specs">
        <!-- Technical specifications content -->
    </section>
</div>
```

## Styling

The components come with built-in CSS that provides:
- Responsive design
- Dark mode support
- Loading animations
- Clean typography
- Consistent spacing
- Modern UI elements

## Security

- All HTML content is sanitized using DOMPurify
- Limited set of allowed HTML tags and attributes
- User IDs are stored securely in local storage

## Contributing

1. Follow the existing code style
2. Add appropriate TypeScript types
3. Include proper error handling
4. Test thoroughly before submitting PRs

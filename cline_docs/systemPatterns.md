# System Patterns

## Architecture Overview
The project follows a simple, modular front-end architecture:

### Core Components
1. HTML Structure (index.html)
   - Semantic HTML5 elements
   - ARIA attributes for accessibility
   - Modular section organization

2. JavaScript Logic (script.js)
   - Event-driven architecture
   - State management using DOM attributes
   - Local storage for persistence
   - Speech synthesis for audio feedback

3. CSS Styling (style.css)
   - Mobile-first responsive design
   - CSS Grid for layout
   - CSS Custom Properties potential
   - Progressive enhancement

## Key Technical Decisions

### Accessibility First
- ARIA attributes throughout
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode
- Font size controls
- Touch-friendly targets
- Hidden numbers with progressive reveal
- Color differentiation for cognitive support

### State Management
- Button states tracked via aria-pressed
- Initial state starts with hidden numbers
- Color-based row organization (11-20 green, 1-10 red)
- Preferences saved to localStorage
- DOM as source of truth
- Real-time state and number announcements

### Performance Considerations
- CSS transitions for smooth interactions
- Efficient event delegation
- Optimized touch interactions
- Print stylesheet included

### Browser Compatibility
- Modern CSS features with fallbacks
- Cross-browser event handling
- Responsive images and layouts
- Progressive enhancement approach

## Design Patterns
1. Event Delegation
   - Centralized event handling
   - Efficient DOM manipulation

2. Progressive Enhancement
   - Core functionality without JS
   - Enhanced features when available

3. Responsive Design
   - Mobile-first approach
   - Two-row grid layout
   - Color-coded number organization
   - Adaptive typography

4. Accessibility Patterns
   - ARIA landmarks
   - Skip links (potential addition)
   - Focus management
   - State announcements

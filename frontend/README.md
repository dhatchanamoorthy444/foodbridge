# FoodBridge Frontend

A Smart Food Expiry Monitoring and Surplus Redistribution System

## Overview

FoodBridge is a comprehensive food waste reduction platform that connects food donors with recipients, ensuring surplus food is redirected to those who need it most. The frontend is built with React 18, TypeScript, and Tailwind CSS, featuring real-time updates, 3D visualizations, and a responsive design.

## Features

### Core Application
- **Role-Based Access**: Separate interfaces for Donors, Recipients, Volunteers, and Admins
- **Real-Time Updates**: Live notifications and status changes
- **3D Food Visualization**: Interactive 3D food items and animations
- **Smart Matching**: AI-powered recipient matching with weighted scoring
- **Expiry Monitoring**: Automated alerts for expiring food items
- **Pickup Management**: Schedule, confirm, and track food pickups
- **Analytics Dashboard**: Live KPIs, trends, and export functionality
- **Responsive Design**: Mobile-first approach with adaptive layouts

### UI Components
- **StatCard**: KPI display cards with change indicators
- **EmptyState**: Placeholder states with actions
- **LoadingSpinner**: Various loading indicators
- **Toast**: Notification system
- **Modal**: Modal dialogs
- **Card**: Glass-morphism card components
- **Button**: Various button styles
- **Badge**: Status and category badges
- **Input/Select/Textarea**: Form controls

### Animations & Effects
- **Framer Motion**: Smooth transitions and animations
- **Three.js**: 3D food items and particles
- **CSS Animations**: Glow effects and micro-interactions
- **Hover States**: Interactive feedback
- **Micro-interactions**: Button presses, menu openings

### Data Management
- **Zustand**: State management with persistence
- **React Query**: Server state management
- **Zod**: Form validation schemas
- **date-fns**: Date formatting and manipulation
- **clsx/tailwind-merge**: Class name utilities

### Developer Experience
- **TypeScript**: Full type coverage
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Vitest**: Testing framework
- **React Testing Library**: Component testing

## Technology Stack

### Frontend
- **React 18** with **TypeScript**
- **Vite** for fast development
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Three.js + @react-three/fiber** for 3D visualizations
- **Lucide React** for icons
- **Recharts** for data visualization
- **Zustand** for state management
- **React Query** for data fetching
- **Zod** for validation

### Development Tools
- **ESLint** with custom rules
- **Prettier** for code formatting
- **Vite** plugin for React
- **Vitest** for testing
- **React Testing Library** for component testing
- **JS DOM** for testing environment

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── layout/           # Navbar, Sidebar
│   │   ├── ui/               # Component library
│   │   └── animations/       # Three.js scenes
│   ├── pages/               # 8 application pages
│   │   ├── Dashboard.tsx
│   │   ├── Inventory.tsx
│   │   ├── Matching.tsx
│   │   ├── Pickups.tsx
│   │   ├── Analytics.tsx
│   │   ├── Settings.tsx
│   │   ├── LandingPage.tsx
│   │   └── Login.tsx
│   ├── store/               # State management
│   ├── lib/                 # Utilities and validation
│   │   ├── utils.ts
│   │   └── validations.ts
│   ├── styles/              # Global styles
│   └── App.tsx
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── postcss.config.js
```

## Running the Application

### Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Testing
```bash
# Run tests
npm test

# Run linting
npm run lint
```

## Deployment

### Production Build
```bash
npm run build
npm run preview
```

### Environment Variables
Create a `.env` file in the frontend directory:
```bash
VITE_ENV=production
```

## Key Features

### Dashboard
- **KPI Widgets**: Real-time statistics with trend indicators
- **Expiry Alerts**: Items approaching expiration
- **Quick Stats**: Summary of operations
- **Recent Activity**: Latest transactions

### Inventory Management
- **Add/Edit/Delete**: Food item operations
- **Category Filter**: Browse by food type
- **Expiry Date**: Automatic status updates
- **Storage Requirements**: Proper categorization

### Smart Matching
- **AI Algorithm**: Weighted scoring (40% category, 25% quantity, 20% pickup, 15% storage)
- **Compatibility Check**: Storage and pickup feasibility
- **Real-time Updates**: Instant match notifications
- **Explanation**: Transparent matching logic

### Pickup System
- **Scheduling**: Easy pickup booking
- **Confirmation**: SMS/email confirmations
- **Tracking**: Real-time status updates
- **Verification**: Pickup code verification

### Analytics
- **Dashboard**: Live performance metrics
- **Trends**: Historical data analysis
- **Export**: CSV report generation
- **Category Breakdown**: Food type distribution

### 3D Visualization
- **Interactive Food Items**: 3D models with hover effects
- **Particle System**: Floating food particles
- **Lighting Effects**: Dynamic shadows and highlights
- **Responsive Design**: Adapts to screen size

## Accessibility

- **ARIA Support**: Screen reader compatibility
- **Keyboard Navigation**: Full keyboard support
- **Reduced Motion**: Prefers-reduced-motion support
- **Color Contrast**: WCAG compliant
- **Focus Management**: Proper focus indicators

## Performance

- **Code Splitting**: Lazy loading for better performance
- **Bundle Optimization**: Tree shaking
- **Image Optimization**: Responsive images
- **Caching**: Service worker support
- **Lazy Loading**: Component-level lazy loading

## Security

- **Authentication**: JWT-based auth with role-based access
- **Input Validation**: Zod schema validation
- **CSRF Protection**: Cross-site request forgery prevention
- **Rate Limiting**: Request throttling
- **HTTPS**: Secure communication

## Future Enhancements

1. **Mobile App**: Native iOS and Android applications
2. **WebSocket Integration**: Real-time bidirectional communication
3. **Advanced Analytics**: Machine learning for prediction
4. **Social Features**: Community engagement and sharing
5. **Integration**: Third-party service integrations
6. **Advanced 3D**: More complex food visualizations
7. **AR/VR**: Augmented and virtual reality experiences

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Commit and push
6. Create a pull request

## License

This project is licensed under the MIT License.

---

## Contact

For questions, issues, or feedback:
- GitHub Issues
- GitHub Discussions
- Project Documentation

FoodBridge - Reducing food waste, one meal at a time! 🍎✨
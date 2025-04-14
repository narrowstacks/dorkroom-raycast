# System Architecture

## System Overview

Film Tools is built as a Raycast extension, providing quick access to film photography tools and information through the Raycast launcher interface.

## Component Breakdown

1. Core Components

   - Film Search View
   - Dilution Calculator
   - Development Recipe Manager

2. Data Layer

   - Film database
   - Developer chemical database
   - User recipes storage
   - FilmDev.org integration

3. Utility Components
   - Temperature conversion
   - Volume unit conversion
   - Dilution ratio calculations

## Design Patterns

- View-based architecture (Raycast extension pattern)
- Command pattern for different tools
- Preference-based configuration
- Data persistence for recipes
- Search and fuzzy matching using Fuse.js

## Data Flow

1. User Input Flow

   - Command selection via Raycast
   - Tool-specific input handling
   - Data processing and calculation
   - Result display

2. Recipe Management Flow
   - Local storage for user recipes
   - Import from FilmDev.org
   - CRUD operations for recipes

## Integration Points

- Raycast API (@raycast/api)
- FilmDev.org API integration
- Local storage for user preferences and recipes

## Architectural Decisions

- Built as Raycast extension for quick access
- TypeScript for type safety and developer experience
- Fuse.js for powerful search capabilities
- Got for HTTP requests
- Local storage for user data persistence

## Non-Functional Requirements

- Performance

  - Quick command response time
  - Efficient search operations
  - Smooth UI transitions

- Reliability

  - Accurate calculations
  - Consistent data storage
  - Error handling for network operations

- Maintainability
  - TypeScript for code clarity
  - ESLint for code quality
  - Prettier for consistent formatting

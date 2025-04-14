# Technology Landscape

## Technology Stack

- **Runtime Environment**: Node.js
- **Primary Language**: TypeScript
- **Framework**: Raycast Extension API
- **UI Framework**: Raycast Components
- **Search Engine**: Fuse.js
- **HTTP Client**: Got
- **Development Tools**:
  - ESLint
  - Prettier
  - TypeScript Compiler

## Development Environment

- **Package Manager**: npm
- **Build Tool**: ray (Raycast CLI)
- **Version Control**: Git
- **IDE Support**: VSCode
- **Type Definitions**:
  - @types/node
  - @types/react
  - @types/got
  - raycast-env.d.ts

## Dependencies

### Production Dependencies

- @raycast/api: ^1.93.2
- @raycast/utils: ^1.17.0
- @types/got: ^9.6.12
- fuse.js: ^7.1.0
- got: ^14.4.6

### Development Dependencies

- @raycast/eslint-config: ^1.0.11
- @types/node: 20.8.10
- @types/react: 18.3.3
- eslint: ^8.57.0
- prettier: ^3.3.3
- typescript: ^5.4.5

## Build & Deployment

### Scripts

- `ray build`: Build the extension
- `ray develop`: Development mode
- `ray lint`: Run linter
- `ray lint --fix`: Auto-fix linting issues
- `npm run publish`: Publish to Raycast Store

### Environment Configuration

#### Temperature Units

- Celsius (°C)
- Fahrenheit (°F)

#### Volume Units

- Milliliters (ml)
- Fluid Ounces (fl oz)

#### Dilution Notation

- Plus (+)
- Colon (:)

## Tool Chain

### Development Tools

- VSCode for editing
- ESLint for code quality
- Prettier for formatting
- TypeScript for type checking
- Git for version control

### Testing Tools

- Raycast extension testing tools
- Local development preview

### Monitoring

- Raycast extension analytics
- Error reporting through Raycast

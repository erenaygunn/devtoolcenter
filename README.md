[devtool.center](https://www.devtool.center/)
# DevTool Center Frontend

A modern Nuxt 4 + TailwindCSS application for browsing, filtering, and submitting developer tools. Features an intuitive interface for discovering development resources and includes an admin panel for content moderation.

## Quick Start

```bash
# Clone the frontend repo
git clone https://github.com/erenaygunn/devtoolcenter.git
cd devtoolcenter

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server (backend must be running first!)
npm run dev
```

## Backend Dependency

⚠️ **Important**: This frontend requires the backend repository (`devtoolcenter-backend`) to be running.

### Backend Setup

1. **Clone the backend repository**:

   ```bash
   git clone https://github.com/erenaygunn/devtoolcenter-backend.git
   cd devtoolcenter-backend
   ```

2. **Set up the backend**:

   ```bash
   npm install
   cp .env.example .env
   npm run dev
   ```

3. **Verify backend is running**: The backend should be accessible at `http://localhost:5050/api/v1`

**Backend Repository**: [devtoolcenter-backend](https://github.com/erenaygunn/devtoolcenter-backend)

## Environment Variables

Create a `.env` file in the root directory:

```bash
NUXT_PUBLIC_API_BASE=http://localhost:5050/api/v1
```

## Features

- **Browse and Search Tools**: Discover developer tools with powerful search functionality
- **Advanced Filters**: Filter by category, price range, and keywords
- **Submit New Tools**: Submit tools with built-in validation and form handling
- **Admin Panel**: Review submissions and manage tools with moderation capabilities

## Project Structure

```
frontend/
├── pages/           # Application routes (file-based routing)
├── components/      # Reusable UI components
├── layouts/         # Shared page layouts
├── composables/     # State management and utility functions
├── assets/          # Static assets and styles
└── public/          # Public files
```

## Development

```bash
# Install dependencies
npm install

# Start development server (ensure backend is running first)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

## Deployment

1. **Build the application**:

   ```bash
   npm run build
   ```

2. **Preview the build locally**:

   ```bash
   npm run preview
   ```

3. **Production Environment**:

   - Set `NUXT_PUBLIC_API_BASE` to your production backend URL
   - Ensure your backend is deployed and accessible

4. **Deploy** to your preferred hosting platform (Vercel, Netlify, etc.)

## Tech Stack

- **Nuxt 4**: Vue.js framework with server-side rendering
- **TailwindCSS**: Utility-first CSS framework
- **TypeScript**: Type-safe development
- **Vue 3**: Progressive JavaScript framework

## License

MIT License - see LICENSE file for details.

# Contributing to DevTool Center Frontend

Thank you for your interest in contributing! This guide will help you get started with development and submitting contributions.

## Setup Guide

### Prerequisites

- Node.js (v18+)
- npm or yarn
- The DevTool Center backend repository running locally

### Step-by-Step Setup

1. **Fork the repository** on GitHub

2. **Clone your fork**:

   ```bash
   git clone https://github.com/erenaygunn/devtoolcenter.git
   cd devtoolcenter
   ```

3. **Install dependencies**:

   ```bash
   npm install
   ```

4. **Set up environment**:

   ```bash
   cp .env.example .env
   ```

5. **Start the backend first** (required):

   ```bash
   # In a separate terminal/directory
   git clone https://github.com/erenaygunn/devtoolcenter-backend.git
   cd devtoolcenter-backend
   npm install
   cp .env.example .env
   npm run dev
   ```

6. **Start frontend development**:
   ```bash
   # Back in the frontend directory
   npm run dev
   ```

## Branching Model

- **main**: Stable production branch
- **dev**: Active development branch
- **feature/[feature-name]**: New features
- **fix/[issue-description]**: Bug fixes

### Workflow:

```bash
# Create feature branch from dev
git checkout dev
git pull origin dev
git checkout -b feature/your-feature-name

# Make changes, commit, and push
git add .
git commit -m "feat: add new feature"
git push origin feature/your-feature-name
```

## Code Style

### Conventions:

- Follow **Nuxt 4** and **TailwindCSS** best practices
- Use **TypeScript** for type safety
- Follow **Vue 3 Composition API** patterns
- Use **kebab-case** for component files and **PascalCase** for component names

### Linting:

```bash
# Run linter before committing
npm run lint

# Auto-fix linting issues
npm run lint:fix
```

### Commit Messages:

Use **conventional commit** format:

- `feat:` new features
- `fix:` bug fixes
- `docs:` documentation changes
- `style:` formatting changes
- `refactor:` code restructuring
- `test:` adding tests
- `chore:` maintenance tasks

**Example**: `feat: add search filter component`

## Pull Requests

1. **Target the `dev` branch** for all PRs
2. **Keep PRs small and focused** - one feature/fix per PR
3. **Write descriptive titles and descriptions**
4. **Link related issues** using `Closes #123` or `Fixes #123`
5. **Ensure backend is running** during development and testing
6. **Test thoroughly** before submitting

### PR Checklist:

- [ ] Backend is running and accessible
- [ ] Frontend builds without errors
- [ ] Linting passes (`npm run lint`)
- [ ] Changes are tested locally
- [ ] No console errors in browser
- [ ] Responsive design verified
- [ ] Related issues are linked

## Contributor Guidelines

- **Be respectful and constructive** in all interactions
- **Keep changes scoped** - avoid unrelated modifications in the same PR
- **Test with backend running** - ensure API integrations work
- **Ask questions** if you're unsure about implementation approaches
- **Follow existing patterns** in the codebase
- **Write clear commit messages** and PR descriptions

## Development Tips

- **Always start backend first** before frontend development
- Use Vue DevTools for debugging components
- Leverage Nuxt DevTools for development insights
- Test API endpoints in browser network tab
- Ensure responsive design across devices
- Handle loading states and error cases
- Validate forms and handle edge cases

## Getting Help

- Check existing [issues](https://github.com/YOUR_NAME/devtoolcenter-frontend/issues)
- Create a new issue for bugs or feature requests
- Join discussions in pull requests
- Review the codebase to understand patterns
- Ensure both frontend and backend repos are up to date

## Common Issues

- **API errors**: Verify backend is running at `http://localhost:5050`
- **CORS issues**: Check backend CORS configuration
- **Build failures**: Run `npm run lint` and fix any issues

Thank you for contributing to DevTool Center! 🚀

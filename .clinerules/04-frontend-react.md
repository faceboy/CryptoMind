# Frontend ReactJS Rules

## Structure and Coding
- Use Create React App or Vite for setup; organize with `src/components/`, `src/pages/`, `src/services/` for API calls.
- Fetch data from backend via Axios or Fetch; use env vars for API base URL (e.g., `REACT_APP_API_URL=http://backend:8000`).
- Implement state management with Redux or Context API for complex apps.

## Integration
- Proxy requests to backend in dev (add `"proxy": "http://backend:8000"` in `package.json`).
- Build for production: Use `npm run build` and serve static files via Nginx.

## Best Practices
- Follow React hooks best practices: Use functional components, memoization for performance.
- Ensure responsive design and accessibility (ARIA attributes).
- Test with Jest/React Testing Library.
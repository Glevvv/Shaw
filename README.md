# Shaw Brothers Action Catalog (Render Fix)

**Fix:** Avoid JS parameter destructuring in template strings that got mangled during generation.
This version uses `args` objects, then reads `args.id`, etc.

## Render Settings
- Build command: `npm install`
- Start command: `npm start`
- Port: use `PORT` from environment (handled in code)

# Type Check

Run TypeScript type checking across both backend and frontend without emitting files.

**Backend:**
```bash
cd d:\MikTik\MikTik-Backend && npx tsc --noEmit
```

**Frontend:**
```bash
cd d:\MikTik\MikTik-Frontend && npx tsc -b --noEmit
```

Report any errors found. Do not auto-fix TypeScript errors unless asked.

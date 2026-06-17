# Add API Route

Add a new Express route to the backend. Follow this pattern:

1. Create the route file in `MikTik-Backend/src/routes/<name>.ts`:

```typescript
const express = require('express');
const router = express.Router();

router.get('/', (req: any, res: any) => {
  res.json({ message: 'TODO: implement' });
});

module.exports = router;
```

2. Register it in `MikTik-Backend/src/index.ts`:

```typescript
const <name>Routes = require('./routes/<name>');
app.use('/api/<name>', <name>Routes);
```

Ask the user for: route name, HTTP methods needed, and what data it should handle.

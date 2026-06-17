# Add Mongoose Model

Add a new Mongoose model to the backend.

1. Create the model in `MikTik-Backend/src/models/<Name>.ts`:

```typescript
const mongoose = require('mongoose');

const <Name>Schema = new mongoose.Schema(
  {
    // define fields here
  },
  { timestamps: true }
);

const <Name> = mongoose.model('<Name>', <Name>Schema);

module.exports = <Name>;
```

2. Import it in the relevant route file:

```typescript
const <Name> = require('../models/<Name>');
```

Ask the user for: model name and the fields/schema they want.

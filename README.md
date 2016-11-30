## @chasidic/scraper

```typescript
import { Scraper } from '@chasidic/scraper';

!async function () {
    let scraper = new Scraper({ cache: '/tmp/cache/' });
    let tree = await scraper.tree('http://example.com');
    console.log(tree);
} ();
```
## @chasidic/scraper

```typescript
import { Scraper } from './Scraper';

let scraper = new Scraper({ cacheDir: '/tmp/cache/' });

let item = scraper.create('http://example.com');

!async function () {

    let tree = await item.tree();
    console.log(tree);

} ();
```
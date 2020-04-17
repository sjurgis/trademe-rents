## Scrape and analyse trademe listings

A bit rural at the moment - will only analyse changes between last two scrapes.

Usage:
```
npm i
npm run scrape
npm run analyse
```

You'll end up with two files - JSON and a CSV for each scrape. Analyse will reveal listing Id's where prices has changed, for example:

```
[ { ListingId: 2595466627, delta: -400 },
  { ListingId: 2598011832, delta: 100 },
  { ListingId: 2597674971, delta: -50 } ]
```
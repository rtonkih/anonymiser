# Customer anonimiser

Tool anonimise customer entries by coping and anonimising sensitive customer data into new customer anomimised collection.

### There are three modes

1. Listen and anonimise - wait for new 1000 hits or 1000ms and then pull and anonimise changes
2. Full re indexing - scan and anonimise all customers entries from scratch
3. Generating fake 1-10 customers every 200ms for dev and test purposes

### How to start

```
1. npm isntall
2. cp .env.temp .env
3. modify `DB_URI` in .env
```

### Usage - 3 modes

```
1. npm run sync
2. npm run reindex
3. npm run app
```

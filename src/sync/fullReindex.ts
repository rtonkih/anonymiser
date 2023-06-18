import { customersCollection } from '../init/db';
import { anonimiseAndInsert } from './watchAndSync';

export const fullReindex = async () => {
  try {
    let offset = 0;
    const batchSize = 1000;

    async function processBatching() {
      const toBeSync = await customersCollection.find().skip(offset).limit(batchSize).toArray();

      if (toBeSync.length > 0) {
        await anonimiseAndInsert(toBeSync);
        offset += batchSize;

        await processBatching();
      }
    }

    await processBatching();
  } catch (e: unknown) {
    let message = 'Unknown Error';
    if (e instanceof Error) message = e.message;
    console.error('Failed during full re indexing', message);
  }
};

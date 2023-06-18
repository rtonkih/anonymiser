import { Document, ObjectId } from 'mongodb';
import { customersAnonymisedCollection, customersCollection } from '../init/db';
import { anonymizeEntry } from '../helpers';

export const anonimiseAndInsert = async (toBeSync: Document) => {
  try {
    const anonymizedDocuments = toBeSync.map((document: Document) => {
      return {
        replaceOne: {
          filter: { _id: document._id },
          replacement: anonymizeEntry(document),
          upsert: true,
        },
      };
    });

    if (anonymizedDocuments.length > 0) {
      await customersAnonymisedCollection.bulkWrite(anonymizedDocuments);
      console.info(`Anonimised and inserted ${toBeSync.length} entries`);
    }
  } catch (e: unknown) {
    let message = 'Unknown Error';
    if (e instanceof Error) message = e.message;
    console.error('Failed during anonimization', message);
  }
};

const markAsSync = async (toBeSync: Document[]) => {
  try {
    const idsToBeSync = toBeSync.map((doc: Document) => new ObjectId(doc._id.toString()));
    const filter = { _id: { $in: idsToBeSync } };
    await customersCollection.updateMany(filter, { $set: { isSync: true } });
  } catch (e: unknown) {
    let message = 'Unknown Error';
    if (e instanceof Error) message = e.message;
    console.error('Failed during marking as syncronized', message);
  }
};

export const watchAndSync = async () => {
  let buffer: Document[] = [];
  let countMS = 0;

  let batchingSize = 1000;
  let syncInterval = 1000; // ms
  const pollingInterval = 100; // ms

  const intervalId = setInterval(async () => {
    const toBeSync = await customersCollection.find({ isSync: false }).limit(1000).toArray();
    buffer.push(...toBeSync);

    // either 1000 hits or every 1000ms
    if (buffer.length >= batchingSize || (countMS === syncInterval && buffer.length > 0)) {
      await anonimiseAndInsert(buffer);
      await markAsSync(buffer);

      buffer = [];
      countMS = 0;
    }

    countMS += pollingInterval;
  }, pollingInterval);

  process.on('SIGINT', () => {
    console.info('Received SIGINT signal. Gracefully shutting down...');
    clearInterval(intervalId);
    process.exit(0);
  });
};

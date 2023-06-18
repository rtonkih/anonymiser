import { connectDb } from './init/db';
import { fullReindex } from './sync/fullReindex';
import { watchAndSync } from './sync/watchAndSync';

export const startSyncApp = async (): Promise<void> => {
  const args = process.argv.slice(2);
  const flag = args[0];
  const FULL_REINDEX_MODE = '--full-reindex';

  await connectDb();

  switch (flag) {
    case FULL_REINDEX_MODE:
      await fullReindex();
      process.exit(0);
    default:
      await watchAndSync();
  }
};

startSyncApp().then(() => console.info('Sync App started'));

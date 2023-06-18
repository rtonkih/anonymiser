import { connectDb } from './init/db';
import { Customer } from './modules/customers/customers';

export const startApp = async (): Promise<void> => {
  await connectDb();

  const customerInstance = new Customer();
  const generateInterval = 200;

  const intervalId = setInterval(customerInstance.generateAndSaveCusomers, generateInterval);

  process.on('SIGINT', () => {
    console.info('Received SIGINT signal. Gracefully shutting down...');
    clearInterval(intervalId);
    process.exit(0);
  });
};

startApp().then(() => console.info('App started'));

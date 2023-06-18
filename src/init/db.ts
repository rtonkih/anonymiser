import { MongoClient } from 'mongodb';
require('dotenv').config();

const uri = process.env.DB_URI as string;

if (!uri) throw Error('env variable is not initialized');

const client = new MongoClient(uri);

export const connectDb = async (): Promise<void> => {
  try {
    await client.connect();
    console.info('connected to DB');
  } catch (e: unknown) {
    let message = 'Unknown Error';
    if (e instanceof Error) message = e.message;
    console.error('Failed during connecting to db', message);
  }
};

export const closeDb = async (): Promise<void> => {
  try {
    await client.close();
    console.info('disconencted from DB');
  } catch (e: unknown) {
    let message = 'Unknown Error';
    if (e instanceof Error) message = e.message;
    console.error('Failed during dicsconnecting from db', message);
  }
};

const db = client.db('store');
const customersCollection = db.collection('customers');
const customersAnonymisedCollection = db.collection('customers_anonymised');

export { client, db, customersCollection, customersAnonymisedCollection };

import crypto from 'crypto';
import { Document } from 'mongodb';

export const generateRandomString = (input: string, length: number): string => {
  const hash = crypto.createHash('sha256').update(input).digest('hex');
  const filteredHash = hash.replace(/[^a-zA-Z\d]/g, '');

  return filteredHash.substring(0, length);
};

export const anonymizeEntry = (document: Document) => {
  const firstName = generateRandomString(document.firstName, 8);
  const lastName = generateRandomString(document.lastName, 8);
  const email = document.email.replace(/[^@]+/, generateRandomString(document.email, 8));
  const line1 = generateRandomString(document.address.line1, 8);
  const line2 = generateRandomString(document.address.line2, 8);
  const postcode = generateRandomString(document.address.postcode, 8);

  return {
    ...document,
    firstName,
    lastName,
    email,
    address: {
      ...document.address,
      line1,
      line2,
      postcode,
    },
    isSync: true,
  };
};

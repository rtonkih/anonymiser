import { faker } from '@faker-js/faker';
import { CustomerType } from './types';
import { customersCollection } from '../../init/db';

export class Customer {
  constructor() {
    this.generateAndSaveCusomers = this.generateAndSaveCusomers.bind(this);
  }

  public async generateAndSaveCusomers(): Promise<void> {
    try {
      const customers = await this.generateCustomers();

      await customersCollection.insertMany(customers);

      console.info(`${customers.length} generated and saved`);
    } catch (e: unknown) {
      let message = 'Unknown Error';
      if (e instanceof Error) message = e.message;
      console.error('Failed while generating customers', message);
    }
  }

  private generateCustomer(): CustomerType {
    return {
      firstName: faker.internet.userName(),
      lastName: faker.internet.userName(),
      email: faker.internet.email(),
      address: {
        line1: faker.location.streetAddress(),
        line2: faker.location.secondaryAddress(),
        postcode: faker.location.zipCode(),
        city: faker.location.city(),
        state: faker.location.state(),
        country: faker.location.country(),
      },
      isSync: false,
      createdAt: faker.date.anytime(),
    };
  }

  private async generateCustomers(): Promise<CustomerType[]> {
    const randomNum = Math.floor(Math.random() * 10) + 1;

    return faker.helpers.multiple(this.generateCustomer, {
      count: randomNum,
    });
  }
}

export type CustomerType = {
  firstName: string;
  lastName: string;
  email: string;
  address: CustomerAddress;
  createdAt: Date;
  isSync: boolean;
};

export type CustomerAddress = {
  line1: string;
  line2?: string;
  postcode: string;
  city: string;
  state: string;
  country: string;
};

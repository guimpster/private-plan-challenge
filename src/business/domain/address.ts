export class Address {
  city: string;
  postalCode: string;
  street: string;
  state: string;

  constructor(partial: Partial<Address>) {
    Object.assign(this, partial);
  }
}
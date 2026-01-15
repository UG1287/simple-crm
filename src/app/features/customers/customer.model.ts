export class Customer {
  firstName = '';
  lastName = '';
  email = '';
  birthDate: Date | null = null;

  // Adresse
  street = '';
  zipCode = '';
  city = '';

  constructor(json?: Partial<Customer>) {
    if (!json) return;
    Object.assign(this, json);

    if (typeof (json as any).birthDate === 'string') {
      this.birthDate = new Date((json as any).birthDate);
    }
  }
}

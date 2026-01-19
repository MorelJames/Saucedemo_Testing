function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

export const env = {
  username: requiredEnv('USERNAME'),
  password: requiredEnv('PASSWORD'),
  checkout_first_name: requiredEnv('CHECKOUT_FIRST_NAME'),
  checkout_last_name: requiredEnv('CHECKOUT_LAST_NAME'),
  checkout_postal_CODE: requiredEnv('CHECKOUT_POSTAL_CODE'),

  products: (process.env.PRODUCTS ?? '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean),
};
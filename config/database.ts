import path from 'path';

export const DATABASE_PATH = process.env.NODE_ENV === 'production'
  ? path.join(process.env.DATA_PATH || '/tmp', 'btc-eur.db')
  : path.join(process.cwd(), 'btc-eur.db'); 
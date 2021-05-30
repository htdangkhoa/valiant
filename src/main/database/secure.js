import { randomBytes, createCipheriv, createDecipheriv } from 'crypto';

const key = Buffer.from(process.env.STORAGE_SECRET);

export const encrypt = (data) => {
  let s = data;

  if (typeof s !== 'string') {
    s = JSON.stringify(data);
  }

  const iv = randomBytes(16);

  const cipher = createCipheriv('aes-256-cbc', key, iv);

  let payload = cipher.update(s);

  payload = Buffer.concat([payload, cipher.final()]);

  return iv.toString('hex') + payload.toString('hex');
};

export const decrypt = (data) => {
  try {
    const iv = Buffer.from(`${data}`.substring(0, 32), 'hex');

    const payload = Buffer.from(`${data}`.substring(32), 'hex');

    const decipher = createDecipheriv('aes-256-cbc', key, iv);

    let origin = decipher.update(payload);

    origin = Buffer.concat([origin, decipher.final()]);

    return origin.toString();
  } catch (error) {
    return null;
  }
};

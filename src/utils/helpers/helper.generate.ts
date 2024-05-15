import slugify from 'slugify';
import { v4 as uuidv4 } from 'uuid';

//to generate 16 digit uuid
export const uuidGenerate = async (): Promise<string> => {
  // Generate a UUID without hyphens
  // const uuidWithoutHyphens = uuidv4().replace(/-/g, '');
  const uuid = uuidv4();
  return uuid;
};

//generate otp code
export const generateOTP = (length: number): number => {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;

  // Generate a random number within the specified range
  const otp = Math.floor(Math.random() * (max - min + 1)) + min;

  return otp;
};

//update slug
export const updateSlug = async (
  name: string,
  additional?: boolean,
): Promise<string> => {
  let slug = '';

  if (additional) {
    const uniqueString = await uuidGenerate();
    slug = slugify(`${name}-${uniqueString.substring(0, 7)}`).toLowerCase();
  } else {
    slug = slugify(name).toLowerCase().trim();
  }
  return slug;
};

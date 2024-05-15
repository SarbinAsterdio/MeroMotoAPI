import { IsUUID } from 'class-validator';
export class ValidateUUIDDto {
  @IsUUID('4', { message: 'Invalid ID format' })
  id: string;
}

export function isUuidV4(value: string) {
  const uuidv4Regex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidv4Regex.test(value);
}

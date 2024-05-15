//to create a vehicle name
export const vehicleName = async (
  brand: string,
  model: string,
): Promise<string> => {
  const vehicleName = `${brand} ${model}`;
  return vehicleName;
};

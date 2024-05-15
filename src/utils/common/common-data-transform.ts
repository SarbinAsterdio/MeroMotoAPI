//transform string to number for decimal values (postgres tends to change number to string for decimal values)
export class ColumnNumberTransformer {
  to(data: number): number {
    if (data !== null && data % 1 === 0) return parseFloat(data.toFixed(1));
    else return data;
  }
  from(data: string | number): number {
    if (typeof data === 'number') {
      return data;
    } else if (typeof data === 'string') {
      return parseFloat(data);
    } else {
      return null;
    }
  }
}

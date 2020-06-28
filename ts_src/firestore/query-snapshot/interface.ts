export default interface IQuerySnapshot {
  readonly docs: Record<string, unknown>[];
  readonly empty: boolean;
  readonly size: number;
  forEach(callback: (result: Record<string, unknown>) => void): void;
}

export interface RecordModel {
  id?: number;
  title: string;
  text: string;
  image?: string;
  url?: string;
  active?: number;
  sort_order?: number;
}

export type RecordWithId = RecordModel & { id: number };
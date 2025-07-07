export default interface CareTasksType {
  id: number;
  schedule_id: number;
  due_at: string;
  completed_at: string | null;
  created_at: string;
}

export default interface CareScheduleType {
  id: number;
  plant_id: number;
  task_type: string;
  interval_days: number;
  next_due: string;
  created_at: string;
}

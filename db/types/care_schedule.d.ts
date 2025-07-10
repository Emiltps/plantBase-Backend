type TaskType = "water" | "fertilise" | "prune" | "other";

export default interface CareScheduleType {
  care_schedule_id?: number;
  plant_id: number;
  task_type: TaskType;
  interval_days: number;
  next_due: string;
  created_at?: string;
}

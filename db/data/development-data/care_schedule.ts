import CareScheduleType from "../../types/care_schedule";
const careScheduleData: CareScheduleType[] = [
  {
    care_schedule_id: 1,
    plant_id: 1,
    task_type: "Watering",
    interval_days: 7,
    next_due: "2025-07-14T09:00:00Z",
    created_at: "2025-07-01T10:00:00Z",
  },
  {
    care_schedule_id: 2,
    plant_id: 2,
    task_type: "Fertilising",
    interval_days: 30,
    next_due: "2025-07-30T09:00:00Z",
    created_at: "2025-07-01T11:00:00Z",
  },
  {
    care_schedule_id: 3,
    plant_id: 1,
    task_type: "Pruning",
    interval_days: 90,
    next_due: "2025-10-01T09:00:00Z",
    created_at: "2025-07-01T12:00:00Z",
  },
];

export default careScheduleData;

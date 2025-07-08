import CareScheduleType from "../../types/care_schedule";

const careScheduleData: CareScheduleType[] = [
  {
    plant_id: 1,
    task_type: "water",
    interval_days: 7,
    next_due: "2025-07-14T09:00:00Z",
    created_at: "2025-07-01T10:00:00Z",
  },
  {
    plant_id: 2,
    task_type: "fertilise",
    interval_days: 30,
    next_due: "2025-07-30T09:00:00Z",
    created_at: "2025-07-01T11:00:00Z",
  },
  {
    plant_id: 1,
    task_type: "prune",
    interval_days: 90,
    next_due: "2025-10-01T09:00:00Z",
    created_at: "2025-07-01T12:00:00Z",
  },
];

export default careScheduleData;

import CareTasksType from "../../types/care_tasks_type";

const careTasks: CareTasksType[] = [
  {
    care_task_id: 1,
    schedule_id: 101,
    due_at: "2025-07-10T08:00:00Z",
    completed_at: "2025-07-10T09:30:00Z",
    created_at: "2025-07-01T12:00:00Z",
  },
  {
    care_task_id: 2,
    schedule_id: 102,
    due_at: "2025-07-11T14:00:00Z",
    completed_at: null,
    created_at: "2025-07-01T12:05:00Z",
  },
  {
    care_task_id: 3,
    schedule_id: 101,
    due_at: "2025-07-12T08:00:00Z",
    completed_at: null,
    created_at: "2025-07-02T10:00:00Z",
  },
  {
    care_task_id: 4,
    schedule_id: 103,
    due_at: "2025-07-13T16:00:00Z",
    completed_at: "2025-07-13T17:15:00Z",
    created_at: "2025-07-03T08:45:00Z",
  },
];

export default careTasks;

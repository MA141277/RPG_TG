export type TempleHouseTaskDefinition = {
  id: string;
  activityId: string;
  missionId: string;
  title: string;
  briefing: string;
  orderLines: string[];
  minRankId: string;
};

export const TEMPLE_HOUSE_VARIABLE_KEYS = {
  donationTotal: "var.temple.donation_total",
  lastAssignedTaskId: "var.temple.last_assigned_task_id",
  currentWorkPlan: "var.temple.current_work_plan",
  beggingSubmittedFood: "var.temple.begging_submitted_food_dou",
  beggingLastGrade: "var.temple.begging_last_grade",
} as const;

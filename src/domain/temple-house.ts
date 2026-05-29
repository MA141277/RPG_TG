export type TempleHouseTaskDefinition = {
  id: string;
  missionId: string;
  title: string;
  briefing: string;
  orderLines: string[];
};

export const TEMPLE_HOUSE_VARIABLE_KEYS = {
  donationTotal: "var.temple.donation_total",
  lastAssignedTaskId: "var.temple.last_assigned_task_id",
} as const;

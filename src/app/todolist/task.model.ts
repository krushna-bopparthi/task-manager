export interface Task {
    taskName: string;
    priority: string; // "Low", "Medium", "High"
    dueDate: string | null; // String format "YYYY-MM-DD"
    isCompleted: boolean;
  }
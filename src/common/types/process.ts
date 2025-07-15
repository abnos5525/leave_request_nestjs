import { State } from './lookup';

export enum TaskState {
  InProgress = 'InProgress',
  Completed = 'Completed',
  Deleted = 'Deleted',
}

export type AutoProcess = {
  instance_id: string;
  task_id: string;
  activity_id: string;
  activity_name: string;
  assignee_type_id: string;
  rule_id: string;
  from_position_id: string;
  from_state: string;
  from_date: Date;
  to_position_id: string;
  to_state: string;
  to_date: Date;
};

export type CurrentState = {
  assignee: string;
  state: State;
  date: Date;
  activity_id: string;
  activity_name: string;
  task_id: string;
  rule_id: string;
  form_id?: string;
  task_state?: TaskState;
};

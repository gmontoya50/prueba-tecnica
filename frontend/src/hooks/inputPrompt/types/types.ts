import { ITodoInputProps } from "../../../components/todo/inputPrompt/types/types";

export interface UseTodoInputParams {
  onCreate: ITodoInputProps['onCreate'];
  busy?: boolean;
}

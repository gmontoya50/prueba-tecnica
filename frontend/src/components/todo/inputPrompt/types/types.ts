export interface ITodoInputProps {
  onCreate: (payload: { title: string; description?: string }) => Promise<void> | void;
  busy?: boolean;
}

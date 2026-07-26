export type TestPlayableViewModel = {
  title: string;
  status: string;
};

export function renderTestPlayableView(model: TestPlayableViewModel): string {
  return `${model.title}: ${model.status}`;
}

export type ValidatorPlayableViewModel = {
  title: string;
  status: string;
};

export function renderValidatorPlayableView(model: ValidatorPlayableViewModel): string {
  return `${model.title}: ${model.status}`;
}

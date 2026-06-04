export const DOU_PER_SHI = 10;

export function convertShiToDou(shi: number): number {
  return Math.max(0, shi) * DOU_PER_SHI;
}

export function splitDouToShiAndDou(totalDou: number): {
  shi: number;
  dou: number;
} {
  const normalizedTotalDou = Math.max(0, totalDou);
  return {
    shi: Math.floor(normalizedTotalDou / DOU_PER_SHI),
    dou: normalizedTotalDou % DOU_PER_SHI,
  };
}

export function convertDouToWholeShi(totalDou: number): number {
  return splitDouToShiAndDou(totalDou).shi;
}

export function formatGrainAsShiAndDou(totalDou: number): string {
  const { shi, dou } = splitDouToShiAndDou(totalDou);

  if (shi <= 0) {
    return `${dou}斗`;
  }

  if (dou <= 0) {
    return `${shi}石`;
  }

  return `${shi}石${dou}斗`;
}

export function formatGrainAsDou(totalDou: number): string {
  return `${Math.max(0, totalDou)}斗`;
}

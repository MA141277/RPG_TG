const HOME_TEMPLATE_OWNER_ID = "home.template";
const HOME_SOURCE_OWNER_ID_PATTERN = /^home(?:_[0-9]+|\.[a-z0-9_]+)$/;
const HOUSE_TEMPLATE_OWNER_ID_PATTERN = /^house\.template\.([a-z0-9_]+)$/;
const HOUSE_SOURCE_OWNER_ID_PATTERN = /^house\.([^.]+)\.([a-z0-9_]+)$/;

export function matchesCanonicalBuildingOwnerId(
  leftOwnerId: string | undefined,
  rightOwnerId: string | undefined
): boolean {
  if (leftOwnerId == null || rightOwnerId == null) {
    return leftOwnerId === rightOwnerId;
  }

  if (leftOwnerId === rightOwnerId) {
    return true;
  }

  if (
    (leftOwnerId === HOME_TEMPLATE_OWNER_ID &&
      HOME_SOURCE_OWNER_ID_PATTERN.test(rightOwnerId)) ||
    (rightOwnerId === HOME_TEMPLATE_OWNER_ID &&
      HOME_SOURCE_OWNER_ID_PATTERN.test(leftOwnerId))
  ) {
    return true;
  }

  const leftHouseTemplateFamily = readTemplateHouseFamily(leftOwnerId);
  const rightHouseTemplateFamily = readTemplateHouseFamily(rightOwnerId);
  const leftHouseSourceFamily = readSourceHouseFamily(leftOwnerId);
  const rightHouseSourceFamily = readSourceHouseFamily(rightOwnerId);

  return (
    (leftHouseTemplateFamily != null &&
      leftHouseTemplateFamily === rightHouseSourceFamily) ||
    (rightHouseTemplateFamily != null &&
      rightHouseTemplateFamily === leftHouseSourceFamily)
  );
}

function readTemplateHouseFamily(ownerId: string): string | null {
  return HOUSE_TEMPLATE_OWNER_ID_PATTERN.exec(ownerId)?.[1] ?? null;
}

function readSourceHouseFamily(ownerId: string): string | null {
  return HOUSE_SOURCE_OWNER_ID_PATTERN.exec(ownerId)?.[2] ?? null;
}

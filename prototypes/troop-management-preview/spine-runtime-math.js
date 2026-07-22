(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }
  root.SpineRuntimeMath = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  function endPoint(pose) {
    const rad = ((pose?.worldRotation || 0) * Math.PI) / 180;
    return {
      x: (pose?.worldX || 0) + Math.cos(rad) * (pose?.length || 0) * (pose?.worldScaleX || 1),
      y: (pose?.worldY || 0) + Math.sin(rad) * (pose?.length || 0) * (pose?.worldScaleY || 1),
    };
  }

  function worldFromLocalByParentPose(parentPose, localPoint) {
    const anchor = endPoint(parentPose);
    const rad = ((parentPose?.worldRotation || 0) * Math.PI) / 180;
    const px = (localPoint?.x || 0) * (parentPose?.worldScaleX || 1);
    const py = (localPoint?.y || 0) * (parentPose?.worldScaleY || 1);
    return {
      x: anchor.x + px * Math.cos(rad) - py * Math.sin(rad),
      y: anchor.y + px * Math.sin(rad) + py * Math.cos(rad),
    };
  }

  function resolveRestPartWorldTransform(parentPose, restPart) {
    if (!restPart) return null;
    if (!parentPose) return { ...restPart };
    const worldPoint = worldFromLocalByParentPose(parentPose, {
      x: restPart.x || 0,
      y: restPart.y || 0,
    });
    return {
      ...restPart,
      x: worldPoint.x,
      y: worldPoint.y,
      rotation: (restPart.rotation || 0) + (parentPose.worldRotation || 0),
    };
  }

  return {
    endPoint,
    worldFromLocalByParentPose,
    resolveRestPartWorldTransform,
  };
});


export function getSourceElement(sourceElementId: string | undefined) {
  return sourceElementId ? document.getElementById(sourceElementId) : window;
}
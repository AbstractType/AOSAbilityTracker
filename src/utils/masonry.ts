/**
 * Splits an ordered list into N columns using round-robin distribution
 * (item N → column N % count). Read column-by-column, top-to-bottom, the
 * original order is preserved. Shared by the ability + unit masonry grids.
 */
export function distributeIntoColumns<T>(items: T[], columnCount: number): T[][] {
  const safeCount = Math.max(1, columnCount);
  const columns: T[][] = Array.from({ length: safeCount }, () => []);
  items.forEach((item, index) => {
    columns[index % safeCount].push(item);
  });
  return columns;
}

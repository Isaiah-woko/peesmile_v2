export function synthesizePeaks(seedValue: number, count = 48): number[] {
  return Array.from({ length: count }, (_, index) => {
    const value = Math.abs(Math.sin(index * 0.4 + seedValue)) * 0.7 + 0.15;
    return Number(value.toFixed(3));
  });
}
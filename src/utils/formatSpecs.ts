import type { Watch } from "../mock/watches";

export function formatSpecs(watch: Watch): string {
  const parts = [
    `${watch.caseSizeMm}mm`,
    watch.caseMaterial,
    `${watch.waterResistanceM}m WR`,
    watch.movementType,
    `${watch.powerReserveHours}h power reserve`,
  ];
  
  return parts.join(" • ");
}


import { modelLabels, type DeliveryModel } from '@/content/products';

/** Delivery models as a comma list that never breaks inside "Self-hosted". */
export function ModelList({ models }: { models: DeliveryModel[] }) {
  return models.map((m, i) => (
    <span key={m}>
      <span className="whitespace-nowrap">{modelLabels[m]}</span>
      {i < models.length - 1 && ', '}
    </span>
  ));
}

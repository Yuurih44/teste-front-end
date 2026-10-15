export default function ProductSkeleton() {
  return (
    <div className="loading-products" role="status">
      <span className="sr-only">Carregando produtos…</span>
      <div className="skeleton-grid" aria-hidden="true">
        {[1, 2, 3, 4].map((number) => (
          <div className="skeleton-card" key={number}>
            <div className="skeleton skeleton-image" />
            <div className="skeleton skeleton-line" />
            <div className="skeleton skeleton-line skeleton-short" />
            <div className="skeleton skeleton-price" />
            <div className="skeleton skeleton-button" />
          </div>
        ))}
      </div>
    </div>
  );
}

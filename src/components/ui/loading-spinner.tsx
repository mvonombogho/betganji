export function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  );
}

export function LoadingCard() {
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    </div>
  );
}

export function LoadingSection() {
  return (
    <div className="space-y-4">
      <LoadingCard />
      <LoadingCard />
      <LoadingCard />
    </div>
  );
}

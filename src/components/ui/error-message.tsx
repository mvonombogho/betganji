interface ErrorMessageProps {
  message: string;
  retry?: () => void;
}

export function ErrorMessage({ message, retry }: ErrorMessageProps) {
  return (
    <div className="rounded-md bg-red-50 p-4">
      <div className="flex">
        <div className="flex-1">
          <p className="text-sm text-red-700">
            {message}
          </p>
        </div>
        {retry && (
          <div className="ml-3">
            <button
              onClick={retry}
              className="text-sm font-medium text-red-700 hover:text-red-600"
            >
              Try again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

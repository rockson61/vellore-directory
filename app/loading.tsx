export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="text-center">
        {/* Spinner */}
        <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-6"></div>
        <div className="text-xl font-semibold text-slate-900 mb-2">
          Loading...
        </div>
        <p className="text-slate-600">
          Please wait while we fetch the information
        </p>
      </div>
    </div>
  );
}

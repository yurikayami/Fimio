import { AlertCircle } from 'lucide-react';

export const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="rounded-full bg-destructive/10 p-4 mb-4">
        <AlertCircle className="h-10 w-10 text-destructive" />
      </div>
      <h3 className="text-xl font-semibold mb-2">Đã xảy ra lỗi</h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        {message || 'Không thể tải dữ liệu. Vui lòng thử lại sau.'}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2 bg-accent text-accent-foreground rounded-lg font-medium hover:bg-accent/90 transition-colors"
        >
          Thử lại
        </button>
      )}
    </div>
  );
};

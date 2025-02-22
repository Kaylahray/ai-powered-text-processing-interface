import React from "react";

interface ErrorDisplayProps {
  error: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error }) => {
  return (
    error && (
      <div className="mx-4 mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
        {error}
      </div>
    )
  );
};

export default ErrorDisplay;

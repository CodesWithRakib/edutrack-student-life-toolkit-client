// src/components/ui/loading-states.tsx
import React from "react";
import LoadingSpinner from "../LoadingSpinner";

// Full page loader
export const FullPageLoader: React.FC<{ text?: string }> = ({
  text = "Loading...",
}) => {
  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 bg-opacity-90 dark:bg-opacity-90 flex items-center justify-center z-50">
      <div className="text-center">
        <LoadingSpinner size="xl" variant="primary" text={text} showText />
      </div>
    </div>
  );
};

// Card loader (for when content inside a card is loading)
export const CardLoader: React.FC<{ rows?: number }> = ({ rows = 3 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="space-y-3">
          <div className="flex items-center space-x-4">
            <div className="skeleton h-12 w-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="skeleton h-4 w-3/4" />
              <div className="skeleton h-4 w-1/2" />
            </div>
          </div>
          <div className="skeleton h-4 w-full" />
        </div>
      ))}
    </div>
  );
};

// Button loader (for loading buttons)
export const ButtonLoader: React.FC<{ text?: string }> = ({
  text = "Loading...",
}) => {
  return (
    <div className="flex items-center justify-center">
      <LoadingSpinner size="sm" variant="default" />
      <span className="ml-2">{text}</span>
    </div>
  );
};

// List loader (for lists of items)
export const ListLoader: React.FC<{ count?: number }> = ({ count = 5 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex items-center space-x-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
        >
          <div className="skeleton h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="skeleton h-4 w-3/4" />
            <div className="skeleton h-4 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
};

// Table loader (for table content)
export const TableLoader: React.FC<{ rows?: number; columns?: number }> = ({
  rows = 5,
  columns = 4,
}) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div key={colIndex} className="flex-1">
              <div className="skeleton h-4 w-full" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

// Chart loader (for charts and graphs)
export const ChartLoader: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <LoadingSpinner size="lg" variant="primary" />
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Loading chart data...
        </p>
      </div>
    </div>
  );
};

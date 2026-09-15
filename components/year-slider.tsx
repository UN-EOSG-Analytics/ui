"use client";

import { useCallback, useRef, useState, useEffect, useMemo } from "react";

export interface YearSliderProps {
  years: number[];
  selectedYear: number;
  onChange: (year: number) => void;
  disabled?: boolean;
  compact?: boolean;
  /** Caption for a year. Peacekeeping runs July-June, so 2024 reads "2024/25". */
  label?: string;
  formatLabel?: (year: number) => string;
}

export function YearSlider({
  years,
  selectedYear,
  onChange,
  disabled = false,
  compact = false,
  formatLabel,
  label = "Select year",
}: YearSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  // Track the visual position during drag (only commits on release)
  const [dragYear, setDragYear] = useState<number | null>(null);

  const sortedYears = useMemo(() => [...years].sort((a, b) => a - b), [years]);
  const minYear = sortedYears[0];
  const maxYear = sortedYears[sortedYears.length - 1];

  // The displayed year: during drag show dragYear, otherwise selectedYear
  const displayYear = dragYear ?? selectedYear;

  const getPositionFromYear = (year: number): number => {
    if (sortedYears.length <= 1) return 50;
    const index = sortedYears.indexOf(year);
    if (index === -1) return 50;
    return (index / (sortedYears.length - 1)) * 100;
  };

  const getYearFromPosition = useCallback(
    (clientX: number): number => {
      if (!trackRef.current || sortedYears.length <= 1) return selectedYear;

      const rect = trackRef.current.getBoundingClientRect();
      const position = Math.max(
        0,
        Math.min(1, (clientX - rect.left) / rect.width),
      );
      const index = Math.round(position * (sortedYears.length - 1));
      return sortedYears[index];
    },
    [sortedYears, selectedYear],
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (disabled) return;
      e.preventDefault();
      setIsDragging(true);
      const year = getYearFromPosition(e.clientX);
      setDragYear(year);
    },
    [disabled, getYearFromPosition],
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || disabled) return;
      const year = getYearFromPosition(e.clientX);
      setDragYear(year);
    },
    [isDragging, disabled, getYearFromPosition],
  );

  const handleMouseUp = useCallback(() => {
    if (isDragging && dragYear !== null && dragYear !== selectedYear) {
      onChange(dragYear);
    }
    setIsDragging(false);
    setDragYear(null);
  }, [isDragging, dragYear, selectedYear, onChange]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Touch support
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (disabled) return;
      e.preventDefault(); // Prevent page scroll from interfering
      setIsDragging(true);
      const touch = e.touches[0];
      const year = getYearFromPosition(touch.clientX);
      setDragYear(year);
    },
    [disabled, getYearFromPosition],
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging || disabled) return;
      e.preventDefault(); // Prevent page scroll during drag
      const touch = e.touches[0];
      const year = getYearFromPosition(touch.clientX);
      setDragYear(year);
    },
    [isDragging, disabled, getYearFromPosition],
  );

  const handleTouchEnd = useCallback(() => {
    if (isDragging && dragYear !== null && dragYear !== selectedYear) {
      onChange(dragYear);
    }
    setIsDragging(false);
    setDragYear(null);
  }, [isDragging, dragYear, selectedYear, onChange]);

  useEffect(() => {
    if (isDragging) {
      // Use passive: false to allow preventDefault in touch handlers
      window.addEventListener("touchmove", handleTouchMove, { passive: false });
      window.addEventListener("touchend", handleTouchEnd);
      return () => {
        window.removeEventListener("touchmove", handleTouchMove);
        window.removeEventListener("touchend", handleTouchEnd);
      };
    }
  }, [isDragging, handleTouchMove, handleTouchEnd]);

  // Keyboard support
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return;

      const currentIndex = sortedYears.indexOf(selectedYear);
      let newIndex = currentIndex;

      switch (e.key) {
        case "ArrowLeft":
        case "ArrowDown":
          e.preventDefault();
          newIndex = Math.max(0, currentIndex - 1);
          break;
        case "ArrowRight":
        case "ArrowUp":
          e.preventDefault();
          newIndex = Math.min(sortedYears.length - 1, currentIndex + 1);
          break;
        case "Home":
          e.preventDefault();
          newIndex = 0;
          break;
        case "End":
          e.preventDefault();
          newIndex = sortedYears.length - 1;
          break;
        default:
          return;
      }

      if (newIndex !== currentIndex) {
        onChange(sortedYears[newIndex]);
      }
    },
    [disabled, sortedYears, selectedYear, onChange],
  );

  const thumbPosition = getPositionFromYear(displayYear);

  if (sortedYears.length <= 1) {
    return null;
  }

  return (
    <div className={`flex items-center gap-2 ${compact ? "h-6.5" : "h-9"}`}>
      <div
        ref={trackRef}
        role="slider"
        tabIndex={disabled ? -1 : 0}
        aria-valuemin={minYear}
        aria-valuemax={maxYear}
        aria-valuenow={displayYear}
        aria-valuetext={formatLabel?.(displayYear)}
        aria-label={label}
        aria-disabled={disabled}
        className={`relative flex ${compact ? "h-6.5" : "h-9"} w-24 cursor-pointer touch-none items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-un-blue focus-visible:ring-offset-2 sm:w-32 ${
          disabled ? "cursor-not-allowed opacity-50" : ""
        }`}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onKeyDown={handleKeyDown}
      >
        {/* Visual track line */}
        <div className="h-0.5 w-full bg-gray-300" />
        {/* Thumb - larger touch target */}
        <div
          className={`absolute top-1/2 flex ${compact ? "h-6.5" : "h-9"} w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center`}
          style={{ left: `${thumbPosition}%` }}
        >
          <div
            className={`h-4 w-0.5 ${isDragging ? "bg-un-blue" : "bg-gray-600"} ${disabled ? "" : "group-hover:bg-un-blue"}`}
          />
        </div>
      </div>
      <span className="min-w-[3ch] text-sm font-medium whitespace-nowrap text-gray-900">
        {formatLabel ? formatLabel(displayYear) : displayYear}
      </span>
    </div>
  );
}

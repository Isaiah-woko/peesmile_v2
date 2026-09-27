"use client";

import { useEffect, useMemo, useState } from "react";
import { useBooking } from "./BookingProvider";
import { DualClock } from "./DualClock";
import { DayRibbon } from "./DayRibbon";
import {
  COMMON_TIMEZONES,
  formatTimeInTimezone,
  getUpcomingDays,
  zonedTimeToUtc,
} from "@/lib/timezone";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/primitives/Select";
import { cn } from "@/lib/utils";

const WINDOW_OPTIONS = [5, 15, 30];

const TIME_PRESETS = [
  { label: "Morning", minutes: 9 * 60 },
  { label: "Afternoon", minutes: 14 * 60 },
  { label: "Evening", minutes: 19 * 60 },
];

interface MomentPickerProps {
  recipientTimezone: string;
}

export function MomentPicker({ recipientTimezone }: MomentPickerProps) {
  const { setMoment } = useBooking();

  const [dayIndex, setDayIndex] = useState(1);
  const [minutesOfDay, setMinutesOfDay] = useState(14 * 60);
  const [windowMinutes, setWindowMinutes] = useState(15);
  const [timezone, setTimezone] = useState(recipientTimezone);
  const [enableBackup, setEnableBackup] = useState(false);

  const days = useMemo(() => getUpcomingDays(timezone, 7), [timezone]);
  const selectedDay = days[Math.min(dayIndex, days.length - 1)];

  const scheduledStart = useMemo(() => {
    const hour = Math.floor(minutesOfDay / 60);
    const minute = minutesOfDay % 60;
    return zonedTimeToUtc(
      selectedDay.year,
      selectedDay.monthIndex,
      selectedDay.day,
      hour,
      minute,
      timezone
    );
  }, [selectedDay, minutesOfDay, timezone]);

  const backupStart = useMemo(() => {
    if (!enableBackup) return null;
    return new Date(scheduledStart.getTime() + 60 * 60000);
  }, [enableBackup, scheduledStart]);

  useEffect(() => {
    setMoment({
      scheduledStart: scheduledStart.toISOString(),
      windowMinutes,
      backupStart: backupStart ? backupStart.toISOString() : null,
    });
  }, [scheduledStart, windowMinutes, backupStart, setMoment]);

  const selectedTimeLabel = formatTimeInTimezone(scheduledStart, timezone);

  return (
    <div className="space-y-8">
      <DualClock recipientTimezone={timezone} />

      <div>
        <p className="text-body-small font-medium text-ink">Day</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {days.map((day, index) => (
            <button
              key={`${day.year}-${day.monthIndex}-${day.day}`}
              type="button"
              onClick={() => setDayIndex(index)}
              className={cn(
                "rounded-md border px-3 py-2 text-body-small transition-colors duration-120ms",
                index === dayIndex
                  ? "border-ember bg-bone text-ink"
                  : "border-rule bg-paper text-ink-soft hover:bg-bone"
              )}
            >
              {day.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-body-small font-medium text-ink">Time of day</p>
        <div className="mt-3 flex gap-2">
          {TIME_PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => setMinutesOfDay(preset.minutes)}
              className={cn(
                "rounded-md border px-3 py-1.5 text-body-small transition-colors duration-120ms",
                minutesOfDay === preset.minutes
                  ? "border-ember bg-bone text-ink"
                  : "border-rule bg-paper text-ink-soft hover:bg-bone"
              )}
            >
              {preset.label}
            </button>
          ))}
        </div>
        <div className="mt-4">
          <DayRibbon valueMinutes={minutesOfDay} onChange={setMinutesOfDay} />
        </div>
        <p className="text-body-small text-ash mt-2">
          The call lands around {selectedTimeLabel} their time.
        </p>
      </div>

      <div>
        <p className="text-body-small font-medium text-ink">Call window</p>
        <div className="mt-3 flex gap-2">
          {WINDOW_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setWindowMinutes(option)}
              className={cn(
                "rounded-md border px-3 py-1.5 text-body-small transition-colors duration-120ms",
                windowMinutes === option
                  ? "border-ember bg-bone text-ink"
                  : "border-rule bg-paper text-ink-soft hover:bg-bone"
              )}
            >
              {option} min
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-body-small font-medium text-ink">Their time zone</p>
        <div className="mt-3">
          <Select value={timezone} onValueChange={setTimezone}>
            <SelectTrigger className="w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {COMMON_TIMEZONES.map((zone) => (
                <SelectItem key={zone} value={zone}>
                  {zone}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <p className="text-body-small text-ash mt-2">
          We auto-detected {recipientTimezone}. Adjust it if they are travelling.
        </p>
      </div>

      <label className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={enableBackup}
          onChange={(event) => setEnableBackup(event.target.checked)}
          className="mt-1 h-4 w-4 accent-ember"
        />
        <span>
          <span className="text-body-0 text-ink block">Add a backup window</span>
          <span className="text-body-small text-ink-soft">
            If they miss the first call, we retry one hour later.
          </span>
        </span>
      </label>
    </div>
  );
}
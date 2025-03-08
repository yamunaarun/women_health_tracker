import { addDays, differenceInDays, format } from "date-fns";
import type { PeriodEntry } from "@shared/schema";

export function checkAndTriggerNotification(entries: PeriodEntry[], cycleLength: number = 28) {
  // Only proceed if notifications are enabled
  if (Notification.permission !== "granted") {
    return;
  }

  if (!entries || entries.length === 0) {
    return;
  }

  // Sort entries by date
  const sortedEntries = [...entries].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const lastPeriod = new Date(sortedEntries[0].date);
  const nextPeriod = addDays(lastPeriod, cycleLength);
  const today = new Date();
  
  // Calculate days until next period
  const daysUntilPeriod = differenceInDays(nextPeriod, today);

  // Notify 2 days before the predicted start date
  if (daysUntilPeriod === 2) {
    new Notification("Period Reminder", {
      body: `Your next period is expected to start on ${format(nextPeriod, 'MMMM d')}`,
      icon: "/favicon.ico"
    });
  }
}

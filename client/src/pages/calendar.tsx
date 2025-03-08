import { useState } from "react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { PeriodEntry } from "@shared/schema";

export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();
  
  const { data: entries, isLoading } = useQuery<PeriodEntry[]>({
    queryKey: ["/api/users/1/entries"],
  });

  const addEntry = useMutation({
    mutationFn: async (date: Date) => {
      return apiRequest("POST", "/api/entries", {
        userId: 1,
        date: date.toISOString(),
        flow: "medium",
        symptoms: [],
      });
    },
    onSuccess: () => {
      toast({ title: "Period entry added" });
    },
  });

  const markedDates = entries?.reduce((acc, entry) => {
    acc[new Date(entry.date).toDateString()] = true;
    return acc;
  }, {} as Record<string, boolean>) ?? {};

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Period Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <CalendarComponent
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            modifiers={{ marked: (date) => markedDates[date.toDateString()] }}
            modifiersClassNames={{
              marked: "bg-primary/50 text-primary-foreground",
            }}
          />
          <div className="mt-4 flex justify-center">
            <Button
              onClick={() => selectedDate && addEntry.mutate(selectedDate)}
              disabled={addEntry.isPending}
            >
              Log Period
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

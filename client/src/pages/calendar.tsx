import { useState } from "react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { PeriodEntry } from "@shared/schema";

const flowOptions = [
  { value: "light", label: "Light" },
  { value: "medium", label: "Medium" },
  { value: "heavy", label: "Heavy" },
];

const symptomsOptions = [
  "Cramps",
  "Headache",
  "Bloating",
  "Fatigue",
  "Mood Changes",
  "Back Pain"
];

export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedFlow, setSelectedFlow] = useState("medium");
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: entries, isLoading } = useQuery<PeriodEntry[]>({
    queryKey: ["/api/users/1/entries"],
  });

  const addEntry = useMutation({
    mutationFn: async (date: Date) => {
      return apiRequest("POST", "/api/entries", {
        userId: 1,
        date: date.toISOString().split('T')[0],
        flow: selectedFlow,
        symptoms: selectedSymptoms,
        notes: "",
      });
    },
    onSuccess: () => {
      toast({ title: "Period entry added" });
      queryClient.invalidateQueries({ queryKey: ["/api/users/1/entries"] });
    },
    onError: () => {
      toast({ 
        title: "Failed to add entry",
        variant: "destructive"
      });
    }
  });

  const markedDates = entries?.reduce((acc, entry) => {
    acc[new Date(entry.date).toDateString()] = entry.flow;
    return acc;
  }, {} as Record<string, string>) ?? {};

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const getFlowColor = (flow: string) => {
    switch (flow) {
      case 'light': return 'bg-primary/30';
      case 'medium': return 'bg-primary/60';
      case 'heavy': return 'bg-primary/90';
      default: return 'bg-primary/50';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Period Calendar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <CalendarComponent
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            modifiers={{ 
              marked: (date) => date.toDateString() in markedDates
            }}
            modifiersClassNames={{
              marked: (date) => getFlowColor(markedDates[date.toDateString()]),
            }}
            className="rounded-md border"
          />

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Flow</label>
              <Select
                value={selectedFlow}
                onValueChange={setSelectedFlow}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select flow" />
                </SelectTrigger>
                <SelectContent>
                  {flowOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Symptoms</label>
              <div className="flex flex-wrap gap-2">
                {symptomsOptions.map(symptom => (
                  <Badge
                    key={symptom}
                    variant={selectedSymptoms.includes(symptom) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleSymptom(symptom)}
                  >
                    {symptom}
                  </Badge>
                ))}
              </div>
            </div>

            <Button
              onClick={() => selectedDate && addEntry.mutate(selectedDate)}
              disabled={addEntry.isPending || !selectedDate}
              className="w-full"
            >
              Log Period
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary/30" />
          <span className="text-sm">Light</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary/60" />
          <span className="text-sm">Medium</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary/90" />
          <span className="text-sm">Heavy</span>
        </div>
      </div>
    </div>
  );
}
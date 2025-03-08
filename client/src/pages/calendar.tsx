import { useState, useEffect } from "react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { PeriodEntry } from "@shared/schema";
import { format } from "date-fns";
import { checkAndTriggerNotification } from "@/lib/notifications";

const flowOptions = [
  { value: "spotting", label: "Spotting" },
  { value: "light", label: "Light" },
  { value: "medium", label: "Medium" },
  { value: "heavy", label: "Heavy" },
  { value: "very_heavy", label: "Very Heavy" },
];

const symptomsOptions = [
  "Cramps",
  "Headache",
  "Bloating",
  "Fatigue",
  "Mood Changes",
  "Back Pain",
  "Breast Tenderness",
  "Acne",
  "Nausea",
  "Food Cravings",
  "Insomnia",
  "Dizziness"
];

const moodOptions = [
  "Happy",
  "Sad",
  "Anxious",
  "Irritable",
  "Energetic",
  "Tired",
  "Calm",
  "Stressed"
];

export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedFlow, setSelectedFlow] = useState("medium");
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
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
        symptoms: [...selectedSymptoms, ...selectedMoods.map(mood => `Mood: ${mood}`)],
        notes: notes,
      });
    },
    onSuccess: () => {
      toast({ title: "Period entry added" });
      queryClient.invalidateQueries({ queryKey: ["/api/users/1/entries"] });
      // Reset form
      setSelectedSymptoms([]);
      setSelectedMoods([]);
      setNotes("");
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

  const toggleMood = (mood: string) => {
    setSelectedMoods(prev => 
      prev.includes(mood)
        ? prev.filter(m => m !== mood)
        : [...prev, mood]
    );
  };

  const getFlowColor = (flow: string) => {
    switch (flow) {
      case 'spotting': return 'bg-primary/20';
      case 'light': return 'bg-primary/40';
      case 'medium': return 'bg-primary/60';
      case 'heavy': return 'bg-primary/80';
      case 'very_heavy': return 'bg-primary';
      default: return 'bg-primary/50';
    }
  };

  const selectedDateEntry = selectedDate && entries?.find(
    entry => new Date(entry.date).toDateString() === selectedDate.toDateString()
  );

  useEffect(() => {
    if (entries) {
      checkAndTriggerNotification(entries);
    }
  }, [entries]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Period Calendar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
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

              {/* Flow Legend */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
                {flowOptions.map(option => (
                  <div key={option.value} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getFlowColor(option.value)}`} />
                    <span className="text-sm">{option.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Selected Date</label>
                <p className="text-lg font-semibold text-primary">
                  {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a date'}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Flow Intensity</label>
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
                <label className="text-sm font-medium mb-2 block">Physical Symptoms</label>
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

              <div>
                <label className="text-sm font-medium mb-2 block">Mood</label>
                <div className="flex flex-wrap gap-2">
                  {moodOptions.map(mood => (
                    <Badge
                      key={mood}
                      variant={selectedMoods.includes(mood) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleMood(mood)}
                    >
                      {mood}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Notes</label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any additional notes..."
                  className="h-24"
                />
              </div>

              <Button
                onClick={() => selectedDate && addEntry.mutate(selectedDate)}
                disabled={addEntry.isPending || !selectedDate}
                className="w-full"
              >
                Log Period
              </Button>
            </div>
          </div>

          {selectedDateEntry && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Previous Entry for {format(new Date(selectedDateEntry.date), 'MMMM d, yyyy')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-medium">Flow: </p>
                  <Badge>{selectedDateEntry.flow}</Badge>
                </div>
                {selectedDateEntry.symptoms.length > 0 && (
                  <div>
                    <p className="font-medium">Recorded Symptoms & Mood:</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedDateEntry.symptoms.map((symptom, i) => (
                        <Badge key={i} variant="secondary">{symptom}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {selectedDateEntry.notes && (
                  <div>
                    <p className="font-medium">Notes:</p>
                    <p className="text-muted-foreground mt-1">{selectedDateEntry.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
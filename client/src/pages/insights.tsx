import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import type { PeriodEntry } from "@shared/schema";
import { format, differenceInDays } from "date-fns";

function calculateCycleStats(entries: PeriodEntry[]) {
  if (!entries || entries.length < 2) return null;

  const sortedEntries = [...entries].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const cycleLengths = sortedEntries.slice(1).map((entry, i) => 
    differenceInDays(new Date(entry.date), new Date(sortedEntries[i].date))
  );

  const avgCycleLength = Math.round(
    cycleLengths.reduce((sum, length) => sum + length, 0) / cycleLengths.length
  );

  const commonSymptoms = sortedEntries.reduce((acc, entry) => {
    entry.symptoms?.forEach(symptom => {
      acc[symptom] = (acc[symptom] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  return {
    avgCycleLength,
    commonSymptoms,
    lastPeriod: sortedEntries[sortedEntries.length - 1].date,
    nextPeriod: format(
      new Date(new Date(sortedEntries[sortedEntries.length - 1].date).getTime() + 
        avgCycleLength * 24 * 60 * 60 * 1000
      ),
      'MMM d, yyyy'
    ),
  };
}

export default function Insights() {
  const { data: entries } = useQuery<PeriodEntry[]>({
    queryKey: ["/api/users/1/entries"],
  });

  const stats = entries ? calculateCycleStats(entries) : null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Health Insights</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Cycle Length</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">
              {stats?.avgCycleLength ? `${stats.avgCycleLength} days` : "Not enough data"}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Your average cycle length based on recorded data
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Next Period</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">
              {stats?.nextPeriod || "No prediction yet"}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Estimated start date of your next period
            </p>
          </CardContent>
        </Card>

        {stats?.commonSymptoms && Object.keys(stats.commonSymptoms).length > 0 && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Common Symptoms</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(stats.commonSymptoms)
                  .sort(([,a], [,b]) => b - a)
                  .map(([symptom, count]) => (
                    <div key={symptom} className="bg-primary/5 p-4 rounded-lg">
                      <p className="font-medium">{symptom}</p>
                      <p className="text-sm text-muted-foreground">
                        Reported {count} {count === 1 ? 'time' : 'times'}
                      </p>
                    </div>
                  ))
                }
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cycle Health Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="bg-primary/5 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Stay Active</h3>
              <p className="text-sm text-muted-foreground">
                Regular moderate exercise can help reduce menstrual cramps and improve mood
              </p>
            </div>

            <div className="bg-primary/5 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Balanced Diet</h3>
              <p className="text-sm text-muted-foreground">
                Include iron-rich foods and stay hydrated to help manage menstrual symptoms
              </p>
            </div>

            <div className="bg-primary/5 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Stress Management</h3>
              <p className="text-sm text-muted-foreground">
                Practice relaxation techniques to help regulate your cycle and reduce PMS
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
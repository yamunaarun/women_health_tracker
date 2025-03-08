import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import type { PeriodEntry } from "@shared/schema";

export default function Insights() {
  const { data: entries } = useQuery<PeriodEntry[]>({
    queryKey: ["/api/users/1/entries"],
  });

  // Calculate average cycle length
  const avgCycleLength = entries && entries.length > 1
    ? Math.round(
        entries
          .slice(1)
          .reduce(
            (sum, entry, i) =>
              sum +
              (new Date(entry.date).getTime() -
                new Date(entries[i].date).getTime()) /
                (1000 * 60 * 60 * 24),
            0
          ) / (entries.length - 1)
      )
    : null;

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
              {avgCycleLength ? `${avgCycleLength} days` : "Not enough data"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Next Period</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">
              {entries && entries.length > 0
                ? new Date(
                    new Date(entries[entries.length - 1].date).getTime() +
                      28 * 24 * 60 * 60 * 1000
                  ).toLocaleDateString()
                : "No data"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tips for a Healthy Cycle</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>• Stay hydrated and maintain a balanced diet</p>
          <p>• Exercise regularly but avoid overexertion</p>
          <p>• Get adequate sleep and manage stress</p>
          <p>• Track your symptoms consistently</p>
        </CardContent>
      </Card>
    </div>
  );
}

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { User } from "@shared/schema";
import { insertUserSchema } from "@shared/schema";
import { Bell } from "lucide-react";

export default function Profile() {
  const { toast } = useToast();

  const { data: user } = useQuery<User>({
    queryKey: ["/api/users/1"],
  });

  const form = useForm({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      username: user?.username || "",
      cycleLength: user?.cycleLength || 28,
      periodLength: user?.periodLength || 5,
    },
  });

  const updateProfile = useMutation({
    mutationFn: (values: ReturnType<typeof form.getValues>) => {
      return apiRequest("PATCH", "/api/users/1", values);
    },
    onSuccess: () => {
      toast({ title: "Profile updated successfully" });
    },
  });

  const requestNotificationPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        toast({ title: "Notifications enabled" });
        // Send a test notification
        new Notification("Period Tracker", {
          body: "You will be notified before your next period",
          icon: "/favicon.ico"
        });
      }
    } catch (error) {
      toast({ 
        title: "Could not enable notifications",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Profile Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Your Information</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((data) => updateProfile.mutate(data))}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cycleLength"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Average Cycle Length (days)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value, 10))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="periodLength"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Average Period Length (days)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value, 10))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={updateProfile.isPending}
              >
                Save Changes
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="text-sm font-medium">Period Reminders</h4>
              <p className="text-sm text-muted-foreground">
                Get notified 2 days before your predicted period start date
              </p>
            </div>
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={requestNotificationPermission}
            >
              <Bell className="h-4 w-4" />
              Enable Notifications
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
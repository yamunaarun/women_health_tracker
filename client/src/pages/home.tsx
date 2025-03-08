import { Link } from "wouter";
import { 
  Calendar, 
  BarChart2, 
  User,
  Heart,
  Bell,
  Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="space-y-8 pb-16">
      {/* Hero Section */}
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary/80 to-primary text-transparent bg-clip-text">
          Track Your Cycle, Care for Yourself
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          A private and intuitive way to track your menstrual cycle, understand your body, and get personalized insights.
        </p>
      </section>

      {/* Feature Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-background/50 backdrop-blur">
          <CardContent className="pt-6 space-y-4">
            <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">Period Tracking</h3>
            <p className="text-muted-foreground">
              Easy and intuitive calendar to track your menstrual cycle and symptoms
            </p>
          </CardContent>
        </Card>

        <Card className="bg-background/50 backdrop-blur">
          <CardContent className="pt-6 space-y-4">
            <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center">
              <BarChart2 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">Health Insights</h3>
            <p className="text-muted-foreground">
              Get personalized insights about your cycle and overall wellness
            </p>
          </CardContent>
        </Card>

        <Card className="bg-background/50 backdrop-blur">
          <CardContent className="pt-6 space-y-4">
            <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center">
              <Bell className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">Smart Reminders</h3>
            <p className="text-muted-foreground">
              Never miss a day with customizable cycle predictions and reminders
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Features Grid */}
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Lock className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Private & Secure</h3>
          </div>
          <p className="text-muted-foreground">
            Your data is encrypted and never shared. We prioritize your privacy above all.
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Heart className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Holistic Health</h3>
          </div>
          <p className="text-muted-foreground">
            Track symptoms, mood, and health metrics for a complete picture of your wellbeing.
          </p>
        </div>
      </div>

      {/* Image Section */}
      <div className="relative rounded-lg overflow-hidden h-64 md:h-80">
        <img 
          src="https://images.unsplash.com/photo-1687875496747-60dfbc703570"
          alt="Wellness illustration"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background to-background/50" />
        <div className="relative h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold">Ready to Start?</h2>
          <p className="text-muted-foreground max-w-md">
            Join thousands of others who are taking control of their health journey
          </p>
          <Link href="/calendar">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Start Tracking Now
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Access Buttons */}
      <div className="flex flex-wrap gap-4 justify-center">
        <Link href="/calendar">
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            Open Calendar
          </Button>
        </Link>
        <Link href="/insights">
          <Button variant="outline" className="gap-2">
            <BarChart2 className="h-4 w-4" />
            View Insights
          </Button>
        </Link>
        <Link href="/profile">
          <Button variant="outline" className="gap-2">
            <User className="h-4 w-4" />
            Setup Profile
          </Button>
        </Link>
      </div>
    </div>
  );
}

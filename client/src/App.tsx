import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import { Navbar } from "@/components/layout/navbar";
import Calendar from "@/pages/calendar";
import Insights from "@/pages/insights";
import Profile from "@/pages/profile";

function Router() {
  return (
    <div className="min-h-screen pb-16 md:pb-0 md:pt-16">
      <Navbar />
      <main className="max-w-screen-xl mx-auto px-4 py-6">
        <Switch>
          <Route path="/" component={Calendar} />
          <Route path="/insights" component={Insights} />
          <Route path="/profile" component={Profile} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;

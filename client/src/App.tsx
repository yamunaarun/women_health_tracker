import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import { Navbar } from "@/components/layout/navbar";
import Home from "@/pages/home";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import Calendar from "@/pages/calendar";
import Insights from "@/pages/insights";
import Profile from "@/pages/profile";
import React from "react";

function Router() {
  return (
    <div className="min-h-screen">
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/calendar">
          <AppLayout>
            <Calendar />
          </AppLayout>
        </Route>
        <Route path="/insights">
          <AppLayout>
            <Insights />
          </AppLayout>
        </Route>
        <Route path="/profile">
          <AppLayout>
            <Profile />
          </AppLayout>
        </Route>
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="pb-16 md:pb-0 md:pt-16">
      <Navbar />
      <main className="max-w-screen-xl mx-auto px-4 py-6">
        {children}
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
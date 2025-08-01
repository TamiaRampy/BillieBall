import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
import { apiRequest } from "./lib/queryClient";
import Navigation from "@/components/navigation";
import Home from "@/pages/home";
import Leaderboard from "@/pages/leaderboard";
import History from "@/pages/history";
import Admin from "@/pages/admin";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="min-h-screen bg-billie-black">
      <Navigation />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/leaderboard" component={Leaderboard} />
        <Route path="/history" component={History} />
        <Route path="/admin" component={Admin} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function App() {
  useEffect(() => {
    // Initialize shows on app start
    apiRequest("POST", "/api/init-shows").catch(console.error);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

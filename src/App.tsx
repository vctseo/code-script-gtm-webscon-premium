import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import ScriptEditor from "@/pages/ScriptEditor";
import CustomScriptEditor from "@/pages/CustomScriptEditor";
import BulkReplace from "@/pages/BulkReplace";
import WriteArticle from "@/pages/WriteArticle";
import LockGen from "@/pages/LockGen";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/new" component={CustomScriptEditor} />
      <Route path="/bulk-replace" component={BulkReplace} />
      <Route path="/write-article" component={WriteArticle} />
      <Route path="/lock-gen" component={LockGen} />
      <Route path="/template/:id">
        {(params) => <ScriptEditor mode="new" templateId={params.id} />}
      </Route>
      <Route path="/edit/:id">
        {(params) => <ScriptEditor mode="edit" savedId={params.id} />}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

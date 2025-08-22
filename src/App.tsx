import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LoginAndSites from "./Root";

const client = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={client}>
      <LoginAndSites />
    </QueryClientProvider>
  );
}

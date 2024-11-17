import { DbProvider } from "./components/db-provider";
import { App } from "./app";

export default function Index() {
  return (
    <DbProvider>
      <App />
    </DbProvider>
  );
}

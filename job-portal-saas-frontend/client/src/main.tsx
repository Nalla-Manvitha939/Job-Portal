import { trpc } from "@/lib/trpc";
import { COOKIE_NAME, UNAUTHED_ERR_MSG } from "@shared/const";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink, TRPCClientError } from "@trpc/client";
import { createRoot } from "react-dom/client";
import superjson from "superjson";
import { GoogleOAuthProvider } from "@react-oauth/google";
import App from "./App";
import { startLogin } from "./const";
import "./index.css";

const queryClient = new QueryClient();

const redirectToLoginIfUnauthorized = (error: unknown) => {
  if (!(error instanceof TRPCClientError)) return;
  if (typeof window === "undefined") return;

  const isUnauthorized = error.message === UNAUTHED_ERR_MSG;

  if (!isUnauthorized) return;

  startLogin();
};

queryClient.getQueryCache().subscribe((event) => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.query.state.error;
    redirectToLoginIfUnauthorized(error);
    console.error("[API Query Error]", error);
  }
});

queryClient.getMutationCache().subscribe((event) => {
  if (event.type === "updated" && event.action.type === "error") {
    const error = event.mutation.state.error;
    redirectToLoginIfUnauthorized(error);
    console.error("[API Mutation Error]", error);
  }
});

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: "/api/trpc",
      transformer: superjson,
      headers() {
        try {
          const raw = sessionStorage.getItem("manus-cookie");

          if (raw) {
            const prefix = `${COOKIE_NAME}=`;
            const pair = raw
              .split(";")
              .find((s) => s.trim().startsWith(prefix));

            const token = pair?.trim().slice(prefix.length);

            if (token) {
              return {
                Authorization: `Bearer ${token}`,
              };
            }
          }
        } catch {
          
        }

        return {};
      },

      fetch(input, init) {
        return globalThis.fetch(input, {
          ...(init ?? {}),
          credentials: "include",
        });
      },
    }),
  ],
});

if (!localStorage.getItem("users")) {
  localStorage.setItem(
    "users",
    JSON.stringify([
      {
        id: 1,
        fullName: "Administrator",
        email: "admin@jobportal.com",
        password: "admin123",
        mobile: "9999999999",
        role: "admin",
      },
      {
        id: 2,
        fullName: "Recruiter",
        email: "recruiter@jobportal.com",
        password: "recruiter123",
        mobile: "8888888888",
        role: "recruiter",
      },
      {
        id: 3,
        fullName: "Demo User",
        email: "user@jobportal.com",
        password: "user123",
        mobile: "7777777777",
        role: "user",
      },
    ])
  );
}

createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId="461631373824-8qnrjcjg94rogmittp32mocckl4c6ngd.apps.googleusercontent.com">
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </trpc.Provider>
  </GoogleOAuthProvider>
);
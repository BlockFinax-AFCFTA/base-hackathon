import { QueryClient } from "@tanstack/react-query";

type GetQueryFnOptions = {
  on401?: "throw" | "returnNull";
  on404?: "throw" | "returnNull";
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

/**
 * Creates a function that fetches from the server.
 * 
 * @param options Configuration options for the query function.
 * @returns A function that fetches from the server.
 */
export function getQueryFn(options: GetQueryFnOptions = {}) {
  return async ({ queryKey }: { queryKey: string[] }) => {
    const [endpoint] = queryKey;
    const res = await fetch(endpoint);

    if (res.status === 401 && options.on401 === "returnNull") {
      return null;
    }

    if (res.status === 404 && options.on404 === "returnNull") {
      return null;
    }

    if (!res.ok) {
      throw new Error(`Error fetching ${endpoint}: ${res.statusText}`);
    }

    return res.json();
  };
}

/**
 * Makes an API request to the server.
 * 
 * @param method The HTTP method to use.
 * @param endpoint The API endpoint to send the request to.
 * @param body The body of the request.
 * @returns The fetch response.
 */
export async function apiRequest(
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  endpoint: string,
  body?: any
) {
  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(endpoint, options);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Error ${method} ${endpoint}: ${res.statusText}`);
  }

  return res;
}
'use client'

import Provider from "./context/SessionProvider";
import "./globals.css";
import { Inter } from "next/font/google";
import Navbar from "./components/navbar/Navbar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const inter = Inter({ subsets: ["latin"] });

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider>
        <html lang="en">
          <title>Shopping App Demo</title>
          <link rel="icon" href="/shopping-cart-landing.svg" />
          <meta name="description" content="A Next.js application that allows users to create individual accounts for a simulated shopping experience!" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <body className="bg-white">
            <Navbar />
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
          </body>
        </html>
      </Provider>
    </QueryClientProvider>
  );
}

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "404 - Page Not Found | VoiceTell",
  description: "The page you are looking for does not exist.",
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-stone-100 dark:from-stone-900 dark:to-stone-800 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-stone-900 dark:text-stone-100 mb-4">
          404
        </h1>
        <h2 className="text-2xl font-semibold text-stone-700 dark:text-stone-300 mb-4">
          Page Not Found
        </h2>
        <p className="text-stone-600 dark:text-stone-400 mb-8">
          The page you are looking for does not exist.
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
}

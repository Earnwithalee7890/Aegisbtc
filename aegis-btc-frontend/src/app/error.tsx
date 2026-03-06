"use client";

import { useEffect } from "react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center text-white">
            <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
            <p className="text-surface-400 mb-8 max-w-md">{error.message || "An unexpected error occurred."}</p>
            <button
                onClick={() => reset()}
                className="px-6 py-2 bg-primary-600 rounded-xl hover:bg-primary-500 transition-colors"
            >
                Try again
            </button>
        </div>
    );
}

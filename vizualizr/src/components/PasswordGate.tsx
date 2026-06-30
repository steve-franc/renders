import { useState, type ReactNode } from "react";

const STORAGE_KEY = "viz-portal-auth";

function checkPassword(input: string): boolean {
  const expected = import.meta.env.VITE_EDITOR_PASSWORD;
  if (!expected) return false;
  return input === expected;
}

export function isUnlocked(): boolean {
  return sessionStorage.getItem(STORAGE_KEY) === "true";
}

export default function PasswordGate({ children }: { children: ReactNode }) {
  const [unlocked, setUnlocked] = useState(isUnlocked());
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);

  if (unlocked) return <>{children}</>;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (checkPassword(input)) {
      sessionStorage.setItem(STORAGE_KEY, "true");
      setUnlocked(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper-dim px-6">
      <form
        onSubmit={handleSubmit}
        className="bg-paper border border-line p-8 w-full max-w-sm"
      >
        <div className="font-mono text-[10px] text-grey tracking-wide mb-2">
          STUDIO ACCESS
        </div>
        <h1 className="font-display text-lg font-bold mb-5">Editor sign-in</h1>
        <input
          type="password"
          autoFocus
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setError(false);
          }}
          placeholder="Password"
          className="w-full border border-line bg-paper-dim px-3 py-2 text-sm mb-3 outline-none focus:border-ink"
        />
        {error && (
          <div className="font-mono text-[11px] text-marker mb-3">
            Incorrect password.
          </div>
        )}
        <button
          type="submit"
          className="w-full bg-ink text-paper font-mono text-xs py-2.5 tracking-wide"
        >
          Enter
        </button>
      </form>
    </div>
  );
}

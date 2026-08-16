import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6 pt-20">
      <p className="font-display text-accent text-2xl tracking-widest mb-2">404</p>
      <h1 className="font-display uppercase text-5xl sm:text-7xl mb-6">Wrong Turn</h1>
      <p className="text-ink/60 mb-8 max-w-sm">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link href="/" className="btn-primary">Back to Home</Link>
    </div>
  );
}

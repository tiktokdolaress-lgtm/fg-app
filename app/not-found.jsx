import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#0D0D0E] text-[#f3ead2] p-5">
      <div className="text-center">
        <h1 className="text-4xl font-display text-[#e6b84a] mb-2">404</h1>
        <p className="text-sm text-[#8E8B82] mb-4">Página não encontrada no QG.</p>
        <Link href="/" className="text-xs text-[#e6b84a] underline">Voltar ao início</Link>
      </div>
    </main>
  );
}

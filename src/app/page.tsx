import terms from "@/assets/terms.json";
import { ParliamentFigure } from "@/components/ParliamentFigure";

export default function Home() {
  const parties = terms[28];
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <ParliamentFigure
          groupBy="alliance"
          parties={parties}
        />
      </main>
    </div>
  );
}

import ShowCard from "./ShowCard";

export default function ShowGrid({ shows }) {
  if (!shows || shows.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-white/10 bg-slate-900/50 p-12 text-center">
        <p className="text-slate-400">
          No shows are available for this selection.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {shows.map((show) => (
        <ShowCard
          key={show.id}
          show={show}
        />
      ))}
    </div>
  );
}
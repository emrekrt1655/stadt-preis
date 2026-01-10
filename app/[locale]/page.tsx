import CalltoAction from "../components/CalltoAction";
import Hero from "../components/Hero";
import PopularState from "../components/PopularState";
import SearchStates from "../components/SearchStates";

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-6">
      <div className="flex flex-col lg:flex-row gap-3 items-start justify-between">
        <div className="flex-2 w-full">
          <CalltoAction />
        </div>
        <div className="flex-1 w-full flex flex-col gap-3">
          <Hero />
          <SearchStates />
          <PopularState />
        </div>
      </div>
    </main>
  );
}

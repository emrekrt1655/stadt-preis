import CalltoAction from "../components/CalltoAction";
import Hero from "../components/Hero";

export default function Home() {
  return (
    <section className="space-y-10">
      <div className="flex flex-col lg:flex-row gap-6 items-start justify-between">
        <div className="flex-1 w-full">
          <Hero />
        </div>
        <div className="flex-1 w-full">
          <CalltoAction />
        </div>
      </div>
    </section>
  );
}

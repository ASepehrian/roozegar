import CalendarApp from "@/components/CalendarApp";

// force-dynamic: "امروز" must reflect the real current moment in Tehran on
// every request, not a build-time snapshot.
export const dynamic = "force-dynamic";

export default function Home() {
  return <CalendarApp />;
}

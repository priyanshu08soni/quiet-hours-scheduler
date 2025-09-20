import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import BlockForm from "../components/BlockForm";
import BlockList from "../components/BlockList";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function Home() {
  const [session, setSession] = useState<any>(undefined); // undefined = not checked yet
  const router = useRouter();

  useEffect(() => {
    // 1️⃣ Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session); // could be null if not logged in
    });

    // 2️⃣ Listen to auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session); // session could be null
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (session === undefined) return; // still checking
    if (!session) router.push("/login"); // redirect if not logged in
  }, [session, router]);

  if (session === undefined) {
    // Loading state while checking session
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500">Checking session...</p>
      </div>
    );
  }

  if (!session) return null; // user will be redirected

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="max-w-4xl mx-auto p-6 space-y-6">
        <section>
          <h2 className="text-xl font-bold mb-4 text-gray-700">Add Quiet Hour</h2>
          <BlockForm userId={session.user.id} />
        </section>
        <section>
          <h2 className="text-xl font-bold mb-4 text-gray-700">Scheduled Blocks</h2>
          <BlockList userId={session.user.id} />
        </section>
      </main>
    </div>
  );
}

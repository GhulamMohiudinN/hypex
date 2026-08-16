import { supabase } from "./supabaseClient";

export async function loginAdmin(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function logoutAdmin() {
  const { error } = await supabase.auth.signOut();
  if (error) console.warn("Logout error:", error.message);
}

// Mirrors Firebase's onAuthStateChanged(auth, callback) shape: fires immediately with
// the current session, then again on every sign-in/sign-out, and returns a plain
// unsubscribe function (not the {data:{subscription}} wrapper Supabase itself returns)
// so every call site can keep doing `const unsub = watchAuthState(cb); ...; unsub();`.
export function watchAuthState(callback) {
  supabase.auth.getSession().then(({ data }) => {
    callback(data.session?.user ?? null);
  });

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user ?? null);
  });

  return () => subscription.unsubscribe();
}

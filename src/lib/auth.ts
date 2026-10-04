import { supabase } from "./supabase";

export async function signUp(email: string, password: string, nom: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { nom } },
  });
  return { data, error };
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

export async function signOut() {
  return await supabase.auth.signOut();
}

export async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export async function getUser() {
  const { data } = await supabase.auth.getUser();
  return data.user;
}
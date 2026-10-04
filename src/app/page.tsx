"use client";
import Intro from "@/components/Intro";
import Hero from "@/components/Hero";
import Features from "@/components/Features";

export default function Home() {
  return (
    <>
      <Intro />
      <main>
        <Hero />
        <Features />
      </main>
    </>
  );
}
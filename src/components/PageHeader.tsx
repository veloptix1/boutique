"use client";

export function Bismillah() {
  return (
    <div className="text-center mb-8">
      <div className="font-amiri text-gold text-3xl sm:text-4xl" dir="rtl">
        بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
      </div>
      <div className="w-32 h-[2px] bg-gold/40 mx-auto mt-4 rounded-full" />
    </div>
  );
}

export function EndMark() {
  return (
    <div className="mt-16 bg-emerald/5 rounded-3xl p-6 text-center border border-emerald/10">
      <p className="text-sm text-emerald-dark font-amiri font-bold">
        والله أعلم — Et Allah sait mieux
      </p>
    </div>
  );
}

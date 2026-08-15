import { useState } from "react";
import { Camera, ChevronLeft, ChevronRight } from "lucide-react";

export default function CarGallery({ images = [], name }) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <div className="aspect-[16/10] rounded-2xl bg-ink-100 flex items-center justify-center text-ink-400">
        No images
      </div>
    );
  }

  const prev = () => setActive((a) => (a === 0 ? images.length - 1 : a - 1));
  const next = () => setActive((a) => (a === images.length - 1 ? 0 : a + 1));

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-ink-100 group">
        <img src={images[active]} alt={`${name} — view ${active + 1}`} className="h-full w-full object-cover" />
        <span className="absolute bottom-3 right-3 badge bg-ink-900/70 text-white">
          <Camera className="h-3.5 w-3.5" /> {active + 1} / {images.length}
        </span>
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 shadow-soft flex items-center justify-center hover:bg-white opacity-0 group-hover:opacity-100 transition"
              aria-label="Previous photo"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 shadow-soft flex items-center justify-center hover:bg-white opacity-0 group-hover:opacity-100 transition"
              aria-label="Next photo"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`aspect-[4/3] rounded-lg overflow-hidden border-2 transition ${
                i === active ? "border-primary-800" : "border-transparent hover:border-ink-200"
              }`}
            >
              <img src={img} alt={`${name} thumbnail ${i + 1}`} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

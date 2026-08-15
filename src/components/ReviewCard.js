import { Star } from "lucide-react";
import { formatDate } from "../utils/format";

export default function ReviewCard({ review }) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary-100 text-primary-800 flex items-center justify-center font-bold text-sm">
            {review.name.charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-ink-900 text-sm">{review.name}</p>
            <p className="text-xs text-ink-500">{formatDate(review.date)}</p>
          </div>
        </div>
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star
              key={i}
              className={`h-3.5 w-3.5 ${i <= review.rating ? "text-warning-500 fill-current" : "text-ink-200"}`}
            />
          ))}
        </div>
      </div>
      <p className="text-sm text-ink-600 mt-3 leading-relaxed">{review.comment}</p>
    </div>
  );
}

import { benefits } from "@/lib/constants";

export default function Benefits() {
  return (
    <div className="my-7 grid rounded-md border border-border bg-card p-5 grid-cols-2 md:grid-cols-4">
      {benefits.map(([Icon, title, desc], index) => (
        <div
          key={title}
          className={[
            "flex items-center gap-3.5 px-0 py-3",
            "sm:px-5 sm:py-0",
            "lg:border-r lg:border-border lg:py-0",
            index === benefits.length - 1 ? "lg:border-r-0" : "",
            index === 1 ? "sm:border-r-0 lg:border-r" : "",
            index >= 2 ? "sm:border-t sm:border-border lg:border-t-0" : "",
          ].join(" ")}
        >
          <Icon
            size={24}
            strokeWidth={1.4}
            className="shrink-0 text-primary"
            aria-hidden="true"
          />

          <div className="min-w-0">
            <b className="block text-[11px] font-semibold text-foreground">
              {title}
            </b>

            <span className="mt-1.25 block text-[10px] leading-[1.4] text-muted-foreground">
              {desc}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

import Image from "next/image";
import { cn } from "@/lib/utils";

export const ImagePreview = ({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-border bg-muted",
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="100vw"
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
      <span className="absolute bottom-2 left-2 rounded-full bg-black/50 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white">
        Preview
      </span>
    </div>
  );
};

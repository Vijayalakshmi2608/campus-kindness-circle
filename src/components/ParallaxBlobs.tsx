import { useParallax } from "@/hooks/useParallax";

interface BlobConfig {
  className: string;
  speedFactor: number;
  xOffset?: number;
}

const defaultBlobs: BlobConfig[] = [
  { className: "w-64 h-64 bg-secondary/10 -top-20 -right-20 rounded-full blur-3xl", speedFactor: 0.15 },
  { className: "w-48 h-48 bg-accent/8 top-60 -left-16 rounded-full blur-3xl", speedFactor: 0.25 },
  { className: "w-56 h-56 bg-accent-2/8 top-[500px] -right-10 rounded-full blur-3xl", speedFactor: 0.1 },
];

export default function ParallaxBlobs({ blobs = defaultBlobs }: { blobs?: BlobConfig[] }) {
  const scrollY = useParallax();

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {blobs.map((blob, i) => (
        <div
          key={i}
          className={`absolute ${blob.className}`}
          style={{
            transform: `translateY(${scrollY * blob.speedFactor}px)`,
            willChange: "transform",
          }}
        />
      ))}
    </div>
  );
}

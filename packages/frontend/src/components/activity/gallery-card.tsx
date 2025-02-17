import { format } from 'date-fns';
import { Card } from '@/components/common/ui/card';
import { Separator } from '@/components/common/ui/separator';

export interface GalleryImage {
  id: string;
  url: string;
  createdAt: Date;
  alt?: string;
}

interface GalleryCardProps {
  images: GalleryImage[];
  month: Date;
}

export function GalleryCard({ images, month }: GalleryCardProps) {
  // Add a random featured index between 0 and images.length - 1
  const featuredIndex = Math.floor(Math.random() * images.length);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <h3 className="text-lg font-semibold">{format(month, 'MMMM yyyy')}</h3>
        <Separator className="flex-1" />
      </div>

      <div className="grid auto-rows-[200px] grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {images.map((image, index) => (
          <Card
            key={image.id}
            className={`overflow-hidden transition-transform hover:scale-[1.02] ${
              index === featuredIndex ? 'md:col-span-2 md:row-span-2' : ''
            }`}
          >
            <img
              src={image.url}
              alt={image.alt || `Image from ${format(image.createdAt, 'PP')}`}
              className="h-full w-full object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </Card>
        ))}
      </div>
    </div>
  );
}

import { startOfMonth } from 'date-fns';
import { GalleryCard, GalleryImage } from './gallery-card';

interface GalleryGridProps {
  images: GalleryImage[];
}

export function GalleryGrid({ images }: GalleryGridProps) {
  const groupedImages = images.reduce(
    (acc, image) => {
      const monthKey = startOfMonth(image.createdAt).getTime();
      if (!acc[monthKey]) {
        acc[monthKey] = {
          month: startOfMonth(image.createdAt),
          images: []
        };
      }
      acc[monthKey].images.push(image);
      return acc;
    },
    {} as Record<number, { month: Date; images: GalleryImage[] }>
  );

  return (
    <div className="space-y-8">
      {Object.values(groupedImages)
        .sort((a, b) => b.month.getTime() - a.month.getTime())
        .map(({ month, images }) => (
          <GalleryCard key={month.getTime()} images={images} month={month} />
        ))}
    </div>
  );
}

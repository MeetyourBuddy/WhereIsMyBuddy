import { BentoGrid, BentoGridItem } from '../common/ui/bento-grid';
import {
  IconClipboardCopy,
  IconFileBroken,
  IconSignature,
  IconTableColumn,
  IconChartBar,
  IconLeaf,
  IconBrain,
  IconCloud,
  IconShieldLock,
  IconUsers,
  IconRefresh,
  IconTools,
  IconCube,
  IconPlugConnected
} from '@tabler/icons-react';
import { Skeleton } from '../common/ui/skeleton';

export function DashboardCard() {
  const items = [
    {
      title: 'Weekly 5K Run Club',
      description:
        'Join fellow runners every Saturday morning for an energizing 5K run and post-run coffee.',
      header: <Skeleton />,
      className: 'md:col-span-2',
      icon: <IconClipboardCopy className="h-4 w-4 text-neutral-500" />,
      image:
        'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80'
    },
    {
      title: 'Meditation Circle',
      description:
        'Practice mindfulness together in our daily 30-minute guided meditation sessions.',
      header: <Skeleton />,
      className: 'md:col-span-1',
      icon: <IconFileBroken className="h-4 w-4 text-neutral-500" />,
      image:
        'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80'
    },
    {
      title: 'Code & Coffee',
      description:
        'Weekly meetups to learn programming together, from beginners to advanced developers.',
      header: <Skeleton />,
      className: 'md:col-span-1',
      icon: <IconSignature className="h-4 w-4 text-neutral-500" />,
      image:
        'https://images.unsplash.com/photo-1509343256512-d77a5cb3791b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80'
    },
    {
      title: 'Book Club Discussions',
      description: 'Monthly book discussions exploring personal growth and development literature.',
      header: <Skeleton />,
      className: 'md:col-span-2',
      icon: <IconTableColumn className="h-4 w-4 text-neutral-500" />,
      image:
        'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80'
    },
    {
      title: 'Language Exchange',
      description: 'Practice new languages with native speakers in our weekly conversation groups.',
      header: <Skeleton />,
      className: 'md:col-span-2',
      icon: <IconChartBar className="h-4 w-4 text-neutral-500" />,
      image:
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80'
    },
    {
      title: 'Urban Photography Walks',
      description:
        'Explore the city while learning photography techniques with fellow enthusiasts.',
      header: <Skeleton />,
      className: 'md:col-span-1',
      icon: <IconLeaf className="h-4 w-4 text-neutral-500" />,
      image:
        'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80'
    },
    {
      title: 'Cooking Workshop',
      description:
        'Learn to cook international cuisines together in our community kitchen sessions.',
      header: <Skeleton />,
      className: 'md:col-span-1',
      icon: <IconBrain className="h-4 w-4 text-neutral-500" />,
      image:
        'https://images.unsplash.com/photo-1555255707-c07966088b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80'
    },
    {
      title: 'Music Jam Sessions',
      description:
        'Weekly gatherings for musicians of all levels to practice and perform together.',
      header: <Skeleton />,
      className: 'md:col-span-2',
      icon: <IconCloud className="h-4 w-4 text-neutral-500" />,
      image:
        'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80'
    },
    {
      title: 'Yoga for Everyone',
      description:
        'Daily group yoga sessions for all skill levels, focusing on wellness and community.',
      header: <Skeleton />,
      className: 'md:col-span-2',
      icon: <IconShieldLock className="h-4 w-4 text-neutral-500" />,
      image:
        'https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80'
    },
    {
      title: 'Art & Wine Evenings',
      description: 'Monthly social painting sessions combining creativity with wine tasting.',
      header: <Skeleton />,
      className: 'md:col-span-1',
      icon: <IconUsers className="h-4 w-4 text-neutral-500" />,
      image:
        'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80'
    },
    {
      title: 'Public Speaking Club',
      description:
        'Bi-weekly meetings to practice presentation skills and build confidence together.',
      header: <Skeleton />,
      className: 'md:col-span-1',
      icon: <IconRefresh className="h-4 w-4 text-neutral-500" />,
      image:
        'https://images.unsplash.com/photo-1531498860502-7c67cf02f657?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80'
    },
    {
      title: 'Garden Collective',
      description: 'Community gardening project teaching sustainable growing practices.',
      header: <Skeleton />,
      className: 'md:col-span-2',
      icon: <IconTools className="h-4 w-4 text-neutral-500" />,
      image:
        'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80'
    },
    {
      title: 'Financial Literacy Group',
      description: 'Learn about investing and personal finance management with peer support.',
      header: <Skeleton />,
      className: 'md:col-span-2',
      icon: <IconCube className="h-4 w-4 text-neutral-500" />,
      image:
        'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80'
    },
    {
      title: 'DIY Craft Circle',
      description: 'Weekly crafting sessions where we learn new skills and create together.',
      header: <Skeleton />,
      className: 'md:col-span-1',
      icon: <IconPlugConnected className="h-4 w-4 text-neutral-500" />,
      image:
        'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80'
    }
  ];

  return (
    <BentoGrid className="mx-auto max-w-4xl md:auto-rows-[20rem]">
      {items.map((item, i) => (
        <BentoGridItem
          key={i}
          title={item.title}
          description={item.description}
          header={item.header}
          className={item.className}
          icon={item.icon}
          image={item.image}
        />
      ))}
    </BentoGrid>
  );
}

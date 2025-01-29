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
      title: 'The Dawn of Innovation',
      description: 'Explore the birth of groundbreaking ideas and inventions.',
      header: <Skeleton />,
      className: 'md:col-span-2',
      icon: <IconClipboardCopy className="h-4 w-4 text-neutral-500" />,
      image:
        'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80'
    },
    {
      title: 'The Digital Revolution',
      description: 'Dive into the transformative power of technology.',
      header: <Skeleton />,
      className: 'md:col-span-1',
      icon: <IconFileBroken className="h-4 w-4 text-neutral-500" />,
      image:
        'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80'
    },
    {
      title: 'The Art of Design',
      description: 'Discover the beauty of thoughtful and functional design.',
      header: <Skeleton />,
      className: 'md:col-span-1',
      icon: <IconSignature className="h-4 w-4 text-neutral-500" />,
      image:
        'https://images.unsplash.com/photo-1509343256512-d77a5cb3791b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80'
    },
    {
      title: 'The Power of Communication',
      description: 'Understand the impact of effective communication in our lives.',
      header: <Skeleton />,
      className: 'md:col-span-2',
      icon: <IconTableColumn className="h-4 w-4 text-neutral-500" />,
      image:
        'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80'
    },
    {
      title: 'Data Analytics Mastery',
      description: 'Harness the power of data to drive informed decisions.',
      header: <Skeleton />,
      className: 'md:col-span-2',
      icon: <IconChartBar className="h-4 w-4 text-neutral-500" />,
      image:
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80'
    },
    {
      title: 'Sustainable Solutions',
      description: 'Exploring eco-friendly approaches for a better tomorrow.',
      header: <Skeleton />,
      className: 'md:col-span-1',
      icon: <IconLeaf className="h-4 w-4 text-neutral-500" />,
      image:
        'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80'
    },
    {
      title: 'AI & Machine Learning',
      description: 'Unlocking the potential of artificial intelligence.',
      header: <Skeleton />,
      className: 'md:col-span-1',
      icon: <IconBrain className="h-4 w-4 text-neutral-500" />,
      image:
        'https://images.unsplash.com/photo-1555255707-c07966088b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80'
    },
    {
      title: 'Cloud Architecture',
      description: 'Building scalable and resilient cloud solutions.',
      header: <Skeleton />,
      className: 'md:col-span-2',
      icon: <IconCloud className="h-4 w-4 text-neutral-500" />,
      image:
        'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80'
    },
    {
      title: 'Cybersecurity Essentials',
      description: 'Protecting digital assets in an interconnected world.',
      header: <Skeleton />,
      className: 'md:col-span-2',
      icon: <IconShieldLock className="h-4 w-4 text-neutral-500" />,
      image:
        'https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80'
    },
    {
      title: 'UX Research',
      description: 'Understanding user needs through systematic investigation.',
      header: <Skeleton />,
      className: 'md:col-span-1',
      icon: <IconUsers className="h-4 w-4 text-neutral-500" />,
      image:
        'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80'
    },
    {
      title: 'Agile Methodologies',
      description: 'Implementing flexible and collaborative development approaches.',
      header: <Skeleton />,
      className: 'md:col-span-1',
      icon: <IconRefresh className="h-4 w-4 text-neutral-500" />,
      image:
        'https://images.unsplash.com/photo-1531498860502-7c67cf02f657?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80'
    },
    {
      title: 'DevOps Culture',
      description: 'Bridging development and operations for better delivery.',
      header: <Skeleton />,
      className: 'md:col-span-2',
      icon: <IconTools className="h-4 w-4 text-neutral-500" />,
      image:
        'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80'
    },
    {
      title: 'Blockchain Technology',
      description: 'Exploring decentralized solutions and smart contracts.',
      header: <Skeleton />,
      className: 'md:col-span-2',
      icon: <IconCube className="h-4 w-4 text-neutral-500" />,
      image:
        'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1740&q=80'
    },
    {
      title: 'API Integration',
      description: 'Connecting systems through robust API architectures.',
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

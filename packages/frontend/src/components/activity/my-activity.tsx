'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useOutsideClick } from '@/lib/hooks/use-outside-click';
import { IconButton } from '../common/ui/icon-button';
import { useNavigate, Link } from 'react-router-dom';
import { Calendar, Clock, Timer } from 'lucide-react';
import { Separator } from '../common/ui/separator';

export const MyActivity = () => {
  const navigate = useNavigate();

  return (
    <div className="container-default flex flex-col gap-4 bg-white p-6">
      <div className="mb-6 flex w-full items-center justify-end">
        <IconButton
          leftIcon="edit"
          label="Create Activity"
          className="w-fit"
          onClick={() => navigate('/activity/create')}
        />
      </div>
      <ExpandableCardDemo />
    </div>
  );
};

export function ExpandableCardDemo() {
  const [active, setActive] = useState<(typeof cards)[number] | null>(null);
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (active) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  return (
    <>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-10 bg-black/20"
        />
      )}

      <AnimatePresence mode="wait">
        {active && (
          <div className="fixed inset-0 z-[100] grid place-items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
              ref={ref}
              className="flex h-full w-full max-w-[500px] flex-col overflow-hidden bg-white dark:bg-neutral-900 sm:rounded-3xl md:h-fit md:max-h-[90%]"
            >
              <img
                src={active.src}
                alt={active.title}
                className="h-80 w-full object-cover object-top sm:rounded-tl-lg sm:rounded-tr-lg lg:h-80"
              />

              <div>
                <div className="flex items-start justify-between p-4">
                  <div className="">
                    <motion.h3 className="text-base font-medium text-neutral-700 dark:text-neutral-200">
                      {active.title}
                    </motion.h3>
                    <motion.p className="text-base text-neutral-600 dark:text-neutral-400">
                      {active.description}
                    </motion.p>
                  </div>

                  <motion.div>
                    <Link
                      to={active.ctaLink}
                      className="rounded-full bg-green-500 px-4 py-3 text-sm font-bold text-white"
                    >
                      {active.ctaText}
                    </Link>
                  </motion.div>
                </div>
                <div className="relative px-4 pt-4">
                  <motion.div className="flex h-40 flex-col items-start gap-4 overflow-auto pb-10 text-xs text-neutral-600 [-ms-overflow-style:none] [-webkit-overflow-scrolling:touch] [mask:linear-gradient(to_bottom,white,white,transparent)] [scrollbar-width:none] dark:text-neutral-400 md:h-fit md:text-sm lg:text-base">
                    {typeof active.content === 'function' ? active.content() : active.content}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <ul className="mx-auto grid w-full max-w-2xl grid-cols-1 items-start gap-4 md:grid-cols-2">
        {cards.map((card) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            onClick={() => setActive(card)}
            className="flex h-[500px] cursor-pointer flex-col rounded-xl border-2 border-neutral-100 p-4 transition-colors hover:bg-neutral-50 hover:shadow-lg dark:hover:bg-neutral-800"
          >
            <div className="flex w-full flex-col gap-4">
              <img
                src={card.src}
                alt={card.title}
                className="h-60 w-full rounded-lg object-cover object-top"
              />
              <div className="flex flex-col items-center justify-center gap-4">
                <motion.h3 className="text-center text-lg font-medium text-neutral-800 dark:text-neutral-200">
                  {card.title}
                </motion.h3>
                <motion.p className="text-center text-sm text-neutral-600 dark:text-neutral-400">
                  {card.description}
                </motion.p>

                <div className="flex flex-wrap justify-center gap-2">
                  {card.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-neutral-100 px-2 py-1 text-xs dark:bg-neutral-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex flex-row items-center gap-2 text-sm">
                  <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                    {card.groupType}
                  </p>{' '}
                  <Separator orientation="vertical" className="h-4 w-[2px]" />
                  <p className="text-sm font-semibold capitalize text-neutral-700 dark:text-neutral-300">
                    {card.joinType}
                  </p>
                </div>

                <div className="flex w-full items-center justify-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
                  <div className="flex items-center gap-2">
                    <CalendarDaysIcon className="h-4 w-4" />
                    {new Date(card.startDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <ClockIcon className="h-4 w-4" />
                    {card.timezone}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <TimerIcon className="h-4 w-4" />
                  {card.duration} minutes
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </ul>
    </>
  );
}

export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{
        opacity: 0
      }}
      animate={{
        opacity: 1
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: 0.05
        }
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};

const cards = [
  {
    title: 'Weekly Book Club Discussion',
    description: 'Join us for engaging literary conversations',
    src: '/background/action.jpg',
    groupType: 'Public',
    ctaText: 'Join Now',
    ctaLink: '/activity/book-club',
    tags: ['reading', 'discussion', 'community'],
    joinType: 'Flexible',
    startDate: '2024-04-01T18:00:00',
    duration: 60,
    timezone: 'America/New_York',
    content: () => {
      return (
        <p>
          Weekly book discussions focusing on contemporary fiction. This month we're reading "The
          Midnight Library" by Matt Haig. Open to readers of all levels.
        </p>
      );
    }
  },
  {
    title: 'Morning Yoga Session',
    description: 'Start your day with mindful movement',
    src: '/background/athlete.jpg',
    groupType: 'Private',
    ctaText: 'Join Now',
    ctaLink: '/activity/yoga',
    tags: ['wellness', 'exercise', 'mindfulness'],
    joinType: 'Fixed',
    startDate: '2024-04-02T07:00:00',
    duration: 45,
    timezone: 'America/Los_Angeles',
    content: () => {
      return (
        <p>
          Beginner-friendly yoga sessions focusing on flexibility and strength. Led by certified
          instructor Sarah Chen.
        </p>
      );
    }
  },
  {
    title: 'Tech Meetup: AI Innovation',
    description: 'Exploring the latest in artificial intelligence',
    src: '/background/balloons.jpg',
    groupType: 'Private',
    ctaText: 'Join Now',
    ctaLink: '/activity/tech-meetup',
    tags: ['technology', 'networking', 'AI'],
    joinType: 'Fixed',
    startDate: '2024-04-03T19:00:00',
    duration: 120,
    timezone: 'Europe/London',
    content: () => {
      return (
        <p>
          Monthly meetup featuring guest speakers from leading AI companies. Network with fellow
          tech enthusiasts and learn about cutting-edge developments.
        </p>
      );
    }
  },
  {
    title: 'Community Garden Workshop',
    description: 'Learn sustainable gardening practices',
    src: '/background/ski-race.jpg',
    groupType: 'Public',
    ctaText: 'Join Now',
    ctaLink: '/activity/garden',
    tags: ['gardening', 'sustainability', 'outdoor'],
    joinType: 'Flexible',
    startDate: '2024-04-04T10:00:00',
    duration: 180,
    timezone: 'Australia/Sydney',
    content: () => {
      return (
        <p>
          Hands-on workshop covering organic gardening techniques, composting, and sustainable urban
          farming practices.
        </p>
      );
    }
  },
  {
    title: 'Language Exchange: Spanish',
    description: 'Practice Spanish conversation skills',
    src: '/background/volleyball.jpg',
    groupType: 'Public',
    ctaText: 'Join Now',
    ctaLink: '/activity/spanish',
    tags: ['language', 'spanish', 'learning'],
    joinType: 'Fixed',
    startDate: '2024-04-05T17:30:00',
    duration: 90,
    timezone: 'Europe/Madrid',
    content: () => {
      return (
        <p>
          Informal Spanish language exchange for intermediate learners. Practice conversation skills
          with native speakers in a friendly environment.
        </p>
      );
    }
  }
];

const CalendarDaysIcon = Calendar;
const ClockIcon = Clock;
const TimerIcon = Timer;

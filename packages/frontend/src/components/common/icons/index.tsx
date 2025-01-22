import {
  NewspaperIcon,
  UserCircleIcon,
  SettingsIcon,
  HomeIcon,
  TicketIcon,
  ChevronLeftIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  X,
  UploadCloud,
  FileIcon,
  CheckCircle,
  AlertCircle,
  UserRoundPlus,
  Trash2Icon,
  RefreshCcw,
  InfoIcon,
  PlusCircleIcon,
  CopyIcon,
  CalendarIcon,
  SendIcon,
  EyeIcon,
  StarIcon,
  PencilIcon,
  ImageIcon,
  CalendarDaysIcon,
  CrownIcon,
  CheckIcon,
  Users,
  ClockIcon,
  BookmarkIcon,
  MessageCircleIcon,
  ThumbsUpIcon
} from 'lucide-react';

export const Icons = {
  news: NewspaperIcon,
  events: TicketIcon,
  profile: UserCircleIcon,
  settings: SettingsIcon,
  resources: StarIcon,
  home: HomeIcon,
  chevronLeft: ChevronLeftIcon,
  arrowLeft: ArrowLeftIcon,
  arrowRight: ArrowRightIcon,
  uploadCloud: UploadCloud,
  x: X,
  fileIcon: FileIcon,
  calendar: CalendarIcon,
  checkCircle: CheckCircle,
  alertCircle: AlertCircle,
  userRoundPlus: UserRoundPlus,
  delete: Trash2Icon,
  refresh: RefreshCcw,
  info: InfoIcon,
  plusCircle: PlusCircleIcon,
  copy: CopyIcon,
  send: SendIcon,
  eye: EyeIcon,
  star: StarIcon,
  edit: PencilIcon,
  image: ImageIcon,
  check: CheckIcon,
  calendarDays: CalendarDaysIcon,
  crown: CrownIcon,
  userCircle: UserCircleIcon,
  users: Users,
  clock: ClockIcon,
  thumbsUp: ThumbsUpIcon,
  messageCircle: MessageCircleIcon,
  bookmark: BookmarkIcon,
  support: ({ ...props }) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M11.42 15.17L17.25 21C17.75 21.484 18.4202 21.7521 19.1161 21.7465C19.812 21.7408 20.4777 21.4619 20.9698 20.9698C21.4619 20.4777 21.7408 19.812 21.7465 19.1161C21.7521 18.4202 21.484 17.75 21 17.25L15.123 11.373M11.42 15.17L13.916 12.14C14.233 11.756 14.656 11.514 15.124 11.374C15.674 11.21 16.287 11.186 16.867 11.234C17.6488 11.3011 18.4346 11.1627 19.1464 10.8323C19.8582 10.502 20.4712 9.99124 20.9246 9.35081C21.3781 8.71037 21.6562 7.9625 21.7313 7.1814C21.8065 6.4003 21.676 5.61313 21.353 4.898L18.077 8.175C17.5289 8.04826 17.0274 7.77016 16.6296 7.37238C16.2318 6.97459 15.9537 6.4731 15.827 5.925L19.103 2.649C18.3879 2.32596 17.6007 2.19554 16.8196 2.27068C16.0385 2.34582 15.2906 2.62391 14.6502 3.07735C14.0098 3.53079 13.499 4.14381 13.1687 4.8556C12.8383 5.56738 12.6999 6.35317 12.767 7.135C12.858 8.211 12.696 9.399 11.863 10.085L11.761 10.17M11.42 15.17L6.765 20.823C6.53939 21.098 6.2587 21.3227 5.94099 21.4827C5.62329 21.6427 5.27561 21.7344 4.92033 21.7518C4.56505 21.7693 4.21005 21.7122 3.87817 21.5842C3.54629 21.4562 3.24489 21.2602 2.99336 21.0086C2.74184 20.7571 2.54577 20.4557 2.41776 20.1238C2.28976 19.792 2.23266 19.4369 2.25015 19.0817C2.26764 18.7264 2.35932 18.3787 2.51929 18.061C2.67927 17.7433 2.90399 17.4626 3.179 17.237L10.016 11.607L5.909 7.5H4.5L2.25 3.75L3.75 2.25L7.5 4.5V5.909L11.76 10.169L10.015 11.606M18.375 18.375L15.75 15.75M4.867 19.125H4.875V19.133H4.867V19.125Z"
        stroke="#F4F5F7"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      />
    </svg>
  ),
  informationCircle: ({ ...props }) => (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M7.5 8L7.52766 7.98617C7.90974 7.79513 8.33994 8.14023 8.23634 8.55465L7.76366 10.4453C7.66006 10.8598 8.09026 11.2049 8.47234 11.0138L8.5 11M14 8.5C14 11.8137 11.3137 14.5 8 14.5C4.68629 14.5 2 11.8137 2 8.5C2 5.18629 4.68629 2.5 8 2.5C11.3137 2.5 14 5.18629 14 8.5ZM8 6H8.005V6.005H8V6Z"
        stroke="#F43F5E"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
};

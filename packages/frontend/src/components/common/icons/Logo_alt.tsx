const Logo_alt = ({ ...props }) => {
  return (
    <svg fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M28 14C28 21.732 21.732 28 14 28C6.26801 28 0 21.732 0 14C0 6.26801 6.26801 0 14 0C21.732 0 28 6.26801 28 14Z"
        fill="#0E1125"
      />
      <path d="M21.7942 9.5L14 23L6.20577 9.5L21.7942 9.5Z" stroke="white" />
      <path d="M7 10L14 14.5L21.5 10" stroke="white" strokeLinecap="round" />
      <path d="M14 14.5V22.5" stroke="white" strokeLinecap="round" />
    </svg>
  );
};

export default Logo_alt;

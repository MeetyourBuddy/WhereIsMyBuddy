const Back = ({ ...props }) => {
  return (
    <div>
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <g clip-path="url(#clip0_5_3113)">
          <path
            d="M5 12H19"
            stroke="#C4C4C4"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            {...props}
          />
          <path
            d="M12 5L5 12L12 19"
            stroke="#C4C4C4"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            {...props}
          />
        </g>
        <defs>
          <clipPath id="clip0_5_3113">
            <rect width="24" height="24" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
};

export default Back;

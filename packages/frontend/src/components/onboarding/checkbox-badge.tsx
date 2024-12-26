import { Checkbox, cn } from '@nextui-org/react';

export const CustomCheckbox = ({ value }: { value: string }) => {
  return (
    <Checkbox
      aria-label="options"
      classNames={{
        base: cn(
          'inline-flex  w-full m-0',
          'hover:bg-primary/40 items-center',
          'cursor-pointer gap-2 p-2 border-2 border-gray-200 rounded-full',
          'data-[selected=true]:border-primary'
        )
      }}
      value={value}
    >
      <div className="flex w-full justify-between gap-2">{value}</div>
    </Checkbox>
  );
};

import React from 'react';
import { Image } from '@nextui-org/react';
import { Button } from '@nextui-org/react';

const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[url('/background/background-with-dots.png')] bg-cover bg-center">
      <div className="flex flex-col items-center gap-[13vw]">
        <div className="">
          <Image src={'/not-found/404.png'} className="max-h-[450px]" alt="login image" />
        </div>
        <div className="flex w-[280px] flex-col items-center gap-5">
          <p className="font-rub font-semibold tracking-widest text-not-found">
            OPPS! PAGE NOT FOUND
          </p>
          <Button
            type="submit"
            radius="sm"
            className="text-md w-full rounded-lg bg-signin-blue text-white"
            size="md"
          >
            Go Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

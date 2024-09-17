import React, { ReactNode } from 'react';
import { Image } from '@nextui-org/react';
import Logo_svg from '../common/icons/Logo_svg';

interface AuthLayoutProps {
  children: ReactNode;
  imageSrc: string;
}

const AuthLayout = ({ children, imageSrc }: AuthLayoutProps) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="m-8 flex h-full w-full max-w-[1200px] flex-row">
        <div className="flex h-full basis-1/2 flex-col items-center justify-center">
          <div className="mb-[110px]">
            <Logo_svg />
          </div>
          <div>{children}</div>
        </div>
        <div className="basis-1/2">
          <Image src={imageSrc} className="min-h-[850px]" alt="login image" isZoomed />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

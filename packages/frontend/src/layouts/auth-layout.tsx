import { ReactNode } from 'react';
import { Image } from '@nextui-org/react';
import Logo_svg from '../components/common/icons/Logo_svg';

interface AuthLayoutProps {
  children: ReactNode;
  imageSrc: string;
}

const AuthLayout = ({ children, imageSrc }: AuthLayoutProps) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[url('/background/background-with-spline.png')] bg-cover bg-center">
      <div className="flex h-full w-full max-w-[1200px] flex-row rounded-xl bg-white p-4 shadow-xl shadow-gray-300">
        <div className="flex h-full basis-1/2 flex-col items-center justify-center">
          <div className="mb-[80px]">
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

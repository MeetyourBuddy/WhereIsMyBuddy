import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[url('/background/background-with-spline.png')] bg-cover bg-center">
      <div className="flex h-full w-full max-w-[1200px] flex-row rounded-xl bg-white p-4 shadow-xl shadow-gray-300">
        <div className="flex h-full basis-1/2 flex-col items-center justify-center">
          <div className="relative my-10 h-[100px] w-[200px]">
            <img src="/logo/logo.png" className="h-full w-full object-contain" alt="logo" />
          </div>
          <div>
            <Outlet />
          </div>
        </div>
        <div className="relative min-h-[850px] basis-1/2 overflow-hidden rounded-lg">
          <img
            src="/signin/signin_art.jpeg"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            alt="login image"
          />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

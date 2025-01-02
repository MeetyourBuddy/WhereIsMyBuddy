import { Button } from '@/components/common/ui/button';

const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[url('/background/background-with-dots.png')] bg-cover bg-center">
      <div className="flex flex-col items-center gap-[13vw]">
        <div>
          <img
            src="/not-found/404.png"
            width={450}
            height={450}
            className="h-auto max-h-[450px] w-auto"
            alt="404 not found illustration"
          />
        </div>
        <div className="flex w-[280px] flex-col items-center gap-5">
          <p className="font-semibold tracking-widest text-foreground/80">OOPS! PAGE NOT FOUND</p>
          <Button onClick={() => window.history.back()} className="w-full">
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

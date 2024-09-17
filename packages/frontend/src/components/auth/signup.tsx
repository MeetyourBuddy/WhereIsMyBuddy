import { Button } from '@nextui-org/react';
import { Input } from '@nextui-org/react';
import React from 'react';
import Google_svg from '../common/icons/Google_logo';
import Discord_svg from '../common/icons/Discord_logo';

const Signupform = () => {
  return (
    <div className="flex min-w-[388px] flex-col space-y-4">
      <div>
        <label className="text-base">Name</label>
        <Input variant="bordered" radius="sm" type="Name" placeholder="John" />
      </div>
      <div>
        <label className="text-base">Email</label>
        <Input variant="bordered" radius="sm" type="Email" placeholder="Example@gmail.com" />
      </div>
      <div>
        <label className="-sm text-base">Password</label>
        <Input variant="bordered" radius="sm" type="Password" placeholder="At least 8 characters" />
      </div>
      <Button radius="sm" className="rounded-lg bg-signin-blue text-white" size="md">
        Sign in
      </Button>
      <div className="flex flex-col items-center">
        <p className="text-sm">
          By clicking Sign up,you agree to our{' '}
          <a href="#" className="text-blue-600">
            Terms of Use
          </a>
        </p>
        <p className="text-sm">
          and{' '}
          <a href="#" className="text-blue-600">
            Privacy Policy
          </a>
        </p>
      </div>

      <div className="inline-flex items-center justify-center">
        <hr className="h-px w-full border-0 bg-gray-200 dark:bg-gray-700" />
        <span className="mx-4 my-2 text-sm">Or</span>
        <hr className="h-px w-full border-0 bg-gray-200 dark:bg-gray-700" />
      </div>

      <div className="flex flex-col items-center space-y-6">
        <Button
          className="w-full bg-google-button hover:bg-secondary-50"
          radius="sm"
          startContent={<Google_svg />}
          size="md"
        >
          Sign in with Google
        </Button>
        <Button
          className="w-full bg-google-button hover:bg-secondary-50"
          radius="sm"
          startContent={<Discord_svg />}
          size="md"
        >
          Sign in with Discord
        </Button>
        <p className="pt-[10px]">
          Already have an account?{' '}
          <a href="#" className="text-blue-600">
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signupform;

import React from 'react';
import { Input } from '@nextui-org/input';
import { Button } from '@nextui-org/react';
import Google_svg from '../common/icons/Google_logo';
import Discord_svg from '../common/icons/Discord_logo';

const AuthForm = () => {
  return (
    <div className="flex min-w-[388px] flex-col space-y-6">
      <div>
        <label className="text-base">Email</label>
        <Input variant="bordered" radius="sm" type="Email" placeholder="Example@gmail.com" />
      </div>
      <div>
        <label className="-sm text-base">Password</label>
        <Input variant="bordered" radius="sm" type="Password" placeholder="At least 8 characters" />
      </div>
      <a href="" className="mb-3 text-right text-sm text-blue-600">
        Forgot Password?
      </a>
      <Button radius="sm" className="rounded-lg bg-signin-blue text-white" size="md">
        Sign in
      </Button>

      <div className="inline-flex items-center justify-center">
        <hr className="h-px w-full border-0 bg-gray-200 dark:bg-gray-700" />
        <span className="mx-4 my-4 text-sm">Or</span>
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
        <p className="pt-[24px]">
          Don't you have an account?{' '}
          <a href="#" className="text-blue-600">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;

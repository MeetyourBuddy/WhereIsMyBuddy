import React from 'react';
import { Input } from '@nextui-org/input';
import { Button } from '@nextui-org/react';

const ForgotPasswordForm = () => {
  return (
    <div className="flex min-w-[388px] flex-col space-y-6">
      <div>
        <label className="-sm text-base">Email</label>
        <Input variant="bordered" radius="sm" type="Email" placeholder="Example@email.com" />
      </div>
      <div className="pt-6">
        <Button radius="sm" className="w-full rounded-lg bg-signin-blue text-white" size="md">
          Request Password Reset Link
        </Button>
      </div>
      <div className="flex flex-col items-center space-y-6">
        <p className="pt-[24px]">
          Go back to{' '}
          <a href="#" className="text-blue-600">
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;

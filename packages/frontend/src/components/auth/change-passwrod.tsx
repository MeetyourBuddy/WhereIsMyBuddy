import React from 'react';
import { Input } from '@nextui-org/input';
import { Button } from '@nextui-org/react';
import Google_svg from '../common/icons/Google_logo';
import Discord_svg from '../common/icons/Discord_logo';

const ChangePasswordForm = () => {
  return (
    <div className="flex min-w-[388px] flex-col space-y-6">
      <div>
        <label className="-sm text-base">Old Password</label>
        <Input variant="bordered" radius="sm" type="Password" placeholder="At least 8 characters" />
      </div>
      <div>
        <label className="-sm text-base">New Password</label>
        <Input variant="bordered" radius="sm" type="Password" placeholder="At least 8 characters" />
      </div>
      <div>
        <label className="-sm text-base">Confirm Password</label>
        <Input variant="bordered" radius="sm" type="Password" placeholder="At least 8 characters" />
      </div>
      <div className="pt-6">
        <Button radius="sm" className="w-full rounded-lg bg-signin-blue text-white" size="md">
          Change Password
        </Button>
      </div>

      <div className="flex flex-col items-center space-y-6">
        <p className="pt-[24px]">
          Go back to{' '}
          <a href="#" className="text-blue-600">
            Settings
          </a>
        </p>
      </div>
    </div>
  );
};

export default ChangePasswordForm;

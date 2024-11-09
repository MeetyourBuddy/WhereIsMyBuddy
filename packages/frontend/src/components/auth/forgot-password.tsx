import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input, Button } from '@nextui-org/react';
import { forgotPasswordSchema } from '../../libs/validation/auth-validation';

const ForgotPasswordForm = () => {
  const { control, handleSubmit } = useForm({
    resolver: zodResolver(forgotPasswordSchema)
  });

  const onSubmit = (data) => {
    console.log('Forgot password data:', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex min-w-[388px] flex-col space-y-6">
      <div>
        <Controller
          name="email"
          control={control}
          defaultValue=""
          render={({ field, fieldState: { error } }) => (
            <Input
              {...field}
              label="Email"
              variant="bordered"
              radius="sm"
              type="email"
              labelPlacement="outside"
              isInvalid={!!error}
              placeholder="Example@email.com"
              errorMessage={error && error.message}
            />
          )}
        />
      </div>
      <div className="pt-6">
        <Button
          type="submit"
          radius="sm"
          className="text-md w-full rounded-lg bg-signin-blue text-white"
          size="md"
        >
          Request Password Reset Link
        </Button>
      </div>
      <div className="flex flex-col items-center space-y-6">
        <p className="pt-[24px]">
          Go back to{' '}
          <a href="/signin" className="text-blue-600">
            Sign In
          </a>
        </p>
      </div>
    </form>
  );
};

export default ForgotPasswordForm;

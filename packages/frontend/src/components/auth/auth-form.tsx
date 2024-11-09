import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input, Button } from '@nextui-org/react';
import Google_svg from '../common/icons/Google_logo';
import Discord_svg from '../common/icons/Discord_logo';
import { useLocation } from 'react-router-dom';
import { authValidationSchema } from '../../libs/validation/auth-validation';

const AuthForm = () => {
  const { pathname } = useLocation();
  const isSignup = pathname === '/signup';

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(authValidationSchema)
  });

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex min-w-[388px] flex-col space-y-6">
      {isSignup && (
        <div>
          <Controller
            name="name"
            control={control}
            defaultValue=""
            render={({ field, fieldState: { error } }) => (
              <Input
                {...field}
                isRequired
                label="Name"
                variant="bordered"
                radius="sm"
                placeholder="John"
                labelPlacement="outside"
                isInvalid={!!error}
                errorMessage={error && error.message}
              />
            )}
          />
        </div>
      )}
      <div>
        <Controller
          name="email"
          control={control}
          defaultValue=""
          render={({ field, fieldState: { error } }) => (
            <Input
              {...field}
              isRequired
              label="Email"
              variant="bordered"
              radius="sm"
              placeholder="Example@gmail.com"
              labelPlacement="outside"
              isInvalid={!!error}
              errorMessage={error && error.message}
            />
          )}
        />
      </div>

      <div>
        <Controller
          name="password"
          control={control}
          defaultValue=""
          render={({ field, fieldState: { error } }) => (
            <Input
              {...field}
              isRequired
              label="Password"
              type="password"
              variant="bordered"
              radius="sm"
              placeholder="At least 8 characters"
              labelPlacement="outside"
              isInvalid={!!error}
              errorMessage={error && error.message}
            />
          )}
        />
      </div>
      {!isSignup && (
        <div className="mb-3 text-right text-sm text-blue-600">
          <a href="/forgot-password">Forgot Password?</a>
        </div>
      )}
      <Button
        type="submit"
        radius="sm"
        className="text-md rounded-lg bg-signin-blue text-white"
        size="md"
      >
        {isSignup ? 'Sign up' : 'Sign in'}
      </Button>
      <div className="inline-flex items-center justify-center">
        <hr className="h-px w-full border-0 bg-gray-200 dark:bg-gray-700" />
        <span className="mx-4 my-4 text-sm">Or</span>
        <hr className="h-px w-full border-0 bg-gray-200 dark:bg-gray-700" />
      </div>

      <div className="flex flex-col items-center space-y-6">
        <Button
          className="text-md w-full bg-google-button hover:bg-secondary-50"
          radius="sm"
          startContent={<Google_svg />}
          size="md"
        >
          Sign in with Google
        </Button>

        <Button
          className="text-md w-full bg-google-button hover:bg-secondary-50"
          radius="sm"
          startContent={<Discord_svg />}
          size="md"
        >
          Sign in with Discord
        </Button>

        <p className="pt-[24px]">
          Don't you have an account?{' '}
          <a href={isSignup ? '/signin' : '/signup'} className="text-blue-600">
            {isSignup ? 'Sign in' : 'Sign up'}
          </a>
        </p>
      </div>
    </form>
  );
};

export default AuthForm;

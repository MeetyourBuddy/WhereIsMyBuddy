import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input, Button } from '@nextui-org/react';
import Google_svg from '../common/icons/Google_logo';
import { useLocation } from 'react-router-dom';
import { authValidationSchema } from '../../libs/validation/auth-validation';
import { useAuth } from '@/libs/hooks/use-auth';
import { SignInCredentials, SignUpData } from '@/types/auth-types';

type FormData = SignInCredentials | SignUpData;

const AuthForm = () => {
  const { pathname } = useLocation();
  const isSignup = pathname === '/signup';

  const { login, register } = useAuth();

  const { control, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(authValidationSchema),
    defaultValues: {
      email: '',
      password: '',
      ...(isSignup && { name: '' })
    }
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log(data);
    if (isSignup) {
      register(data as SignUpData);
    } else {
      login(data as SignInCredentials);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex min-w-[388px] flex-col space-y-6">
      {isSignup && (
        <div>
          <Controller
            name="name"
            control={control}
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
                errorMessage={error?.message}
              />
            )}
          />
        </div>
      )}
      <div>
        <Controller
          name="email"
          control={control}
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
              errorMessage={error?.message}
            />
          )}
        />
      </div>

      <div>
        <Controller
          name="password"
          control={control}
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
              errorMessage={error?.message}
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

import { Input } from '@nextui-org/input';
import { Button } from '@nextui-org/react';
import Google_svg from '../common/icons/Google_logo';
import Discord_svg from '../common/icons/Discord_logo';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signinSchema } from '@/lib/validation/auth-schema';
interface AuthFormInputs {
  email: string;
  password: string;
}

const AuthForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<AuthFormInputs>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = (data: AuthFormInputs) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex min-w-[388px] flex-col space-y-6">
      <div>
        <label className="text-base">Email</label>
        <Controller
          name="email"
          control={control}
          rules={{
            required: 'Email is required',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Enter a valid email'
            }
          }}
          render={({ field }) => (
            <Input
              {...field}
              variant="bordered"
              radius="sm"
              type="email"
              placeholder="Example@gmail.com"
              isInvalid={!!errors.email}
            />
          )}
        />
        {errors.email && <span className="text-sm text-red-500">{errors.email.message}</span>}
      </div>

      <div>
        <label className="text-base">Password</label>
        <Controller
          name="password"
          control={control}
          rules={{
            required: 'Password is required',
            minLength: {
              value: 8,
              message: 'Password must be at least 8 characters long'
            }
          }}
          render={({ field }) => (
            <Input
              {...field}
              variant="bordered"
              radius="sm"
              type="password"
              placeholder="At least 8 characters"
              isInvalid={!!errors.password}
            />
          )}
        />
        {errors.password && <span className="text-sm text-red-500">{errors.password.message}</span>}
      </div>

      <a href="#" className="mb-3 text-right text-sm text-blue-600">
        Forgot Password?
      </a>

      <Button type="submit" radius="sm" className="rounded-lg bg-signin-blue text-white" size="md">
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
          Don't have an account?{' '}
          <a href="/signup" className="text-blue-600">
            Sign up
          </a>
        </p>
      </div>
    </form>
  );
};

export default AuthForm;

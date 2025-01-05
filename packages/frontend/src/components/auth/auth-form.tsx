import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/common/ui/button';
import { Input } from '@/components/common/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/common/ui/form';
import { Separator } from '@/components/common/ui/separator';
import Google_svg from '../common/icons/Google_logo';
import { useLocation } from 'react-router-dom';
import { authValidationSchema } from '../../lib/validation/auth-validation';
import { useAuth } from '@/lib/hooks/use-auth';
import { SignInCredentials, SignUpData } from '@/types/auth-types';
import { config } from '@/config';

type FormData = SignInCredentials | SignUpData;

const AuthForm = () => {
  const { pathname } = useLocation();
  const isSignup = pathname === '/signup';
  const { login, register } = useAuth();

  const form = useForm<FormData>({
    resolver: zodResolver(authValidationSchema),
    defaultValues: {
      email: '',
      password: '',
      ...(isSignup && { name: '' })
    }
  });

  const handleGoogleSignin = () => {
    window.open(`${config.api.baseURL}/auth/google`, '_self');
  };

  const onSubmit = (data: FormData) => {
    console.log(data);
    if (isSignup) {
      register(data as SignUpData);
    } else {
      login(data as SignInCredentials);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex min-w-[388px] flex-col space-y-6"
      >
        {isSignup && (
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">Name</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">Email</FormLabel>
              <FormControl>
                <Input placeholder="example@gmail.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="At least 8 characters" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {!isSignup && (
          <div className="text-right text-sm">
            <a href="/forgot-password" className="text-primary hover:underline">
              Forgot Password?
            </a>
          </div>
        )}

        <Button type="submit" className="w-full">
          {isSignup ? 'Sign up' : 'Sign in'}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or</span>
          </div>
        </div>

        <div className="flex flex-col items-center space-y-6">
          <Button variant="outline" className="w-full" onClick={handleGoogleSignin} type="button">
            <Google_svg className="mr-2 h-4 w-4" />
            Sign in with Google
          </Button>

          <p className="pt-6">
            {`Don't you have an account? `}
            <a href={isSignup ? '/signin' : '/signup'} className="text-primary hover:underline">
              {isSignup ? 'Sign in' : 'Sign up'}
            </a>
          </p>
        </div>
      </form>
    </Form>
  );
};

export default AuthForm;

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema } from '../../lib/validation/auth-validation';
import { Button } from '@/components/common/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/common/ui/form';
import { Input } from '@/components/common/ui/input';
import type { z } from 'zod';
import { Link } from 'react-router-dom';

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordForm = () => {
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: ''
    }
  });

  function onSubmit(data: ForgotPasswordFormValues) {
    console.log('Forgot password data:', data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="min-w-[388px] space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" placeholder="example@email.com" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="pt-6">
          <Button type="submit" className="w-full">
            Request Password Reset Link
          </Button>
        </div>

        <div className="flex flex-col items-center space-y-6">
          <p className="pt-6">
            Go back to{' '}
            <Link to="/signin" className="text-primary">
              Sign In
            </Link>
          </p>
        </div>
      </form>
    </Form>
  );
};

export default ForgotPasswordForm;

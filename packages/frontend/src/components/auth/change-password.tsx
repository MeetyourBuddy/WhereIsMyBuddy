import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { changePasswordSchema } from '../../lib/validation/auth-validation';
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

// Define type for the form values
type ChangePasswordValues = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const ChangePasswordForm = () => {
  const form = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  function onSubmit(data: ChangePasswordValues) {
    console.log('Change password data:', data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-[388px] space-y-6">
        <FormField
          control={form.control}
          name="oldPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Old Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="At least 8 characters" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="At least 8 characters" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="At least 8 characters" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="pt-6">
          <Button type="submit" className="w-full">
            Change Password
          </Button>
        </div>

        <div className="flex flex-col items-center space-y-6">
          <p className="pt-6">
            Go back to{' '}
            <a href="/settings" className="text-primary">
              Settings
            </a>
          </p>
        </div>
      </form>
    </Form>
  );
};

export default ChangePasswordForm;

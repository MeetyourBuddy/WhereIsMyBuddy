import { useForm, Controller, FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input, Button } from '@nextui-org/react';
import { changePasswordSchema } from '../../libs/validation/auth-validation';

const ChangePasswordForm = () => {
  const { control, handleSubmit } = useForm({
    resolver: zodResolver(changePasswordSchema)
  });

  const onSubmit = (data: FieldValues) => {
    console.log('Change password data:', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex min-w-[388px] flex-col space-y-6">
      <div>
        <label className="-sm text-base">Old Password</label>
        <Controller
          name="oldPassword"
          control={control}
          defaultValue=""
          render={({ field, fieldState: { error } }) => (
            <Input
              {...field}
              type="password"
              variant="bordered"
              radius="sm"
              placeholder="At least 8 characters"
              isInvalid={!!error}
              errorMessage={error && error.message}
            />
          )}
        />
      </div>

      <div>
        <label className="-sm text-base">New Password</label>
        <Controller
          name="newPassword"
          control={control}
          defaultValue=""
          render={({ field, fieldState: { error } }) => (
            <Input
              {...field}
              type="password"
              variant="bordered"
              radius="sm"
              placeholder="At least 8 characters"
              isInvalid={!!error}
              errorMessage={error && error.message}
            />
          )}
        />
      </div>

      <div>
        <label className="-sm text-base">Confirm Password</label>
        <Controller
          name="confirmPassword"
          control={control}
          defaultValue=""
          render={({ field, fieldState: { error } }) => (
            <Input
              {...field}
              type="password"
              variant="bordered"
              radius="sm"
              placeholder="At least 8 characters"
              isInvalid={!!error}
              errorMessage={error && error.message}
            />
          )}
        />
      </div>

      <div className="pt-6">
        <Button
          type="submit"
          radius="sm"
          className="w-full rounded-lg bg-signin-blue text-white"
          size="md"
        >
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
    </form>
  );
};

export default ChangePasswordForm;

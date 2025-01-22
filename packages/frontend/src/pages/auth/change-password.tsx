import PageIntro from '@/components/auth/page-intro';
import ChangePasswordForm from '@/components/auth/change-password';

const ChangePassword = () => {
  return (
    <div>
      <PageIntro title="Change Password" description="Enter old and new password below to change" />
      <ChangePasswordForm />
    </div>
  );
};

export default ChangePassword;

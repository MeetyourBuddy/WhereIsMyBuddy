import PageIntro from '@/components/auth/page-intro';
import ForgotPasswordForm from '@/components/auth/forgot-password';

const ForgotPassword = () => {
  return (
    <div>
      <PageIntro title="Forgot Password" description="Enter password reset email below" />
      <ForgotPasswordForm />
    </div>
  );
};

export default ForgotPassword;

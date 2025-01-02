import PageIntro from '@/components/auth/page-intro';
import AuthForm from '@/components/auth/auth-form';

const Signup = () => {
  return (
    <div>
      <PageIntro title="Get Started!" description="Sign up to get matched to a buddy" />
      <AuthForm />
    </div>
  );
};

export default Signup;

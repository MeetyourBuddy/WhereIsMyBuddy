import PageIntro from '@/components/auth/page-intro';
import AuthForm from '@/components/auth/auth-form';

const Signin = () => {
  return (
    <div>
      <PageIntro title="Welcome Back!" description="Sign in to connect with your buddy" />
      <AuthForm />
    </div>
  );
};

export default Signin;

import React from 'react';
import AuthLayout from '../../layouts/auth-layout';
import PageIntro from '../../components/auth/page-intro';
import AuthForm from '../../components/auth/auth-form';

const Signup = () => {
  return (
    <AuthLayout imageSrc="/signup/signup_art.png">
      <PageIntro title="Get Started!" description="Sign up to get matched to a buddy" />
      <AuthForm />
    </AuthLayout>
  );
};

export default Signup;

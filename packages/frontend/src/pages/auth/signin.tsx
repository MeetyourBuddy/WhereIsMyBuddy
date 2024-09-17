import React from 'react';
import AuthLayout from '../../components/layouts/auth-layout';
import PageIntro from '../../components/auth/page-intro';
import AuthForm from '../../components/auth/auth-form';

const Signin = () => {
  return (
    <AuthLayout imageSrc="/signin/login_art.jpeg">
      <PageIntro title="Welcome Back!" description="Sign in to connect with your buddy" />
      <AuthForm />
    </AuthLayout>
  );
};

export default Signin;

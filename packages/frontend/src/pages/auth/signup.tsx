import React from 'react';
import Signupform from '../../components/auth/signup';
import AuthLayout from '../../components/layouts/auth-layout';
import PageIntro from '../../components/auth/page-intro';

const Signup = () => {
  return (
    <AuthLayout imageSrc="/signup/Login_Art2.png">
      <PageIntro title="Get Started!" description="Sign up to get matched to a buddy" />
      <Signupform />
    </AuthLayout>
  );
};

export default Signup;

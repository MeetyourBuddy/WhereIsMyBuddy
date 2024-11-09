import React from 'react';
import AuthLayout from '../../layouts/auth-layout';
import PageIntro from '../../components/auth/page-intro';
import ForgotPasswordForm from '../../components/auth/forgot-password';

const ForgotPassword = () => {
  return (
    <AuthLayout imageSrc="/forgot-password/forgot_password_art.png">
      <PageIntro title="Forgot Password" description="Enter password reset email below" />
      <ForgotPasswordForm />
    </AuthLayout>
  );
};

export default ForgotPassword;

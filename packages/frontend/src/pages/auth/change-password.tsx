import React from 'react';
import AuthLayout from '../../components/layouts/auth-layout';
import PageIntro from '../../components/auth/page-intro';
import ChangePasswordForm from '../../components/auth/change-passwrod';

const ChangePassword = () => {
  return (
    <AuthLayout imageSrc="/change-password/change_password_art.png">
      <PageIntro title="Change Password" description="Enter old and new password below to change" />
      <ChangePasswordForm />
    </AuthLayout>
  );
};

export default ChangePassword;

import React from 'react';

interface PageIntroProps {
  title: string;
  description: string;
}

const PageIntro = ({ title, description }: PageIntroProps) => {
  return (
    <div className="mb-6">
      <h1 className="text-4xl font-semibold">{title}</h1>
      <p className="mt-4 text-xl">{description}</p>
    </div>
  );
};

export default PageIntro;

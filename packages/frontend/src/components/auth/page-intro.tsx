interface PageIntroProps {
  title: string;
  description: string;
}

const PageIntro = ({ title, description }: PageIntroProps) => {
  return (
    <div className="mb-4 space-y-2">
      <h1 className="scroll-m-20 font-bold">{title}</h1>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default PageIntro;

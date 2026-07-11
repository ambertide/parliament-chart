import { useTranslations } from "next-intl";
import { ComponentProps, FC, ReactNode } from "react";
import XIcon from '@/assets/images/icons/xIcon.svg';
import GithubWhiteIcon from '@/assets/images/icons/githubWhiteIcon.svg';
import MastadonIcon from '@/assets/images/icons/mastadonIcon.svg';
import { SectionWrapper } from "./SectionWrapper";

const SocialButton: FC<{ title: string, icon: React.ReactNode } & ComponentProps<'a'>> = ({
  title,
  icon,
  href
}) => {
  return <a
    className="flex flex-row gap-2 font-serif text-base text-foreground items-start px-2 py-1 bg-background-secondary"
    href={href}
  >
    <span>{icon}</span>
    {title}
  </a>;
};

const SocialIcons: Record<string, ReactNode> = {
  "x": <XIcon height={20}/>,
  "mastadon": <MastadonIcon height={20} />,
  "github": <GithubWhiteIcon height={20} />,
  "rss": <span className="text-xl text-[F26522] font-[Material_Symbols_Outlined]">&#xe0e5;</span>,
  "email": <span className="text-xl text-foreground font-[Material_Symbols_Outlined">&#xf187;</span>
};

export const SocialsSection = () => {
  const t = useTranslations('Sections');
  return <SectionWrapper
    title={t('Follow on Socials')}
  >
    <div className="grow flex-col gap-1 items-stretch">
      <SocialButton title={t('Follow on X')} icon={SocialIcons.x} href="https://x.com/parlichartcom" />
      <SocialButton title={t('Browse on GitHub')} icon={SocialIcons.github} href="https://github.com/ambertide/parlichart" />
      <SocialButton title={t('Follow on Mastadon')} icon={SocialIcons.x} href="" />
      <SocialButton title={t('Subscribe to RSS')} icon={SocialIcons.x} href="" />
      <SocialButton title={t('Contact us On Email')} icon={SocialIcons.x} href="mailto:contact@mail.parlichart.com" />
    </div>
  </SectionWrapper>;
};

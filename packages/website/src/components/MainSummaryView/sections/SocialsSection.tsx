import { useTranslations } from "next-intl";
import { ComponentProps, FC } from "react";
import XIcon from '@/assets/images/icons/xIcon.svg';
import GithubWhiteIcon from '@/assets/images/icons/githubWhiteIcon.svg';
import InstagramIcon from '@/assets/images/icons/instagram.svg';

import { SectionWrapper } from "./SectionWrapper";

const SocialButton: FC<{ title: string, icon: React.ReactNode } & ComponentProps<'a'>> = ({
  title,
  icon,
  href
}) => {
  return <a
    className="flex flex-row gap-2 items-center justify-start px-2 py-1 rounded-sm bg-background-secondary"
    href={href}
  >
    <span>{icon}</span>
    <span className="font-serif text-base text-foreground">{title}</span>
  </a>;
};

const SocialIcons = {
  "x": <XIcon height={20}/>,
  "instagram": <InstagramIcon height={20} />,
  "github": <GithubWhiteIcon height={20} />,
  "rss": <span className="text-xl flex place-items-center text-[#F26522] font-[Material_Symbols_Outlined] h-5">&#xe0e5;</span>,
  "email": <span className="text-xl flex place-items-center text-foreground font-[Material_Symbols_Outlined] h-5">&#xf187;</span>
};

export const SocialsSection = ({ className }: { className: string }) => {
  const t = useTranslations('Sections');
  return <SectionWrapper
    className={className}
    title={t('Follow on Socials')}
  >
    <div className="grow flex flex-col gap-1 items-stretch">
      <SocialButton title={t('Follow on Instagram')} icon={SocialIcons.instagram} href="https://www.instagram.com/meclisteneoluyor/" />
      <SocialButton title={t('Follow on X')} icon={SocialIcons.x} href="https://x.com/parlichartcom" />
      <SocialButton title={t('Browse on GitHub')} icon={SocialIcons.github} href="https://github.com/ambertide/parlichart" />
      <SocialButton title={t('Contact us On Email')} icon={SocialIcons.email} href="mailto:contact@mail.parlichart.com" />
    </div>
  </SectionWrapper>;
};

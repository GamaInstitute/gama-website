import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { BrandMark } from '@/components/brand/BrandMark'
import { SOCIAL_LINKS } from '@/constants'
import { LinkedInIcon } from '@/components/ui/icons'

function FacebookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z" />
    </svg>
  )
}

function YouTubeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.5 6.5a3 3 0 0 0-2.1-2.1C19.5 4 12 4 12 4s-7.5 0-9.4.4A3 3 0 0 0 .5 6.5 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.5 3 3 0 0 0 2.1 2.1C4.5 20 12 20 12 20s7.5 0 9.4-.4a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.5zM9.6 15.6V8.4l6.2 3.6z" />
    </svg>
  )
}

function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.9 10.9c.6.1.8-.2.8-.5v-1.8c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.4 11.4 0 0 1 6 0C17.3 4.7 18.3 5 18.3 5c.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.6.8.5A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5z" />
    </svg>
  )
}

function SocialLink({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-[34px] h-[34px] rounded-pill border border-hairline-2 grid place-items-center text-ink-soft transition-colors duration-200 hover:text-ink hover:border-ink"
    >
      {children}
    </a>
  )
}

function FooterLink({ to, href, children }: { to?: string; href?: string; children: React.ReactNode }) {
  const cls = 'relative w-max block text-ink-soft text-[0.95rem] py-[0.28em] transition-colors duration-[180ms] hover:text-[var(--accent-ink)] after:absolute after:left-0 after:right-0 after:bottom-[0.14em] after:h-px after:bg-current after:opacity-55 after:scale-x-0 after:origin-left after:transition-transform after:duration-[260ms] hover:after:scale-x-100'

  if (to) return <Link to={to} className={cls}>{children}</Link>
  return <a href={href ?? '#'} target="_blank" rel="noopener noreferrer" className={cls}>{children}</a>
}

export function Footer() {
  const { t } = useTranslation('common')

  return (
    <footer className="bg-bg-alt border-t border-hairline pt-[clamp(48px,6vw,80px)] pb-9">
      <div className="wrap">
        <div className="grid grid-cols-[1.6fr_1fr_1fr_1fr] gap-10 max-[860px]:grid-cols-2 max-[520px]:grid-cols-1">
          {/* Brand + tagline - stacked variant */}
          <div>
            <Link to="/" aria-label="Gama Institute" className="inline-flex flex-col items-start gap-[10px]">
              <BrandMark className="w-[52px] flex-none" />
              <span className="flex flex-col leading-none">
                <b className="font-display font-semibold text-[1.18rem] tracking-[-0.02em] text-ink">Gama</b>
                <span className="font-display font-normal text-[0.82rem] tracking-[0.02em] text-ink-muted">Institute</span>
              </span>
            </Link>
            <p className="text-ink-soft text-[0.95rem] max-w-[34ch] mt-4">{t('footer.tagline')}</p>
          </div>

          {/* Explore */}
          <div>
            <h5 className="font-sans text-[0.76rem] font-bold tracking-[0.14em] uppercase text-ink-muted mb-4">{t('footer.explore')}</h5>
            <FooterLink to="/about">{t('footer.about')}</FooterLink>
            <FooterLink to="/#research">{t('footer.research')}</FooterLink>
            {/* TODO: restore training footer link once the page ships */}
            <FooterLink to="/week-paper">{t('footer.weekpaper')}</FooterLink>
            <FooterLink to="/research-summaries">{t('footer.research_summaries')}</FooterLink>
            <FooterLink to="/contact">{t('footer.newsletter')}</FooterLink>
          </div>

          {/* Institute */}
          <div>
            <h5 className="font-sans text-[0.76rem] font-bold tracking-[0.14em] uppercase text-ink-muted mb-4">{t('footer.institute')}</h5>
            <FooterLink to="/team">{t('footer.team')}</FooterLink>
            <FooterLink to="/team#join">{t('footer.careers')}</FooterLink>
            <FooterLink to="/#partners">{t('footer.partners')}</FooterLink>
            <FooterLink to="/contact">{t('footer.contact')}</FooterLink>
          </div>

          {/* Follow */}
          <div>
            <h5 className="font-sans text-[0.76rem] font-bold tracking-[0.14em] uppercase text-ink-muted mb-4">{t('footer.follow')}</h5>
            <FooterLink href={SOCIAL_LINKS.linkedin}>LinkedIn</FooterLink>
            <FooterLink href={SOCIAL_LINKS.facebook}>Facebook</FooterLink>
            <FooterLink href={SOCIAL_LINKS.youtube}>YouTube</FooterLink>
            <FooterLink href={SOCIAL_LINKS.github}>GitHub</FooterLink>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex justify-between items-center gap-4 flex-wrap mt-12 pt-6 border-t border-hairline text-[0.85rem] text-ink-muted">
          <div className="flex flex-wrap gap-x-5 gap-y-1 items-center">
            <span>{t('footer.copyright')}</span>
            <Link to="/privacy" className="hover:text-ink transition-colors">{t('legal.privacy')}</Link>
            <Link to="/terms" className="hover:text-ink transition-colors">{t('legal.terms')}</Link>
            <Link to="/open-access" className="hover:text-ink transition-colors">{t('legal.open_access')}</Link>
          </div>
          <div className="flex gap-2.5">
            <SocialLink href={SOCIAL_LINKS.linkedin} label="LinkedIn"><LinkedInIcon /></SocialLink>
            <SocialLink href={SOCIAL_LINKS.facebook} label="Facebook"><FacebookIcon /></SocialLink>
            <SocialLink href={SOCIAL_LINKS.youtube}  label="YouTube"><YouTubeIcon /></SocialLink>
            <SocialLink href={SOCIAL_LINKS.github}   label="GitHub"><GitHubIcon /></SocialLink>
          </div>
        </div>
      </div>
    </footer>
  )
}

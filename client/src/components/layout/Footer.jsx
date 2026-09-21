import { Mail } from 'lucide-react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import Logo from '../ui/Logo';
import FooterLinks from '../common/FooterLinks';

const COLUMNS = [
  {
    title: 'Courses',
    links: ['Web Development', 'Data Science', 'UI/UX Design', 'Business & Marketing'],
  },
  { title: 'Company', links: ['About Us', 'Careers', 'Instructors', 'Blog'] },
  { title: 'Support', links: ['Help Center', 'Contact Us', 'Terms of Service', 'Privacy Policy'] },
];

const SOCIALS = [FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn];

export default function Footer() {
  return (
    <footer className="px-6 pt-14" style={{ backgroundColor: 'var(--bg-subtle)' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm" style={{ color: 'var(--text-muted)' }}>
              Access high-quality courses, learn from expert instructors, and build the skills that
              shape your future.
            </p>
            <div className="mt-5 flex items-center gap-3">
              {SOCIALS.map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:text-white"
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-muted)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = 'var(--color-primary-600)';
                    e.currentTarget.style.borderColor = 'var(--color-primary-600)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = 'var(--bg-card)';
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  }}
                >
                  <Icon className="h-4 w-4" strokeWidth={1.8} />
                </a>
              ))}
            </div>
          </div>

          {COLUMNS.map(col => (
            <FooterLinks key={col.title} {...col} />
          ))}
        </div>

        <div
          className="mt-12 flex flex-col items-center justify-between gap-4 rounded-2xl p-6 sm:flex-row"
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div>
            <h4 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              Stay in the loop
            </h4>
            <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
              Get new courses and updates straight to your inbox.
            </p>
          </div>
          <div
            className="flex w-full max-w-sm items-center gap-2 rounded-full p-1.5 sm:w-auto"
            style={{
              backgroundColor: 'var(--bg-subtle)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <Mail className="ml-2 h-4 w-4" style={{ color: 'var(--text-muted)' }} />
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full bg-transparent text-sm outline-none"
              style={{ color: 'var(--text-primary)' }}
            />
            <button
              className="shrink-0 rounded-full px-5 py-2 text-sm font-medium text-white transition hover:opacity-90"
              style={{ backgroundColor: 'var(--color-primary-600)' }}
            >
              Subscribe
            </button>
          </div>
        </div>

        <div
          className="mt-10 flex flex-col items-center justify-between gap-3 border-t py-6 text-xs sm:flex-row"
          style={{
            borderColor: 'var(--border-subtle)',
            color: 'var(--text-muted)',
          }}
        >
          <p>© {new Date().getFullYear()} SparrowLMS. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="#" className="hover:opacity-70 transition-opacity">
              Terms
            </a>
            <a href="#" className="hover:opacity-70 transition-opacity">
              Privacy
            </a>
            <a href="#" className="hover:opacity-70 transition-opacity">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

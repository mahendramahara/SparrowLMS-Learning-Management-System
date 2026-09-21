import { useState } from 'react';
import { Search, PlayCircle, BadgeCheck, Zap, GraduationCap, Headphones } from 'lucide-react';
import Pill from '../../ui/Pill';
import FeatureItem from '../../common/FeatureItem';
import InfoCard from '../../common/InfoCard';
import heroImage from '../../../assets/images/hero-image.jpg';

const POPULAR_TAGS = ['Web Development', 'Data Science', 'Python', 'UI/UX Design', 'Marketing'];

const FEATURES = [
  { icon: GraduationCap, title: 'Expert Instructors', desc: 'Learn from industry professionals.' },
  { icon: PlayCircle, title: 'Flexible Learning', desc: 'Study at your own pace, anytime.' },
  {
    icon: BadgeCheck,
    title: 'Certificates',
    desc: 'Showcase your skills with verified certificates.',
  },
  { icon: Headphones, title: '24/7 Support', desc: 'Get help whenever you need it.' },
];

export default function HeroComponent() {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = e => {
    e.preventDefault();
    if (searchTerm.trim()) {
      console.log('Searching for:', searchTerm);
    }
  };

  return (
    <section
      className="relative overflow-hidden pt-10 pb-16"
      style={{ backgroundColor: 'var(--bg-primary)' }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            <span
              className="text-xs font-bold tracking-widest uppercase"
              style={{ color: 'var(--color-primary-600)' }}
            >
              Online Learning Platform
            </span>

            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.16]"
              style={{ color: 'var(--text-primary)' }}
            >
              Learn New Skills, <br />
              Build a <span style={{ color: 'var(--color-primary-600)' }}>Better Future</span>
            </h1>

            <p
              className="max-w-xl text-base sm:text-lg leading-relaxed"
              style={{ color: 'var(--text-secondary)' }}
            >
              Access high-quality courses, learn from expert instructors, and achieve your goals —
              anytime, anywhere.
            </p>

            <form
              onSubmit={handleSearch}
              className="relative flex w-full max-w-lg items-center rounded-full p-1.5 ring-1 focus-within:ring-2 transition-all"
              style={{
                backgroundColor: 'var(--bg-card)',
                ringColor: 'var(--border-subtle)',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              <Search className="ml-3.5 h-5 w-5 shrink-0" style={{ color: 'var(--text-muted)' }} />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search for courses, topics, or instructors..."
                className="w-full bg-transparent px-3 py-2 text-sm outline-none"
                style={{ color: 'var(--text-primary)' }}
              />
              <button
                type="submit"
                className="shrink-0 rounded-full px-6 py-2.5 text-sm font-semibold text-white active:scale-95 transition-all"
                style={{ backgroundColor: 'var(--color-primary-600)' }}
              >
                Search
              </button>
            </form>

            <div
              className="flex flex-wrap items-center gap-2 pt-1 text-sm"
              style={{ color: 'var(--text-muted)' }}
            >
              <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>
                Popular:
              </span>
              {POPULAR_TAGS.map(tag => (
                <Pill key={tag} active={searchTerm === tag} onClick={() => setSearchTerm(tag)}>
                  {tag}
                </Pill>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
              <div
                className="absolute -inset-2 rounded-3xl blur-2xl -z-10"
                style={{
                  background:
                    'linear-gradient(to tr, var(--color-primary-200), transparent, var(--color-primary-100))',
                  opacity: 0.4,
                }}
              />
              <div
                className="overflow-hidden rounded-3xl shadow-xl ring-1"
                style={{ backgroundColor: 'var(--bg-card)', ringColor: 'var(--border-subtle)' }}
              >
                <img
                  src={heroImage}
                  alt="Student learning online"
                  className="w-full h-auto object-cover select-none transform hover:scale-[1.01] transition-transform duration-500"
                  loading="eager"
                />
              </div>

              <div className="hidden sm:flex flex-col gap-3 absolute -left-4 md:-left-6 lg:-left-10 top-1/2 -translate-y-1/2 z-10 max-w-[240px]">
                <InfoCard
                  icon={PlayCircle}
                  iconBg="var(--color-primary-600)"
                  title="Expert Instructors"
                  desc="Learn from industry experts"
                />
                <InfoCard
                  icon={BadgeCheck}
                  iconBg="#16A34A"
                  title="Certificate"
                  desc="Get verified certificates"
                />
                <InfoCard
                  icon={Zap}
                  iconBg="#F59E0B"
                  title="Lifetime Access"
                  desc="Learn anytime, anywhere"
                />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-2.5 sm:hidden">
              <InfoCard
                icon={PlayCircle}
                iconBg="var(--color-primary-600)"
                title="Expert Instructors"
                desc="Learn from industry experts"
              />
              <InfoCard
                icon={BadgeCheck}
                iconBg="#16A34A"
                title="Certificate"
                desc="Get verified certificates"
              />
              <InfoCard
                icon={Zap}
                iconBg="#F59E0B"
                title="Lifetime Access"
                desc="Learn anytime, anywhere"
              />
            </div>
          </div>
        </div>

        <div
          className="mt-16 sm:mt-20 rounded-2xl p-6 sm:p-8 shadow-sm ring-1"
          style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
        >
          <div
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 sm:divide-x"
            style={{ '--tw-divide-opacity': 1 }}
          >
            {FEATURES.map((f, index) => (
              <div
                key={f.title}
                className={`${index !== 0 ? 'sm:pl-6' : ''} ${index !== FEATURES.length - 1 ? 'sm:pr-6' : ''}`}
                style={{ borderColor: 'var(--border-subtle)' }}
              >
                <FeatureItem {...f} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

import {
  User,
  MapPin,
  Globe,
  Mail,
  Phone,
  Calendar,
  BookOpen,
  CheckCircle,
  Clock,
  Flame,
} from 'lucide-react';

const STAT_CONFIG = [
  { key: 'coursesEnrolled', label: 'Enrolled', icon: BookOpen, color: '#2563eb' },
  { key: 'coursesCompleted', label: 'Completed', icon: CheckCircle, color: '#059669' },
  { key: 'hoursLearned', label: 'Hours', icon: Clock, color: '#7c3aed' },
  { key: 'currentStreak', label: 'Day Streak', icon: Flame, color: '#dc2626' },
  { key: 'averageScore', label: 'Avg Score %', icon: CheckCircle, color: '#d97706' },
  { key: 'assignmentsSubmitted', label: 'Assignments', icon: BookOpen, color: '#0891b2' },
];

function StatPill({ label, value, icon: Icon, color }) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-2xl p-4 border"
      style={{ backgroundColor: 'var(--bg-subtle)', borderColor: 'var(--border-subtle)' }}
    >
      <Icon className="h-4 w-4 mb-1" style={{ color }} />
      <span className="text-xl font-extrabold" style={{ color: 'var(--text-primary)' }}>
        {value}
      </span>
      <span className="text-[11px] font-medium mt-0.5" style={{ color: 'var(--text-muted)' }}>
        {label}
      </span>
    </div>
  );
}

export default function ProfileHeroCard({ profile }) {
  const { name, email, phone, location, website, bio, role, joinedDate, stats } = profile;

  return (
    <div
      className="rounded-2xl border p-6 space-y-6"
      style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-subtle)' }}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
        <div
          className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl text-white text-3xl font-bold"
          style={{ background: 'linear-gradient(135deg, var(--color-primary-600), #7c3aed)' }}
        >
          {name.charAt(0)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1
              className="text-2xl font-extrabold tracking-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              {name}
            </h1>
            <span
              className="text-xs font-bold px-2.5 py-0.5 rounded-full capitalize"
              style={{
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                color: 'var(--color-primary-600)',
              }}
            >
              {role}
            </span>
          </div>

          <p
            className="text-sm mt-2 leading-relaxed max-w-xl"
            style={{ color: 'var(--text-secondary)' }}
          >
            {bio}
          </p>

          <div
            className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3 text-xs"
            style={{ color: 'var(--text-muted)' }}
          >
            {location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {location}
              </span>
            )}
            {email && (
              <span className="flex items-center gap-1">
                <Mail className="h-3 w-3" />
                {email}
              </span>
            )}
            {phone && (
              <span className="flex items-center gap-1">
                <Phone className="h-3 w-3" />
                {phone}
              </span>
            )}
            {website && (
              <a
                href={website}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 hover:underline"
              >
                <Globe className="h-3 w-3" />
                {website.replace('https://', '')}
              </a>
            )}
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Joined {joinedDate}
            </span>
          </div>
        </div>

        <div
          className="flex items-center gap-1.5 shrink-0 self-start rounded-xl px-4 py-2 border"
          style={{
            borderColor: 'var(--border-subtle)',
            backgroundColor: 'var(--bg-subtle)',
            color: 'var(--text-muted)',
          }}
        >
          <User className="h-3.5 w-3.5" />
          <span className="text-xs font-medium">View Only</span>
        </div>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {STAT_CONFIG.map(({ key, label, icon, color }) => (
          <StatPill key={key} label={label} value={stats[key]} icon={icon} color={color} />
        ))}
      </div>
    </div>
  );
}

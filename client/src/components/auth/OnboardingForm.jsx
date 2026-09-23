import { useState } from 'react';
import { Check, Sparkles, ArrowRight, BookOpen, Layers, Compass, Sun, Moon, Monitor } from 'lucide-react';
import { saveInitialInterests } from '../../services/user.api';
import { useTheme } from '../../hooks/useTheme';
import AuthAlert from './AuthAlert';
import AuthButton from './AuthButton';

const AVAILABLE_TOPICS = [
  { id: 'arch', name: 'Software Architecture', description: 'Microservices, clean code, design patterns, and scalability' },
  { id: 'media', name: 'Media Engineering', description: 'FFmpeg transcoding, HLS adaptive streaming, and video chunks' },
  { id: 'security', name: 'Cybersecurity & Auth', description: 'JWT tokens, Session TTLs, RBAC access control, and crypto' },
  { id: 'cloud', name: 'Cloud & DevOps', description: 'Docker, Kubernetes, Redis queues, and distributed workers' },
  { id: 'database', name: 'Database Systems', description: 'MongoDB indexing, TTL expiration, queries, and optimization' },
  { id: 'frontend', name: 'Modern Frontend', description: 'React, Tailwind CSS, theme tokens, and dynamic UX' },
];

const SKILL_LEVELS = [
  { id: 'beginner', label: 'Beginner', desc: 'Starting with fundamental concepts' },
  { id: 'intermediate', label: 'Intermediate', desc: 'Comfortable with production code' },
  { id: 'advanced', label: 'Advanced', desc: 'Deep dive into distributed architectures' },
];

const GOALS = [
  'Career Transition into Tech',
  'Upskilling for Current Role',
  'Academic & University Studies',
  'Building Personal Projects',
];

const THEME_OPTIONS = [
  { id: 'system', label: 'System', icon: Monitor },
  { id: 'light', label: 'Light', icon: Sun },
  { id: 'dark', label: 'Dark', icon: Moon },
];

export default function OnboardingForm({ onComplete }) {
  const availableTopics = AVAILABLE_TOPICS;
  const skillLevels = SKILL_LEVELS;
  const { theme, setTheme } = useTheme();

  const [selectedTopics, setSelectedTopics] = useState(['Modern Frontend', 'Software Architecture']);
  const [skillLevel, setSkillLevel] = useState('beginner');
  const [learningGoal, setLearningGoal] = useState(GOALS[0]);
  const [preferredTheme, setPreferredTheme] = useState(theme || 'system');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const toggleTopic = topicName => {
    setSelectedTopics(prev =>
      prev.includes(topicName)
        ? prev.filter(t => t !== topicName)
        : [...prev, topicName]
    );
  };

  const handleSave = async e => {
    if (e) e.preventDefault();
    if (selectedTopics.length === 0) {
      setErrorMessage('Please choose at least one learning topic to personalize your feed.');
      return;
    }

    setErrorMessage('');
    setLoading(true);

    try {
      if (preferredTheme && setTheme) {
        setTheme(preferredTheme);
      }

      await saveInitialInterests({
        topics: selectedTopics,
        skillLevel,
        learningGoal,
        preferences: {
          theme: preferredTheme,
        },
        skipped: false,
      });

      onComplete?.();
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Failed to save preferences. You can continue anyway.');
      setTimeout(() => {
        onComplete?.();
      }, 1200);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = async () => {
    setLoading(true);
    try {
      await saveInitialInterests({ skipped: true });
    } catch (err) {
      void err;
    } finally {
      setLoading(false);
      onComplete?.();
    }
  };

  return (
    <div className="space-y-6 text-left">
      <AuthAlert type="error" message={errorMessage} />

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4" style={{ color: 'var(--color-primary-600)' }} />
          <label className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
            Choose Your Learning Topics
          </label>
        </div>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
          Select topics that align with what you want to learn first.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {availableTopics.map(topic => {
            const isSelected = selectedTopics.includes(topic.name);
            return (
              <button
                type="button"
                key={topic.id}
                onClick={() => toggleTopic(topic.name)}
                className="flex items-start gap-2.5 rounded-xl p-3 text-left border transition-all"
                style={{
                  backgroundColor: isSelected ? 'var(--color-primary-50, rgba(37,99,235,0.06))' : 'var(--bg-subtle)',
                  borderColor: isSelected ? 'var(--color-primary-600)' : 'var(--border-subtle)',
                }}
              >
                <div
                  className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition"
                  style={{
                    backgroundColor: isSelected ? 'var(--color-primary-600)' : 'transparent',
                    borderColor: isSelected ? 'var(--color-primary-600)' : 'var(--border-medium)',
                  }}
                >
                  {isSelected && <Check className="h-3 w-3 text-white stroke-[3]" />}
                </div>
                <div className="min-w-0 flex-1 leading-tight">
                  <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {topic.name}
                  </p>
                  <p className="text-[11px] mt-0.5 line-clamp-1" style={{ color: 'var(--text-muted)' }}>
                    {topic.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4" style={{ color: 'var(--color-primary-600)' }} />
          <label className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
            Current Experience Level
          </label>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {skillLevels.map(lvl => {
            const isSelected = skillLevel === lvl.id;
            return (
              <button
                type="button"
                key={lvl.id}
                onClick={() => setSkillLevel(lvl.id)}
                className="rounded-xl p-2.5 text-center border transition-all"
                style={{
                  backgroundColor: isSelected ? 'var(--color-primary-50, rgba(37,99,235,0.06))' : 'var(--bg-subtle)',
                  borderColor: isSelected ? 'var(--color-primary-600)' : 'var(--border-subtle)',
                }}
              >
                <p className="text-xs font-bold" style={{ color: isSelected ? 'var(--color-primary-600)' : 'var(--text-primary)' }}>
                  {lvl.label}
                </p>
                <p className="text-[10px] mt-0.5 line-clamp-1" style={{ color: 'var(--text-muted)' }}>
                  {lvl.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Compass className="h-4 w-4" style={{ color: 'var(--color-primary-600)' }} />
            <label className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
              Primary Goal
            </label>
          </div>
          <select
            value={learningGoal}
            onChange={e => setLearningGoal(e.target.value)}
            className="w-full rounded-xl border py-2 px-3 text-xs outline-none transition"
            style={{
              backgroundColor: 'var(--bg-subtle)',
              borderColor: 'var(--border-subtle)',
              color: 'var(--text-primary)',
            }}
          >
            {GOALS.map(g => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" style={{ color: 'var(--color-primary-600)' }} />
            <label className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
              Appearance
            </label>
          </div>
          <div className="flex gap-1.5">
            {THEME_OPTIONS.map(opt => {
              const Icon = opt.icon;
              const isSelected = preferredTheme === opt.id;
              return (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => setPreferredTheme(opt.id)}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 px-2 border text-xs font-semibold transition"
                  style={{
                    backgroundColor: isSelected ? 'var(--color-primary-50, rgba(37,99,235,0.06))' : 'var(--bg-subtle)',
                    borderColor: isSelected ? 'var(--color-primary-600)' : 'var(--border-subtle)',
                    color: isSelected ? 'var(--color-primary-600)' : 'var(--text-secondary)',
                  }}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="pt-2 space-y-2.5">
        <AuthButton onClick={handleSave} loading={loading} icon={ArrowRight}>
          Complete Setup &amp; Enter Dashboard
        </AuthButton>

        <button
          type="button"
          disabled={loading}
          onClick={handleSkip}
          className="w-full py-2 text-center text-xs font-medium transition hover:underline disabled:opacity-50"
          style={{ color: 'var(--text-muted)' }}
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}

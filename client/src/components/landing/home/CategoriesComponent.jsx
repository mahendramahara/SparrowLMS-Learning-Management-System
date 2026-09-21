import {
  Code2,
  Terminal,
  Palette,
  BarChart3,
  Megaphone,
  Cpu,
  Camera,
  Languages,
  ArrowRight,
} from 'lucide-react';
import CategoryCard from '../../common/CategoryCard';
import landingData from '../../../demo/landing/landing.json';

const CATEGORY_STYLES = [
  { icon: Code2 },
  { icon: Terminal },
  { icon: Palette },
  { icon: BarChart3 },
  { icon: Megaphone },
  { icon: Cpu },
  { icon: Camera },
  { icon: Languages },
];

const CATEGORIES = landingData.categories.map((category, index) => ({
  ...CATEGORY_STYLES[index % CATEGORY_STYLES.length],
  title: category.name,
  count: category.count,
}));

export default function Categories() {
  return (
    <section className="px-6 py-14" style={{ backgroundColor: 'var(--bg-subtle)' }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Explore Categories
            </h2>
            <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
              Find the right course for your goals.
            </p>
          </div>
          <a
            href="#"
            className="flex items-center gap-1 text-sm font-medium hover:underline"
            style={{ color: 'var(--color-primary-600)' }}
          >
            View All Categories <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
          {CATEGORIES.map(c => (
            <CategoryCard key={c.title} {...c} />
          ))}
        </div>
      </div>
    </section>
  );
}

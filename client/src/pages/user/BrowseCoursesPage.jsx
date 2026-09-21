import { useState, useMemo } from 'react';
import { Compass } from 'lucide-react';
import BrowseHeroBanner from '../../components/browse/BrowseHeroBanner';
import BrowseCategoryFilter from '../../components/browse/BrowseCategoryFilter';
import BrowseFilterControls from '../../components/browse/BrowseFilterControls';
import BrowseCourseCard from '../../components/browse/BrowseCourseCard';
import browseCoursesData from '../../demo/browseCourses.json';

export default function BrowseCoursesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All Categories');
  const [levelFilter, setLevelFilter] = useState('All Levels');
  const [sortBy, setSortBy] = useState('popular');

  const allCourses = browseCoursesData.courses;

  const filteredAndSortedCourses = useMemo(() => {
    return allCourses
      .filter(course => {
        const matchesCategory =
          activeCategory === 'All Categories' || course.category === activeCategory;

        const matchesLevel = levelFilter === 'All Levels' || course.level === levelFilter;

        const matchesSearch =
          course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

        return matchesCategory && matchesLevel && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'lessons') return b.lessonsCount - a.lessonsCount;
        return b.studentsCount - a.studentsCount;
      });
  }, [allCourses, activeCategory, levelFilter, searchQuery, sortBy]);

  const handleEnroll = course => {
    void course;
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <BrowseHeroBanner
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        featuredTags={browseCoursesData.featuredTags}
        onTagClick={tag => setSearchQuery(tag)}
        totalCoursesCount={allCourses.length}
      />

      <BrowseCategoryFilter
        categories={browseCoursesData.categories}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
      />

      <BrowseFilterControls
        sortBy={sortBy}
        onSortChange={setSortBy}
        levelFilter={levelFilter}
        onLevelChange={setLevelFilter}
        levels={browseCoursesData.levels}
        filteredCount={filteredAndSortedCourses.length}
        totalCount={allCourses.length}
      />

      {filteredAndSortedCourses.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAndSortedCourses.map(course => (
            <BrowseCourseCard key={course.id} course={course} onEnroll={handleEnroll} />
          ))}
        </div>
      ) : (
        <div
          className="flex flex-col items-center justify-center rounded-2xl p-12 text-center border"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-subtle)',
          }}
        >
          <div
            className="flex h-12 w-12 items-center justify-center rounded-2xl mb-3"
            style={{ backgroundColor: 'var(--bg-subtle)', color: 'var(--text-muted)' }}
          >
            <Compass className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
            No courses match your criteria
          </h3>
          <p className="text-xs max-w-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            Try resetting your filters or using a broader search query.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setActiveCategory('All Categories');
              setLevelFilter('All Levels');
            }}
            className="mt-4 rounded-xl px-4 py-2 text-xs font-semibold border transition hover:opacity-80"
            style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-primary)' }}
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}

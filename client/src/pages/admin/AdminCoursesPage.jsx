import { useState, useMemo, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import AdminCoursesHeader from '../../components/admin/courses/AdminCoursesHeader';
import AdminCoursesListTable from '../../components/admin/courses/AdminCoursesListTable';
import AdminCategoriesGrid from '../../components/admin/courses/AdminCategoriesGrid';
import AdminCourseRequestsTable from '../../components/admin/courses/AdminCourseRequestsTable';
import AdminCategoryModal from '../../components/admin/courses/AdminCategoryModal';
import { getAllCourses, approveCourse } from '../../services/admin.api';
import { getCategories, deleteCategory } from '../../services/category.api';
import { deleteCourse } from '../../services/course.api';

export default function AdminCoursesPage({ initialTab = 'all' }) {
  const location = useLocation();
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (location.pathname.endsWith('/categories')) {
      setActiveTab('categories');
    } else if (location.pathname.endsWith('/requests')) {
      setActiveTab('requests');
    } else {
      setActiveTab('all');
    }
  }, [location.pathname]);

  const fetchCourses = useCallback(async () => {
    try {
      const res = await getAllCourses();
      if (res?.success) setCourses(res.data || []);
    } catch {
      // non-critical
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await getCategories({ includeCount: 'true' });
      if (res?.success) setCategories(res.data || []);
    } catch {
      // non-critical
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      await Promise.all([fetchCourses(), fetchCategories()]);
      setIsLoading(false);
    };
    load();
  }, [fetchCourses, fetchCategories]);

  const filteredCourses = useMemo(() => {
    if (!search) return courses;
    const q = search.toLowerCase();
    return courses.filter(
      c => {
        const catName = (typeof c.category === 'object' ? c.category?.name : c.category) || '';
        return (
          c.title?.toLowerCase().includes(q) ||
          catName.toLowerCase().includes(q)
        );
      }
    );
  }, [courses, search]);

  const filteredCategories = useMemo(() => {
    if (!search) return categories;
    return categories.filter(cat => cat.name.toLowerCase().includes(search.toLowerCase()));
  }, [categories, search]);

  const handleToggleCourseStatus = async courseId => {
    try {
      await approveCourse(courseId);
      toast.success('Course status updated.');
      fetchCourses();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update course status');
    }
  };

  const handleDeleteCourse = async courseId => {
    try {
      await deleteCourse(courseId);
      setCourses(prev => prev.filter(c => (c._id || c.id) !== courseId));
      toast.success('Course removed from platform.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete course');
    }
  };

  const handleOpenAddCategory = () => {
    setSelectedCategory(null);
    setIsCategoryModalOpen(true);
  };

  const handleOpenEditCategory = cat => {
    setSelectedCategory(cat);
    setIsCategoryModalOpen(true);
  };

  const handleCategorySaved = savedCat => {
    setCategories(prev => {
      const exists = prev.some(c => (c._id || c.id) === (savedCat._id || savedCat.id));
      if (exists) return prev.map(c => ((c._id || c.id) === (savedCat._id || savedCat.id) ? { ...c, ...savedCat } : c));
      return [...prev, savedCat];
    });
  };

  const handleDeleteCategory = async catId => {
    try {
      const res = await deleteCategory(catId);
      setCategories(prev => prev.filter(c => (c._id || c.id) !== catId));
      toast.success(res?.message || 'Category deleted.');
      fetchCourses();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete category');
    }
  };

  const counts = {
    courses: courses.length,
    categories: categories.length,
    requests: 0,
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <AdminCoursesHeader
        search={search}
        onSearchChange={setSearch}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        counts={counts}
      />

      {activeTab === 'all' && (
        <AdminCoursesListTable
          courses={filteredCourses}
          isLoading={isLoading}
          onDeleteCourse={handleDeleteCourse}
          onToggleCourseStatus={handleToggleCourseStatus}
        />
      )}

      {activeTab === 'categories' && (
        <AdminCategoriesGrid
          categories={filteredCategories}
          isLoading={isLoading}
          onAddCategory={handleOpenAddCategory}
          onEditCategory={handleOpenEditCategory}
          onDeleteCategory={handleDeleteCategory}
        />
      )}

      {activeTab === 'requests' && (
        <AdminCourseRequestsTable
          requests={[]}
          onApprove={() => {}}
          onReject={() => {}}
        />
      )}

      <AdminCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        category={selectedCategory}
        onSaved={handleCategorySaved}
      />
    </div>
  );
}

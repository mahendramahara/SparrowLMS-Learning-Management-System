import ProfileHeroCard from '../../components/profile/ProfileHeroCard';
import ProfileCourseList from '../../components/profile/ProfileCourseList';
import ProfileAchievements from '../../components/profile/ProfileAchievements';
import ProfileActivityFeed from '../../components/profile/ProfileActivityFeed';
import profileData from '../../demo/studentProfile.json';

export default function StudentProfilePage() {
  const { profile, courses, achievements, recentActivity } = profileData;

  return (
    <div className="space-y-6">
      <ProfileHeroCard profile={profile} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ProfileCourseList courses={courses} />
          <ProfileAchievements achievements={achievements} />
        </div>

        <div>
          <ProfileActivityFeed activity={recentActivity} />
        </div>
      </div>
    </div>
  );
}

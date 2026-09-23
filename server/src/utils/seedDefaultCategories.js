const Category = require('../modules/admin/category.model');
const logger = require('./logger');

const DEFAULT_CATEGORIES = [
  { name: 'Web Development', slug: 'web-development', description: 'Frontend and backend web technologies', isDefault: true },
  { name: 'Mobile App Development', slug: 'mobile-development', description: 'iOS, Android and cross-platform apps', isDefault: true },
  { name: 'Data Science & AI', slug: 'data-science', description: 'Machine learning, data analysis and AI', isDefault: true },
  { name: 'UI/UX & Product Design', slug: 'design', description: 'Interface design and user experience', isDefault: true },
  { name: 'Cloud Computing & DevOps', slug: 'cloud-devops', description: 'Cloud platforms, CI/CD and infrastructure', isDefault: true },
  { name: 'Cybersecurity & Ethical Hacking', slug: 'cybersecurity', description: 'Security practices and penetration testing', isDefault: true },
  { name: 'Database & Backend Engineering', slug: 'backend-database', description: 'Database design and backend systems', isDefault: true },
  { name: 'Programming Languages', slug: 'programming', description: 'Core programming language fundamentals', isDefault: true },
  { name: 'Business & Entrepreneurship', slug: 'business', description: 'Business strategy and startup growth', isDefault: true },
  { name: 'Uncategorized', slug: 'uncategorized', description: 'General and miscellaneous courses', isDefault: true },
];

const seedDefaultCategories = async () => {
  try {
    for (const cat of DEFAULT_CATEGORIES) {
      await Category.findOneAndUpdate(
        { slug: cat.slug },
        { $setOnInsert: cat },
        { upsert: true, new: false }
      );
    }
    logger.info('Default categories verified and seeded');
  } catch (error) {
    logger.error(`Category seed failed: ${error.message}`);
  }
};

module.exports = seedDefaultCategories;

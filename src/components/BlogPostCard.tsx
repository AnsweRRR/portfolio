import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { fadeIn } from "../utils/motion";
import type { BlogPost } from "../types/blog";

const BlogPostCard = ({ post, index }: { post: BlogPost; index: number }) => {
  const { t, i18n } = useTranslation();

  return (
    <motion.div
      variants={fadeIn("up", "spring", index * 0.3, 0.75)}
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Link to={`/blog/${post.slug}`} className="group violet-gradient p-px rounded-2xl block h-full">
        <article className="bg-[#1d1836] dark:bg-[#1d1836] bg-gray-100 rounded-2xl overflow-hidden flex flex-col h-full transition-shadow duration-300 group-hover:shadow-xl group-hover:shadow-[#915EFF]/20">
          {post.coverImage?.url && (
            <div className="relative w-full h-48 overflow-hidden">
              <img
                src={post.coverImage.url}
                alt={post.coverImage.alt || post.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                loading="lazy"
              />
            </div>
          )}
          <div className="flex-1 flex flex-col p-6">
            <h3 className="text-xl font-semibold mb-2 text-white-100 transition-colors duration-300 group-hover:text-[#915EFF]">{post.title}</h3>
            {post.publishedDate && (
              <p className="text-xs text-secondary mb-3">
                {t('blog.publishedOn', { date: new Date(post.publishedDate).toLocaleDateString(i18n.language) })}
              </p>
            )}
            {post.excerpt && <p className="text-sm text-secondary mb-4">{post.excerpt}</p>}
            {post.categories && post.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-auto">
                {post.categories.map((category) => (
                  <span key={category.id} className="text-xs bg-[#915EFF]/20 text-[#915EFF] px-2 py-1 rounded-full">
                    {category.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </article>
      </Link>
    </motion.div>
  );
};

export default BlogPostCard;

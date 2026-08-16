import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { styles } from "../styles";
import { fadeIn, textVariant } from "../utils/motion";
import { blogApi } from "../api/clients/payloadClient";
import type { BlogPost } from "../types/blog";

const PostCard = ({ post, index }: { post: BlogPost; index: number }) => {
  const { t, i18n } = useTranslation();

  return (
    <motion.div variants={fadeIn("up", "spring", index * 0.3, 0.75)}>
      <Link to={`/blog/${post.slug}`} className="violet-gradient p-[1px] rounded-2xl block h-full">
        <article className="bg-[#1d1836] dark:bg-[#1d1836] bg-gray-100 rounded-2xl overflow-hidden flex flex-col h-full">
          {post.coverImage?.url && (
            <div className="relative w-full h-48 overflow-hidden">
              <img
                src={post.coverImage.url}
                alt={post.coverImage.alt || post.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          )}
          <div className="flex-1 flex flex-col p-6">
            <h3 className="text-xl font-semibold mb-2 text-white-100">{post.title}</h3>
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

const BlogListPage = () => {
  const { t, i18n } = useTranslation();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['posts', i18n.language],
    queryFn: () => blogApi.listPosts(i18n.language),
  });

  return (
    <section className="min-h-screen bg-primary pt-32 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div variants={textVariant()} initial="hidden" animate="show">
          <h1 className={`${styles.sectionHeadText} text-center`}>{t('blog.title')}</h1>
          <p className={`${styles.sectionSubText} text-center mt-2`}>{t('blog.subtitle')}</p>
        </motion.div>

        {isLoading && <p className="text-center text-secondary mt-12">…</p>}
        {isError && <p className="text-center text-secondary mt-12">{t('blog.loadError')}</p>}
        {!isLoading && !isError && (data?.docs.length ?? 0) === 0 && (
          <p className="text-center text-secondary mt-12">{t('blog.empty')}</p>
        )}

        {!isLoading && !isError && (data?.docs.length ?? 0) > 0 && (
          <motion.div
            variants={fadeIn("up", "tween", 0.1, 1)}
            initial="hidden"
            animate="show"
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mt-12"
          >
            {data!.docs.map((post, index) => (
              <PostCard key={post.id} post={post} index={index} />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default BlogListPage;

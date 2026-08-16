import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import { styles } from "../../styles";
import { fadeIn, textVariant } from "../../utils/motion";
import { blogApi } from "../../api/clients/payloadClient";
import BlogPostCard from "../BlogPostCard";
import SectionWrapper from "../../hoc/SectionWrapper";

const HOME_PREVIEW_POST_COUNT = 2;

const BlogSection = () => {
  const { t, i18n } = useTranslation();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['posts', 'home-preview', i18n.language],
    queryFn: () => blogApi.listPosts(i18n.language, { limit: HOME_PREVIEW_POST_COUNT }),
  });

  const posts = data?.docs ?? [];

  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>{t('blog.subtitle')}</p>
        <h2 className={`${styles.sectionHeadText} text-white-100`}>{t('blog.title')}</h2>
      </motion.div>

      {isLoading && <p className="text-secondary mt-8">…</p>}
      {isError && <p className="text-secondary mt-8">{t('blog.loadError')}</p>}
      {!isLoading && !isError && posts.length === 0 && (
        <p className="text-secondary mt-8">{t('blog.empty')}</p>
      )}

      {!isLoading && !isError && posts.length > 0 && (
        <>
          <motion.div
            variants={fadeIn("up", "tween", 0.1, 1)}
            className="grid gap-8 sm:grid-cols-2 mt-12"
          >
            {posts.map((post, index) => (
              <BlogPostCard key={post.id} post={post} index={index} />
            ))}
          </motion.div>

          <motion.div variants={fadeIn("up", "tween", 0.2, 1)} className="flex justify-center mt-10">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 bg-[#915EFF] text-white text-sm py-2 px-6 rounded-lg hover:bg-purple-600 transition-colors duration-150"
            >
              {t('blog.showMore')}
              <FiArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </>
      )}
    </>
  );
};

const WrappedBlogSection = SectionWrapper(BlogSection, "blog");
export default WrappedBlogSection;

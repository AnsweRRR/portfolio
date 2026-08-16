import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { styles } from "../styles";
import { fadeIn, textVariant } from "../utils/motion";
import { motion } from "framer-motion";
import { blogApi } from "../api/clients/payloadClient";
import BlogPostCard from "../components/BlogPostCard";

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
              <BlogPostCard key={post.id} post={post} index={index} />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default BlogListPage;

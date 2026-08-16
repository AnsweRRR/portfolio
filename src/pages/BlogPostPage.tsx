import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { motion } from "framer-motion";
import { styles } from "../styles";
import { fadeIn } from "../utils/motion";
import { blogApi } from "../api/clients/payloadClient";

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { t, i18n } = useTranslation();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['post', slug, i18n.language],
    queryFn: () => blogApi.getPostBySlug(slug!, i18n.language),
    enabled: !!slug,
  });

  const post = data?.docs[0];

  useEffect(() => {
    if (post?.title) document.title = `${post.title} | ${t('hero.name')}`;
    return () => {
      document.title = t('hero.name');
    };
  }, [post?.title, t]);

  return (
    <section className="min-h-screen bg-primary pt-32 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        <Link to="/blog" className="text-sm text-[#915EFF] hover:underline">
          &larr; {t('blog.backToBlog')}
        </Link>

        {isLoading && <p className="text-center text-secondary mt-12">…</p>}
        {isError && <p className="text-center text-secondary mt-12">{t('blog.loadError')}</p>}
        {!isLoading && !isError && !post && (
          <p className="text-center text-secondary mt-12">{t('blog.empty')}</p>
        )}

        {post && (
          <motion.article variants={fadeIn("up", "tween", 0.1, 0.75)} initial="hidden" animate="show" className="mt-6">
            {post.coverImage?.url && (
              <img
                src={post.coverImage.url}
                alt={post.coverImage.alt || post.title}
                className="w-full h-64 sm:h-80 object-cover rounded-2xl mb-8"
              />
            )}
            <h1 className={`${styles.sectionHeadText} text-white-100`}>{post.title}</h1>
            {post.publishedDate && (
              <p className="text-sm text-secondary mt-2">
                {t('blog.publishedOn', { date: new Date(post.publishedDate).toLocaleDateString(i18n.language) })}
              </p>
            )}
            {post.categories && post.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {post.categories.map((category) => (
                  <span key={category.id} className="text-xs bg-[#915EFF]/20 text-[#915EFF] px-2 py-1 rounded-full">
                    {category.name}
                  </span>
                ))}
              </div>
            )}
            <div className="prose prose-invert max-w-none mt-8 text-secondary">
              <RichText data={post.content} />
            </div>
          </motion.article>
        )}
      </div>
    </section>
  );
};

export default BlogPostPage;

import { useState, useEffect } from 'react';

import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';

import { FiCalendar, FiUser } from 'react-icons/fi';

import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import Prismic from '@prismicio/client';
import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  const [posts, setPosts] = useState<Post[]>(postsPagination?.results);
  const [pagination, setPagination] = useState<string | null>(
    postsPagination?.next_page
  );

  const handlePagination = async (): Promise<void> => {
    const response = await fetch(pagination);
    const { results } = await response.json();

    const newPosts = results.map(post => {
      return {
        uid: post?.uid,
        first_publication_date: post?.first_publication_date,
        data: {
          title: post?.data?.title,
          subtitle: post?.data?.subtitle,
          author: post?.data?.author,
        },
      };
    });

    const postsFormatted = [...posts, ...newPosts];
    setPosts(postsFormatted);
    setPagination(results.next_page);
  };

  return (
    <div className={commonStyles.contentContainer}>
      <Head>
        <title>Space Traveling</title>
      </Head>
      <main className={styles.container}>
        <div className={styles.posts}>
          {posts &&
            posts.map(post => (
              <Link key={post.uid} href={`/post/${post.uid}`}>
                <a>
                  <strong>{post.data.title}</strong>
                  <p>{post.data.subtitle}</p>
                  <div className={styles.date}>
                    <span>
                      <FiCalendar />
                      {format(
                        parseISO(post.first_publication_date),
                        'dd MMM yyyy',
                        {
                          locale: ptBR,
                        }
                      )}
                    </span>
                    <span>
                      <FiUser />
                      {post.data.author}
                    </span>
                  </div>
                </a>
              </Link>
            ))}

          {pagination && (
            <button
              type="button"
              className={styles.morePosts}
              onClick={() => handlePagination()}
            >
              Carregar mais posts
            </button>
          )}
        </div>
      </main>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    [Prismic.predicates.at('document.type', 'posts')],
    {
      fetch: ['posts.title', 'posts.subtitle', 'posts.author'],
      pageSize: 2,
    }
  );

  const posts = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    };
  });

  return {
    props: {
      postsPagination: {
        next_page: postsResponse.next_page,
        results: posts,
      },
    },
  };
};

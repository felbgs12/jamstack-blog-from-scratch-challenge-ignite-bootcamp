import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';

import { FiCalendar, FiUser } from 'react-icons/fi';
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

export default function Home(): JSX.Element {
  return (
    <div className={commonStyles.contentContainer}>
      <Head>
        <title>Space Traveling</title>
      </Head>
      <main className={styles.container}>
        <div className={styles.posts}>
          <Link key="#" href="/">
            <a>
              <strong>Como utilizar Hooks</strong>
              <p>Pensando em sincronização em vez de ciclos de vida</p>
              <div className={styles.date}>
                <time>
                  <FiCalendar />
                  15 Mar 2021
                </time>
                <span>
                  <FiUser />
                  Joseph Oliveira
                </span>
              </div>
            </a>
          </Link>

          <Link key="#" href="/">
            <a>
              <strong>Como utilizar Hooks</strong>
              <p>Pensando em sincronização em vez de ciclos de vida</p>
              <div className={styles.date}>
                <time>
                  <FiCalendar />
                  15 Mar 2021
                </time>
                <span>
                  <FiUser />
                  Joseph Oliveira
                </span>
              </div>
            </a>
          </Link>
          <span className={styles.morePosts}>Carregar mais posts</span>
        </div>
      </main>
    </div>
  );
}

// export const getStaticProps = async () => {
//   // const prismic = getPrismicClient();
//   // const postsResponse = await prismic.query(TODO);

//   // TODO
// };

import { api } from " /utils/api";
import { type GetStaticProps, type NextPage } from "next";
import Head from "next/head";
import { PageLayout } from " /components/layout";
import { generateSSGHelper } from " /server/helpers/ssgHelper";
import { PostView } from " /components/postview";

const SinglePostPage: NextPage<{ id: string }> = ({ id }) => {
  const { data } = api.post.getById.useQuery({ id });
  if (!data) return <div>404</div>;

  const author = data.author;
  const post = data.post;
  const url = "https://larry-seven.vercel.app/post/";

  return (
    <>
      <Head>
        <title>{`${author.fullName} on Larry: "${
          post.content.substring(0, 277) + "... " + url + post.id
        }" / Larry`}</title>
      </Head>
      <PageLayout>
        <PostView {...data} />
      </PageLayout>
    </>
  );
};

export default SinglePostPage;

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();
  const id = context.params?.id;
  if (typeof id !== "string") {
    throw new Error("no slug");
  }
  await ssg.post.getById.prefetch({ id });
  return { props: { trpcState: ssg.dehydrate(), id } };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

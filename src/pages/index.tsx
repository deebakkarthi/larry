import { RouterOutputs, api } from " /utils/api";
import { SignInButton, useUser } from "@clerk/nextjs";
import Head from "next/head";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
dayjs.extend(relativeTime);

const CreatePostWizard = () => {
  const { user } = useUser();

  if (!user) {
    return null;
  }
  return (
    <div className="flex w-full gap-3">
      <Image
        src={user.imageUrl}
        alt={`${user.fullName}'s profile picture`}
        className="h-10 w-10 rounded-full"
        width={40}
        height={40}
      />
      <input
        placeholder="What is happening?!"
        className="grow bg-transparent outline-none"
      ></input>
    </div>
  );
};

type PostWithUser = RouterOutputs["post"]["getAll"][number];

const PostView = (props: PostWithUser) => {
  const { post, author } = props;
  return (
    <div key={post.id} className="flex gap-3 border-b border-slate-500 p-4">
      <Image
        src={author.imageUrl}
        className="h-10 w-10 rounded-full"
        alt={`${author.fullName}'s profile picture`}
        width={40}
        height={40}
      />
      <div className="flex flex-col">
        <div className="flex">
          <span className="font-semibold text-white">{author.fullName}</span>
          <span className="ps-1 text-slate-400">{author.email}</span>
          {/*TODO: If time diff > 24h show as Date else show as 23h*/}
          <span className="ps-1 text-slate-400">{`· ${dayjs(
            post.createdAt,
          ).fromNow()}`}</span>
        </div>
        <span>{post.content}</span>
      </div>
    </div>
  );
};

const Home = () => {
  const user = useUser();
  const { data } = api.post.getAll.useQuery();

  return (
    <>
      <Head>
        <title>Home/Larry</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex  h-screen justify-center">
        <div className="h-full w-full border-x border-slate-500  md:max-w-2xl">
          <div className="flex border-b border-slate-500 p-4">
            {!user.isSignedIn && (
              <div className="flex justify-center">
                <SignInButton />
              </div>
            )}

            {user.isSignedIn && <CreatePostWizard />}
          </div>
          <div className="flex flex-col">
            {data?.map((fullPost) => (
              <PostView {...fullPost} key={fullPost.post.id} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;

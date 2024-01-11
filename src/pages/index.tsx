import { RouterOutputs, api } from " /utils/api";
import { SignInButton, useUser } from "@clerk/nextjs";
import Head from "next/head";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import { LoadingPage } from " /components/loading";
import { useState } from "react";
dayjs.extend(relativeTime);

const CreatePostWizard = () => {
  const { user } = useUser();
  const ctx = api.useUtils();

  const { mutate, isLoading: isPosting } = api.post.create.useMutation({
    onSuccess: () => {
      setInput("");
      ctx.post.getAll.invalidate();
    },
  });

  const [input, setInput] = useState("");

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
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={isPosting}
      ></input>
      <button onClick={() => mutate({ content: input })}>Post</button>
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
          <span className="ps-1 text-slate-400">{`· ${dayjs(
            post.createdAt,
          ).fromNow()}`}</span>
        </div>
        <span>{post.content}</span>
      </div>
    </div>
  );
};

const Feed = () => {
  const { data, isLoading: postsLoading } = api.post.getAll.useQuery();
  if (postsLoading) return <LoadingPage />;
  if (!data) return <div>Something went wrong</div>;

  return (
    <div className="flex flex-col">
      {data.map((fullPost) => (
        <PostView {...fullPost} key={fullPost.post.id} />
      ))}
    </div>
  );
};

const Home = () => {
  const { isLoaded: userLoaded, isSignedIn } = useUser();

  // Start fetching asap. The Feed component can use the cached result
  api.post.getAll.useQuery();

  if (!userLoaded) return <div />;

  return (
    <>
      <Head>
        <title>Home/Larry</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex  h-screen justify-center">
        <div className="h-full w-full border-x border-slate-500  md:max-w-2xl">
          <div className="flex border-b border-slate-500 p-4">
            {!isSignedIn && (
              <div className="flex justify-center">
                <SignInButton />
              </div>
            )}
            {isSignedIn && <CreatePostWizard />}
          </div>
          <Feed />
        </div>
      </main>
    </>
  );
};

export default Home;

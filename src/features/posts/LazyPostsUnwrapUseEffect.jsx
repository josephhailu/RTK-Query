import React from "react";
import { Spinner } from "../../components/Spinner";
import { Wrapper } from "../../components/Wrapper";
import { useLazyGetPostsQuery, useDeletePostMutation } from "../api/apiSlice";

export const PostExcerpt = ({ post, handleLoad }) => {
  const [deleteTrigger, { isLoading }] = useDeletePostMutation();

  return (
    <article className="post-excerpt" key={post.id}>
      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <h3>{post.title}</h3>

        <button
          style={{ maxWidth: "155px" }}
          onClick={async () => {
            try {
              console.log(handleLoad);
              await deleteTrigger({ id: post.id });
              handleLoad && (await handleLoad());
            } catch (error) {
              console.error({ error });
            }
          }}
          className="button muted-button"
          disabled={isLoading}
        >
          {isLoading ? "Deleting Post..." : "Delete Post"}
        </button>
      </div>
    </article>
  );
};

export const LazyPostsUnwrapUseEffect = () => {
  const [getPostsTrigger, { isFetching, isSuccess, isError, error, data }] =
    useLazyGetPostsQuery();

  const [postData, setPostData] = React.useState([]);
  const [buggyPostData, setBuggyPostData] = React.useState([]);

  React.useEffect(() => {
    setPostData(data); // adding client side state here will be ok
  }, [data]);

  const handleLoad = async () => {
    try {
      const res = await getPostsTrigger().unwrap();
      console.log({ res });

      setBuggyPostData(res); // adding client side state here will cause stale data
    } catch (error) {
      console.error(error);
    }
  };

  let content;

  if (isFetching) {
    content = <Spinner text="Loading..." />;
  } else if (isSuccess) {
    content = (
      <Wrapper>
        <div className="wrapper">
          <p>Useffect data:</p>
          {postData?.map((post) => (
            <PostExcerpt key={post.id} post={post} />
          ))}
        </div>
        <div className="wrapper">
          <p>Unwrap + setState data:</p>
          {buggyPostData.map((post) => (
            <PostExcerpt key={post.id} post={post} handleLoad={handleLoad} /> // even passing the trigger to manually refetch does not update the data
          ))}
        </div>
      </Wrapper>
    );
  } else if (isError) {
    content = <div>{error}</div>;
  }

  return (
    <section className="posts-list">
      <h2>Lazy Query: unwrapping + setState vs useEffect:</h2>
      <p>
        Click load posts, delete a post, and verify the unwrap list is stale
      </p>
      <button onClick={handleLoad}>Load Posts</button>
      <br />
      {content}
    </section>
  );
};

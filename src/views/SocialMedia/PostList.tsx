import React, { useCallback, useEffect, useRef, useState } from "react";
import useAxios from "../../hooks/useAxios";
import { Post } from "../../types/interfaces";
import { PageToolbar } from "../common";
import useCommonActions from "../../hooks/useCommonActions";
import helpers from "../../_helpers/common";
import ContentLoader from "../common/ContentLoader";

const List: React.FC = () => {
  const axiosInstance = useAxios();
  const { blockUnblockPost } = useCommonActions();
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
  });
  const [isLoading, setIsLoading] = useState(false);
  const isInitialRender = useRef(false);
  const [results, setResults] = useState<Post[] | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [postaction, setPostAction] = useState<string>("");
  const listRef = useRef<HTMLDivElement>(null);

  const getListData = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const response: any = await axiosInstance({
        url: "posts/get-post-list",
        method: "GET",
        data: {
          page: pagination.currentPage,
          limit: pagination.pageSize,
        },
      });
      // console.log("users post response", response);
      if (response.data.posts.docs.length > 0) {
        setResults((prevResults) =>
          pagination.currentPage === 1
            ? response.data.posts.docs
            : [...(prevResults ?? []), ...response.data.posts.docs]
        );
        setHasMore(response.data.posts.hasNextPage);
      } else {
        if (pagination.currentPage === 1) {
          setResults([]);
        }
        setHasMore(false);
      }
    } catch (error: any) {
      console.error("Error in api request:", error);
    } finally {
      setTimeout(() => setIsLoading(false), 500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination]);

  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false; // Mark as rendered
      return; //Skip the first execution
    }
    getListData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination]); //Dependency array

  const handleScroll = useCallback(() => {
    if (listRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listRef.current;
      if (
        scrollTop + clientHeight >= scrollHeight - 10 &&
        hasMore &&
        !isLoading
      ) {
        setPagination((prev) => ({
          ...prev,
          currentPage: prev.currentPage + 1,
        }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMore, isLoading]);

  //Add scroll listener
  useEffect(() => {
    const listContainer = listRef.current;
    if (listContainer) {
      listContainer.addEventListener("scroll", handleScroll);
      return () => listContainer.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  const handlePostAction = (post_id: string) => {
    if (post_id === postaction) {
      setPostAction("");
    } else {
      setPostAction(post_id);
    }
  };

  const blockPost = (itemid: string, isBlocked: boolean) => {
    blockUnblockPost(
      itemid,
      isBlocked,
      "posts/block-unblock-post",
      getListData
    );
  };

  return (
    <>
      {/*Page toolbar Area Start*/}
      <PageToolbar title="Social Media" />
      {/*Page toolbar Area End*/}
      <div id="kt_content" className="content flex-column-fluid">
        <div
          className={`card card-height-width ${
            isLoading ? "overlay overlay-block" : ""
          } `}
          style={{
            minHeight: "74vh",
            maxHeight: "74vh",
          }}
        >
          <div className={"card-body overflow-hidden p-0"}>
            <div
              ref={listRef}
              className="pt-4 pb-4"
              style={{ maxHeight: "74vh", overflowY: "auto" }}
            >
              {!results?.length ? (
                <div className="d-flex justify-content-center fs-5">
                  No content Found
                </div>
              ) : (
                results?.map((post) => (
                  <div
                    key={post._id}
                    // className="card rounded-4 my-3 mx-auto mb-5 "
                    className={`card rounded-4 my-3 mx-auto mb-5  ${
                      post?.is_blocked ? "bg-gray-200" : "bg-gray-100"
                    }`}
                    style={{
                      width: "35vw",
                    }}
                  >
                    <div className="position-relative card-body p-4 ribbon ribbon-top">
                      {post?.is_blocked ? (
                        <div
                          className="position-absolute ribbon-label bg-danger"
                          style={{ right: "2rem" }}
                        >
                          Blocked
                        </div>
                      ) : (
                        ""
                      )}
                      {/* User info */}
                      <div className="d-flex justify-content-between">
                        <div className="d-flex mb-3">
                          <img
                            src={post?.created_by?.imagepath}
                            alt={post?.created_by?.fullname}
                            className="me-3"
                            style={{
                              height: "3.5rem",
                              width: "3.5rem",
                              objectFit: "contain",
                            }}
                          />
                          <div>
                            <p className="fs-5 mb-1">
                              {post?.created_by?.fullname}
                            </p>
                            <p className="text-muted mb-1 fs-5">
                              {post?.created_at
                                ? helpers.timeAgo(post.created_at)
                                : "N/A"}
                            </p>
                          </div>
                        </div>
                        {/* Menu Button */}
                        <div className="dropdown">
                          <button
                            type="button"
                            className="btn btn-sm btn-light border-0 p-0 bg-transparent"
                            onClick={() => handlePostAction(post._id)}
                            data-bs-toggle="dropdown"
                            aria-expanded={postaction === post._id}
                          >
                            <img
                              src="/assets/media/svg/menu-dots.svg"
                              alt="menu-dots"
                              className="object-fit-cover"
                              style={{ height: "1.25rem", width: "1.25rem" }}
                            />
                          </button>
                          <ul
                            className={`dropdown-menu dropdown-menu-end shadow-sm ${
                              postaction === post._id ? "show" : ""
                            }`}
                            style={{ minWidth: "8rem" }}
                          >
                            <li>
                              <button
                                className="dropdown-item"
                                onClick={() =>
                                  blockPost(post?._id, post?.is_blocked)
                                }
                              >
                                {post?.is_blocked
                                  ? "Unblock Post"
                                  : "Block Post"}
                              </button>
                            </li>
                          </ul>
                        </div>
                      </div>
                      {/* Message */}
                      <p className="fs-5 mb-2">{post?.message}</p>
                      {/* Image or Video */}
                      {post?.post_assets &&
                        post.post_assets.length > 0 &&
                        post.post_assets[0] &&
                        (post.post_assets[0].mime.startsWith("image/") ? (
                          <img
                            src={post.post_assets[0].filepath}
                            alt="post"
                            className="img-fluid h-80 w-100 object-fit-contain"
                            style={{
                              maxHeight: "20rem",
                            }}
                          />
                        ) : (
                          <video className="w-100" controls>
                            <source
                              src={post.post_assets[0].filepath}
                              type={post.post_assets[0].mime}
                            />
                            Your browser does not support the video tag.
                          </video>
                        ))}
                    </div>
                  </div>
                ))
              )}
            </div>
            {/*Content Area End*/}
          </div>
          {/*Content Loader Start*/}
          {isLoading ? <ContentLoader /> : null}
          {/*Content Loader End*/}
        </div>
      </div>
    </>
  );
};

export default List;

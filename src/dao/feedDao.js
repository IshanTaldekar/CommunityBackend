import db from "../../db.js";

class FeedDao {
  static async getLatestFriendFeed(userId) {
    try {
      const result = await db.manyOrNone(
        `SELECT fp.thread_poster_id, t.thread_id, t.subject, t.timestamp as posted_at, m.message_id, 
                m.body
        FROM public.FriendPosts as fp
             JOIN public.Thread as t ON t.thread_id = fp.thread_id
             JOIN public.Message as m ON m.message_id = fp.message_id
        WHERE fp.thread_target_id = $1`,
        [userId],
      );

      if (result.length === 0) {
        return {
          status: 200,
          message: "No friend posts found",
          posts: [],
        };
      }

      return {
        status: 200,
        message: "Friends posts retrieved successfully",
        posts: result,
      };
    } catch (error) {
      console.log(error);
    }

    return {
      status: 500,
      message: "Internal server error",
    };
  }
  static async getLatestNeighborFeed(userId) {
    try {
      const result = await db.manyOrNone(
        `SELECT np.thread_poster_id, t.thread_id, t.subject, t.timestamp as posted_at, m.message_id, 
                m.body
        FROM public.NeighborPosts as np
             JOIN public.Thread as t ON t.thread_id = np.thread_id
             JOIN public.Message as m ON m.message_id = np.message_id
             JOIN public.Neighbor as n ON n.user_id = np.thread_target_id AND n.neighbor_id = np.thread_poster_id
        WHERE np.thread_target_id = $1`,
        [userId],
      );

      if (result.length === 0) {
        return {
          status: 200,
          message: "No neighbor posts found",
          posts: [],
        };
      }

      return {
        status: 200,
        message: "Neighbor posts retrieved successfully",
        posts: result,
      };
    } catch (error) {
      console.log(error);
    }

    return {
      status: 500,
      message: "Internal server error",
    };
  }

  static async getLatestBlockFeed(userId) {
    try {
      const result = await db.manyOrNone(
        `SELECT bp.thread_poster_id, t.thread_id, t.subject, t.timestamp as posted_at, m.message_id, 
                m.body
        FROM public.BlockPosts as bp
             JOIN public.Thread as t ON t.thread_id = bp.thread_id
             JOIN public.Message as m ON m.message_id = bp.message_id
        WHERE bp.thread_target_id = $1`,
        [userId],
      );

      if (result.length === 0) {
        return {
          status: 200,
          message: "No posts found",
          posts: [],
        };
      }

      return {
        status: 200,
        message: "Block posts retrieved successfully",
        posts: result,
      };
    } catch (error) {
      console.log(error);
    }

    return {
      status: 500,
      message: "Internal server error",
    };
  }

  static async getLatestNeighborhoodFeed(userId) {
    try {
      const result = await db.manyOrNone(
        `SELECT np.thread_poster_id, t.thread_id, t.subject, t.timestamp as posted_at, m.message_id, 
                m.body
        FROM public.NeighborhoodPosts as np
             JOIN public.Thread as t ON t.thread_id = np.thread_id
             JOIN public.Message as m ON m.message_id = np.message_id
        WHERE np.thread_target_id = $1`,
        [userId],
      );

      if (result.length === 0) {
        return {
          status: 200,
          message: "No neighborhood posts found",
          posts: [],
        };
      }

      return {
        status: 200,
        message: "Neighborhood posts retrieved successfully",
        posts: result,
      };
    } catch (error) {
      console.log(error);
    }

    return {
      status: 500,
      message: "Internal server error",
    };
  }

  static async getLatestCombinedFeed(userId) {
    try {
      const result = await db.manyOrNone(
        `SELECT ap.thread_poster_id, t.thread_id, t.subject, t.timestamp as posted_at, m.message_id, 
                m.body
        FROM public.AllPosts as ap
             JOIN public.Thread as t ON t.thread_id = ap.thread_id
             JOIN public.Message as m ON m.message_id = ap.message_id
        WHERE ap.thread_target_id = $1`,
        [userId],
      );

      if (result.length === 0) {
        return {
          status: 200,
          message: "No neighborhood posts found",
          posts: [],
        };
      }

      return {
        status: 200,
        message: "Neighborhood posts retrieved successfully",
        posts: result,
      };
    } catch (error) {
      console.log(error);
    }

    return {
      status: 500,
      message: "Internal server error",
    };
  }
}

export default FeedDao;

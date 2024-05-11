import db from "../../db.js";

class DiscoverDao {
  static async searchUsers(searchKey) {
    try {
      const result = await db.manyOrNone(
        `SELECT user_id 
        FROM public.User
        WHERE (first_name || ' ' || last_name) LIKE '%' || $1 || '%' 
            OR email_address LIKE '%' || $1 || '%';`,
        [searchKey],
      );

      if (result.length === 0) {
        return {
          status: 200,
          message: "No users found matching search key",
          users: [],
        };
      }

      return {
        status: 200,
        message: "Users matching search key retrieved",
        users: result,
      };
    } catch (error) {
      console.error(error);
    }

    return {
      status: 500,
      message: "Internal server error",
    };
  }

  static async searchPosts(userId, searchKey) {
    try {
      const result = await db.manyOrNone(
        `SELECT ap.thread_poster_id, t.thread_id, m1.message_id
        FROM public.AllPosts as ap
             JOIN public.Thread as t ON ap.thread_id = t.thread_id
             JOIN public.Message as m1 ON ap.message_id = m1.message_id
             LEFT JOIN public.Reply as r ON r.thread_id = t.thread_id
             LEFT JOIN public.Message as m2 ON r.response_message_id = m2.message_id
        WHERE ap.thread_target_id = $1 
            AND (m1.body LIKE ('%' || $2 || '%') OR t.subject LIKE ('%' || $2 || '%')
            OR m2.body LIKE ('%' || $2 || '%'))`,
        [userId, searchKey],
      );

      if (result.length === 0) {
        return {
          status: 200,
          message: "No posts found matching search key",
          posts: [],
        };
      }

      const matchingPosts = result.map((element) => {
        return {
          thread_poster_id: element.thread_poster_id,
          thread_id: element.thread_id,
          message_id: element.message_id,
        };
      });

      return {
        status: 200,
        message: "Posts retrieved successfully",
        posts: matchingPosts,
      };
    } catch (error) {
      console.error(error);
    }

    return {
      status: 500,
      message: "Internal server error",
    };
  }

  static async searchPostsWithLocation(userId, searchKey, messageLocation) {
    try {
      const result = await db.manyOrNone(
        `SELECT DISTINCT ap.thread_poster_id, t.thread_id, m1.message_id
        FROM public.AllPosts as ap
             JOIN public.Thread as t ON ap.thread_id = t.thread_id
             JOIN public.Message as m1 ON ap.message_id = m1.message_id
             LEFT JOIN public.MessageLocation as ml1 ON ap.message_id = ml1.message_id
             LEFT JOIN public.Reply as r ON r.thread_id = t.thread_id
             LEFT JOIN public.Message as m2 ON r.response_message_id = m2.message_id
             LEFT JOIN public.MessageLocation ml2 ON ml2.message_id = r.response_message_id
        WHERE ap.thread_target_id = $1 AND (
          m1.body LIKE ('%' || $2 || '%') OR t.subject LIKE ('%' || $2 || '%') OR m2.body LIKE ('%' || $2 || '%')
        ) AND ((ml1.latitude = $3 AND ml1.longitude = $4) OR (ml2.latitude = $3 AND ml2.longitude = $4))  `,
        [
          userId,
          searchKey,
          messageLocation.latitude,
          messageLocation.longitude,
        ],
      );

      if (result.length === 0) {
        return {
          status: 200,
          message: "No posts found matching search key",
          posts: [],
        };
      }

      const matchingPosts = result.map((element) => {
        return {
          thread_poster_id: element.thread_poster_id,
          thread_id: element.thread_id,
          message_id: element.message_id,
        };
      });

      return {
        status: 200,
        message: "Posts retrieved successfully",
        posts: matchingPosts,
      };
    } catch (error) {
      console.error(error);
    }

    return {
      status: 500,
      message: "Internal server error",
    };
  }
}

export default DiscoverDao;

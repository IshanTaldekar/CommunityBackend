import db from "../../db.js";

class PostDao {
  static async createPost(
    userId,
    messageBody,
    messageLocation,
    threadSubject,
    visibilityRules,
  ) {
    try {
      return await db.tx(async (t) => {
        const insertMessage = await t.one(
          `INSERT INTO public.Message (body, timestamp)
          VALUES ($1, current_timestamp) 
          RETURNING message_id;`,
          [messageBody],
        );

        const newMessageId = insertMessage.message_id;

        if (messageLocation !== null) {
          await t.none(
            `INSERT INTO public.MessageLocation (message_id, latitude, longitude)
             VALUES ($1, $2, $3);`,
            [newMessageId, messageLocation.latitude, messageLocation.longitude],
          );
        }

        const insertThread = await t.one(
          `INSERT INTO public.Thread (subject, timestamp, visibility_rules, block_id)
           VALUES ($1, current_timestamp, $2, 
                    (SELECT block_id 
                     FROM public.LatestUserAddress 
                     WHERE user_id = $3)
           ) RETURNING thread_id;`,
          [threadSubject, visibilityRules, userId],
        );

        const newThreadId = insertThread.thread_id;

        const insertPost = await t.none(
          `INSERT INTO public.Post (thread_id, message_id, user_id)
          VALUES ($1, $2, $3)`,
          [newThreadId, newMessageId, userId],
        );

        return {
          status: 200,
          message: "Post successfully created",
        };
      });
    } catch (error) {
      console.error(error);
    }

    return {
      status: 500,
      message: "Internal server error",
    };
  }

  static async deletePost(userId, threadId, messageId) {
    try {
      await db.none(
        `DELETE FROM public.Post 
        WHERE thread_id = $1 AND message_id = $2 AND user_id = $3`,
        [threadId, messageId, userId],
      );

      return {
        status: 200,
        message: "Post successfully deleted",
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

export default PostDao;

import db from "../../db.js";

class ReplyDao {
  static async createReply(
    userId,
    messageBody,
    messageLocation,
    originalMessageId,
    threadId,
  ) {
    try {
      return await db.tx(async (t) => {
        const insertMessage = await t.one(
          `INSERT INTO public.Message (body, timestamp)\
          VALUES ($1, current_timestamp)\
          RETURNING message_id;`,
          [messageBody],
        );

        const newMessageId = insertMessage.message_id;

        if (messageLocation !== null) {
          await t.none(
            `INSERT INTO public.MessageLocation (message_id, latitude, longitude)\
             VALUES ($1, $2, $3)`,
            [newMessageId, messageLocation.latitude, messageLocation.longitude],
          );
        }

        await t.none(
          `INSERT INTO public.Reply (response_message_id, original_message_id, user_id, thread_id)\
          VALUES ($1, $2, $3, $4);`,
          [newMessageId, originalMessageId, userId, threadId],
        );

        return {
          status: 200,
          message: "Reply successfully created",
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

  static async deleteReply(userId, replyId) {
    try {
      await db.none(
        `DELETE FROM public.Reply\
        WHERE reply_id = $1 AND user_id = $2`,
        [replyId, userId],
      );

      return {
        status: 200,
        message: "Reply successfully deleted",
      };
    } catch (error) {
      console.error(error);
    }

    return {
      status: 500,
      message: "Internal server error",
    };
  }

  static async getAllReplies(threadId) {
    try {
      const result = await db.manyOrNone(
        `SELECT r.response_message_id, r.original_message_id, r.user_id as replying_user_id, m.body, ml.latitude, ml.longitude
        FROM public.Reply as r
            JOIN public.Message as m ON r.response_message_id = m.message_id
            LEFT JOIN public.MessageLocation as ml ON r.response_message_id = ml.message_id
        WHERE r.thread_id = $1
        ORDER BY r.response_message_id;`,
        [threadId],
      );

      if (result.length === 0) {
        return {
          status: 200,
          message: "No replies found",
          replies: [],
        };
      }

      const threadReplies = result.map((element) => {
        return {
          responseMessageId: element.response_message_id,
          originalMessageId: element.original_message_id,
          replyingUserId: element.replying_user_id,
          messageBody: element.body,
          latitude: element.latitude,
          longitude: element.longitude,
        };
      });

      return {
        status: 200,
        message: "Thread replies retrieved",
        replies: threadReplies,
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

export default ReplyDao;

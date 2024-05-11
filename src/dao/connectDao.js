import db from "../../db.js";

class ConnectDao {
  static async sendFriendRequest(requesterId, requesteeId) {
    try {
      await db.none(
        `INSERT INTO public.FriendRequest (requester_id, requestee_id)
         VALUES ($1, $2);`,
        [requesterId, requesteeId],
      );

      return {
        status: 200,
        message: "Friend request sent successfully",
      };
    } catch (error) {
      console.error(error);
    }

    return {
      status: 500,
      message: "Internal server error",
    };
  }

  static async cancelFriendRequest(requesterId, requesteeId) {
    try {
      await db.none(
        `DELETE FROM public.FriendRequest
        WHERE requester_id = $1 AND requestee_id = $2 AND response_registered = false`,
        [requesterId, requesteeId],
      );

      return {
        status: 200,
        message: "Friend request cancelled.",
      };
    } catch (error) {
      console.error(error);
    }

    return {
      status: 500,
      message: "Internal server error",
    };
  }

  static async sendFriendRequestResponse(
    requesterId,
    requesteeId,
    acceptedFlag,
  ) {
    try {
      return await db.tx(async (t) => {
        await t.none(
          `UPDATE public.FriendRequest 
          SET request_accepted = $1 AND response_registered = true
          WHERE requester_id = $2 AND requestee_id = $3`,
          [acceptedFlag, requesterId, requesteeId],
        );

        if (acceptedFlag) {
          await t.none(
            "INSERT INTO public.Friend (user_id, friend_id) VALUES ($1, $2);",
            [requesterId, requesteeId],
          );

          await t.none(
            "INSERT INTO public.Friend (user_id, friend_id) VALUES ($1, $2);",
            [requesteeId, requesterId],
          );
        }

        return {
          status: 200,
          message: "Friend request response registered successfully",
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

  static async addNeighbor(userId, neighborId) {
    try {
      await db.none(
        `INSERT INTO public.Neighbor (user_id, neighbor_id, timestamp, address_id)
        VALUES ($1, $2, current_timestamp, (
                                              SELECT address_id 
                                              FROM public.LatestUserAddress 
                                              WHERE user_id = $1
                                           )
        );`,
        [userId, neighborId],
      );

      return {
        status: 200,
        message: "Neighbor added successfully",
      };
    } catch (error) {
      console.error(error);
    }

    return {
      status: 500,
      message: "Internal server error",
    };
  }

  static async getFriendsList(userId) {
    try {
      const result = await db.manyOrNone(
        `SELECT friend_id 
        FROM public.Friend 
        WHERE user_id = $1;`,
        [userId],
      );

      if (result.length === 0) {
        return {
          status: 200,
          messages: "No friends found",
          neighbors: [],
        };
      }

      const friendIds = result.map((item) => item.friend_id);

      return {
        status: 200,
        message: "Friends list retrieved successfully",
        friends: friendIds,
      };
    } catch (error) {
      console.error(error);
    }

    return {
      status: 500,
      message: "Internal server error",
    };
  }

  static async getNeighborList(userId) {
    try {
      const result = await db.manyOrNone(
        `SELECT neighbor_id 
        FROM public.Neighbor 
        WHERE user_id = $1 AND address_id = (
              SELECT address_id 
              FROM public.LatestUserAddress 
              WHERE user_id = $1
        );`,
        [userId],
      );

      if (result.length === 0) {
        return {
          status: 200,
          messages: "No neighbors found",
          neighbors: [],
        };
      }

      const neighborIds = result.map((item) => item.neighbor_id);

      return {
        status: 200,
        message: "Friends list retrieved successfully",
        neighbors: neighborIds,
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

export default ConnectDao;

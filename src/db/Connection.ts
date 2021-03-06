import type { DatabasePool } from "slonik";
import { createPool } from "slonik";

import createSubscriber, { Subscriber } from "pg-listen";

import type { Buidl3QueryMethods } from "./Query";
import * as QueryMethods from "./Query";

export type Buidl3Subscriber = Subscriber<{ [channel: string]: any }>;
export type Buidl3Database = DatabasePool &
  Buidl3QueryMethods & { realtime: Buidl3Subscriber };

export async function create(): Promise<Buidl3Database> {
  const pool = await createPool(process.env.DB_CONNECT as string);
  const subscriber = createSubscriber({
    connectionString: process.env.DB_CONNECT as string,
  });

  const notifications = subscriber.notifications;
  const subscribe = notifications.on;

  function subscribeWithListen(
    ...parameters: Parameters<typeof notifications.on>
  ): ReturnType<typeof notifications.on> {
    const channel = parameters[0] as string;

    const result = subscribe.apply(notifications, parameters);
    subscriber.listenTo(channel);

    return result;
  }

  subscriber.notifications.on = subscribeWithListen;

  await subscriber.connect();

  return {
    ...pool,
    realtime: subscriber,
    ...(QueryMethods as Buidl3QueryMethods),
  };
}

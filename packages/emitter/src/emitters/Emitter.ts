/**
 * Function which emits a post on trigger.
 */
export type Emitter = (context: {
  delta: Record<string, number>,
  details: string
}) => Promise<boolean>;

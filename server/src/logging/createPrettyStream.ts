import pinoPretty from 'pino-pretty';

/**
 * The request id leads the line in brackets, so every line one request wrote
 * can be found by the id the app prints under a failure.
 */
const MESSAGE_FORMAT = '{if reqId}[{reqId}] {end}{msg}';

/**
 * Fields that are either noise on a single-process host (the pid, the
 * container's generated hostname) or already spelled out in the message
 * (the request id, and the request line's own fields).
 */
const IGNORED_FIELDS = 'pid,hostname,reqId,http';

const TIME_FORMAT = 'SYS:HH:MM:ss';

/**
 * A synchronous pretty-printer on stdout.
 *
 * A stream rather than a pino transport: a transport runs in a worker thread,
 * so a line written just before a crash can be lost with the process - and the
 * line before a crash is the one somebody opens the logs for. Colours follow
 * the terminal: on in a local shell, off on a host whose log viewer would print
 * the escape codes as text.
 *
 * `singleLine` keeps the remaining fields on the same line as the message, so
 * one event is one line; an error's stack is still printed in full under it.
 */
export const createPrettyStream = (): pinoPretty.PrettyStream =>
  pinoPretty({
    messageFormat: MESSAGE_FORMAT,
    ignore: IGNORED_FIELDS,
    translateTime: TIME_FORMAT,
    singleLine: true,
  });

/**
 * Credentials for the optical reader that looks at a label before a model
 * does.
 *
 * The endpoint is configured rather than written down for a reason that has
 * nothing to do with taste: Google serves the Vision API from several regional
 * hosts, and a deployment that must keep photographs of European shelves
 * inside Europe reaches a different one from a deployment that does not care.
 * Naming it here means that choice is made by whoever runs the service, which
 * is the only place it can honestly be made.
 */
export interface VisionConfig {
  readonly apiKey: string;
  /** The API's origin, without a path: the request appends its own. */
  readonly endpoint: string;
}

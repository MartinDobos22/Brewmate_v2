/** The shape every entry in the type scale has. */
export interface TypographyStyle {
  readonly fontFamily: string;
  readonly fontSize: number;
  readonly lineHeight: number;
  readonly letterSpacing: number;
  /**
   * Set only on the eyebrow styles, which are the one kind of text in the app
   * that is upper-cased.
   *
   * It belongs to the token rather than to a component because an eyebrow
   * upper-cased at one call site and not at the next is two different kinds of
   * label wearing the same name - and because the letter-spacing it is paired
   * with is only right for capitals.
   */
  readonly textTransform?: 'uppercase';
}

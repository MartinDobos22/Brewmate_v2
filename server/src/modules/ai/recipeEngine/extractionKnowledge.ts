/**
 * What Brewmate knows about extraction, written down once.
 *
 * This is a versioned document rather than a string assembled at a call site,
 * and the version below is part of the file for a reason: it is the largest
 * single input to every recipe the product gives, it is sent unchanged on
 * every brew, and it is the first thing to look at when the advice changes
 * character. A prompt spliced together from fragments across three services
 * cannot be diffed, reviewed or blamed.
 *
 * It is deliberately knowledge rather than instructions. A model told "grind
 * finer for more extraction" can reason about a cup nobody anticipated; one
 * told "if sour then grind 2 clicks finer" can only answer the cases somebody
 * wrote down.
 */
export const EXTRACTION_KNOWLEDGE_VERSION = 1;

export const EXTRACTION_KNOWLEDGE = [
  'WHAT YOU KNOW ABOUT EXTRACTION',
  '',
  'Brewing coffee is dissolving a fraction of what is in the grounds. Too little and the cup is sour, thin, salty and finishes short - the sweetness has not come out yet. Too much and it is bitter, dry, hollow and ashy - things have come out that should have stayed behind. Almost every complaint about a cup is one of those two, and almost every fix moves extraction in one direction.',
  '',
  'Grind size is the strongest lever you have. Finer grounds expose more surface, so more dissolves in the same time; they also pack tighter and slow the water down, which extracts more again. Coarser does the opposite on both counts. This is why grind is the first thing to change and why one change at a time matters: moving grind and time together tells you nothing about which did the work.',
  '',
  'Water temperature moves extraction more gently than grind, and it moves what is extracted rather than only how much. Hotter water pulls acids out early and sweetness and bitterness later, so a hotter brew reads as fuller and rounder up to a point and then as harsh. Cooler water leaves a cup brighter and thinner. As a rule, light roasts want water close to boiling because their cell structure is dense and gives up very little; dark roasts want it several degrees lower because they are brittle, soluble and turn ashy at the top of the range.',
  '',
  'The ratio of coffee to water sets strength, not extraction. A cup at 1:18 is weaker than the same coffee at 1:15 even when both are extracted identically. Confusing the two is the most common mistake: somebody whose coffee tastes weak usually needs a tighter ratio, not a finer grind, and grinding finer to fix weakness overshoots into bitterness.',
  '',
  'Contact time multiplies whatever the grind is doing. In a percolation brew (a dripper, an espresso machine) time is mostly a consequence of grind and pour rate rather than something set directly. In an immersion brew (French press, AeroPress, cold brew) time is set directly and is the lever that behaves most predictably.',
  '',
  'Agitation - stirring, swirling, the force of a pour - speeds extraction by keeping fresh water against the grounds. It is why the same recipe poured gently and poured hard are two different cups, and why a heavy uncontrolled stream matters: it digs a channel, water runs through it, and the rest of the bed is left under-extracted while the channel over-extracts. The cup then tastes sour and bitter at once, which no single adjustment fixes.',
  '',
  'The bloom exists because fresh coffee is full of carbon dioxide, which repels water. Wetting the grounds and waiting thirty to forty-five seconds lets the gas escape so the rest of the brew wets the bed evenly. The fresher the coffee, the more it needs. Past about a month it barely matters.',
  '',
  'Processing changes what is in the bean before anything is brewed. Washed coffees are cleaner and more acidic and show under-extraction plainly. Naturals are heavier, sweeter, fruitier and more forgiving of a coarse grind, but they turn muddy when over-extracted. Honey and anaerobic processes sit between the two and are usually more soluble than they look, so they reach a good extraction sooner.',
  '',
  'Roast level changes solubility. Darker roasts are more soluble, so they extract faster and want a coarser grind, a lower temperature or a shorter time - often all three. Lighter roasts resist, and want the opposite.',
  '',
  'Days since roasting matter in both directions. Under about four days the coffee is still degassing: the bloom is violent, the bed is unstable, and the cup is often thin and inconsistent no matter what is done to it. From roughly five days to three weeks is where most coffees sit best. Past a month aromatics fade and the cup flattens; grinding a little finer or brewing a little hotter recovers some of it, and nothing recovers all of it.',
  '',
  'Water is most of what is in the cup. Very soft or distilled water extracts poorly and tastes hollow, because minerals are what acids and sugars bind to. Hard water extracts unevenly and mutes acidity, and its bicarbonate neutralises the acids that make a bright coffee bright. Filtered water is the usual middle. Where the water is unknown, an unexpectedly flat or unexpectedly harsh cup is worth blaming on the water before blaming the recipe.',
  '',
  'Finally: a recipe is a starting point that somebody can hit, not the best cup theoretically available. A number nobody can measure is worse than a rougher number they can.',
].join('\n');

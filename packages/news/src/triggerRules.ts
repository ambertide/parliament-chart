export const triggerRules: ((ctx: string) => boolean)[] = [
  (ctx) => ctx.includes('milletvekili') && ctx.includes('parti değiştirdi'),
  (ctx) => ctx.includes('milletvekili') && ctx.includes('istifa'),
  (ctx) => ctx.includes('milletvekili') && ctx.includes('ihraç'),
  (ctx) => ctx.includes('milletvekili')
];

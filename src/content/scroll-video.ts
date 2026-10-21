/** Optional real footage. Leave unset until the final film is supplied. */
export const scrollVideo = {
  src: process.env.SCROLL_VIDEO_SRC || undefined,
  poster: process.env.SCROLL_VIDEO_POSTER || undefined,
  title: 'From the first brief to a working product',
  /** Match the frame rate of the encoded film for the final seekable frame. */
  fps: 30,
  chapters: [
    {
      title: 'Start with the problem.',
      body: 'Define the workflow, the audience and the outcome before designing the solution.',
    },
    {
      title: 'Make the work visible.',
      body: 'Review the interface and working features at agreed milestones.',
    },
    {
      title: 'Launch with clarity.',
      body: 'Complete the agreed checks and hand over access, accounts and documentation.',
    },
  ],
};

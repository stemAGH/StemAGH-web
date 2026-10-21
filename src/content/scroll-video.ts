/** Original rendered brand film; override with your own footage or set the source to "off". */
export const scrollVideo = {
  src:
    process.env.SCROLL_VIDEO_SRC === 'off'
      ? undefined
      : process.env.SCROLL_VIDEO_SRC || '/media/stemagh-story.mp4',
  poster: process.env.SCROLL_VIDEO_POSTER || '/media/stemagh-story-poster.jpg',
  title: 'An idea becomes a working system.',
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

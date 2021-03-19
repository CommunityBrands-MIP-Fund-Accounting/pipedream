const common = require("../../common");
const { reddit } = common.props;

module.exports = {
  ...common,
  key: "new-hot-posts-on-a-subreddit",
  name: "New hot posts on a subreddit",
  description:
    "Emits an event each time a new hot post is added to the top 10 items in a subreddit.",
  version: "0.0.21",
  type: "action",
  dedupe: "unique",
  props: {
    reddit,
    subreddit: {
      propDefinition: [reddit, "subreddit"],
    },
    g: {
      type: "string",
      label: "Locale",
      description:
        "Hot posts differ by region, and this refers to the locale you'd like to watch for hot posts. Refers to the g param in the Reddit API.",
      options: [
        "GLOBAL",
        "US",
        "AR",
        "AU",
        "BG",
        "CA",
        "CL",
        "CO",
        "HR",
        "CZ",
        "FI",
        "FR",
        "DE",
        "GR",
        "HU",
        "IS",
        "IN",
        "IE",
        "IT",
        "JP",
        "MY",
        "MX",
        "NZ",
        "PH",
        "PL",
        "PT",
        "PR",
        "RO",
        "RS",
        "SG",
        "ES",
        "SE",
        "TW",
        "TH",
        "TR",
        "GB",
        "US_WA",
        "US_DE",
        "US_DC",
        "US_WI",
        "US_WV",
        "US_HI",
        "US_FL",
        "US_WY",
        "US_NH",
        "US_NJ",
        "US_NM",
        "US_TX",
        "US_LA",
        "US_NC",
        "US_ND",
        "US_NE",
        "US_TN",
        "US_NY",
        "US_PA",
        "US_CA",
        "US_NV",
        "US_VA",
        "US_CO",
        "US_AK",
        "US_AL",
        "US_AR",
        "US_VT",
        "US_IL",
        "US_GA",
        "US_IN",
        "US_IA",
        "US_OK",
        "US_AZ",
        "US_ID",
        "US_CT",
        "US_ME",
        "US_MD",
        "US_MA",
        "US_OH",
        "US_UT",
        "US_MO",
        "US_MN",
        "US_MI",
        "US_RI",
        "US_KS",
        "US_MT",
        "US_MS",
        "US_SC",
        "US_KY",
        "US_OR",
        "US_SD",
      ],
      default: "GLOBAL",
      optional: false,
    },
    show: {
      type: "boolean",
      label: "Show all posts (ignoring filters)?",
      description:
        'If set to true, posts matching filters such us "hide links that I have voted on" will be included in the emitted event.',
      default: false,
      optional: true,
    },
    sr_detail: { propDefinition: [reddit, "sr_detail"] },
    ...common.props,
  },
  hooks: {
    async deploy() {
      // Emits sample events on the first run during deploy.
      try {
        var hot_posts = await this.reddit.getNewHotSubredditPosts(
          this.subreddit,
          this.g,
          this.show,
          this.sr_detail,
          10
        );
      } catch (err) {
        if (common.methods.did4xxErrorOccur(err)) {
          throw new Error(`
            We encountered a 4xx error trying to fetch hot posts for ${this.subreddit}. Please check the subreddit name and try again.`);
        }
        throw err;
      }
      const hot_posts_pulled = common.methods.wereThingsPulled(hot_posts);
      if (hot_posts_pulled) {
        const ordered_hot_posts = hot_posts.data.children.reverse();
        ordered_hot_posts.forEach((hot_post) => {
          this.emitRedditEvent(hot_post);
        });
      }
    },
  },
  methods: {
    ...common.methods,
    generateEventMetadata(reddit_event) {
      return {
        id: reddit_event.data.name,
        summary: reddit_event.data.title,
        ts: reddit_event.data.created,
      };
    },
    emitRedditEvent(reddit_event) {
      const emitRedditEventHandler = common.methods.emitRedditEvent.bind(this);
      emitRedditEventHandler(reddit_event);
    },
  },
  async run() {
    const hot_posts = await this.reddit.getNewHotSubredditPosts(
      this.subreddit,
      this.g,
      this.show,
      this.sr_detail,
      10
    );
    const hot_posts_pulled = common.methods.wereThingsPulled(hot_posts);
    if (hot_posts_pulled) {
      const ordered_hot_posts = hot_posts.data.children.reverse();
      ordered_hot_posts.forEach((hot_post) => {
        this.emitRedditEvent(hot_post);
      });
    }
  },
};

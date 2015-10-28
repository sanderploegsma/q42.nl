$Template({
  postDate: {
    prettyDate: function() {
      date = new Date(this.date.replace(" GMT", "").split(" ").join("T") + "Z");
      return `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`;
    },
    authorName: function() {
      return this.authorName || "Q42";
    }
  },

  otherPosts: {
    post: () => {
      blogpostIndex.find({
        id: {$ne: FlowRouter.getParam('blogpostid')},
        title: {$exists: true}
      }, {limit: 3}).fetch()
    },
    firstImage: function() {
      if (this.intro){
        this.intro.match( (/<img src="(.*?)"/) ? (/<img src="(.*?)"/)[1] : "" );
      } else if (this.link_image){
        this.link_image;
      } else {
        "";
      }
    }
  },

  latestComments: {
    comment: () => LatestComments.find({}, {sort: {date: -1}})
  }
});

Template.blogpost.helpers({
  post: () => blogpostFull.findOne()
});

Template.blogposts.helpers({
  post: () => blogpostIndex.find({}, {sort: {date: -1}}),
  readmore: () => Session.equals("lang", "en") ? "Read more" : "Lees verder"
});

Template.pageNav.helpers({
  pagination: () => Utils.getPagination(FlowRouter.getParam("pageNum") || 1),
  tag: () => FlowRouter.getParam("tag")
});

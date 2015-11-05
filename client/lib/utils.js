Utils = {

  // return the correct name of the template
  // depending on the current language
  getTemplate: (name) => {
    const enName = `en_${name}`;
    if ( Session.equals("lang", "en") && Template[enName] ){
      return enName;
    } else if ( Session.equals("lang", "en") && !Template[enName] ){
      return "error404";
    } else if ( Session.equals("lang", "nl") && !Template[name] ){
      return "error404";
    } else {
      return name;
    }
  },

  // return the pages to be displayed as pagination on the blog
  getPagination: (pageNum, tag) => {
    pageNum = pageNum * 1;
    const item = PageCounts.findOne({tag: (tag || "")});
    const pages = item ? item.count : 1;
    const lang = Session.get("lang");
    const older = lang === "en" ? "older" : "ouder";
    const newer = lang === "en" ? "newer" : "nieuwer";
    let items = [];

    if (pages !== 1){
      const page = pageNum || 1;
      if (page > 1){
        items.push({ label: newer, page: page - 1 });
      }

      const min = Math.max(1, page - 3);
      const max = Math.min(pages, page + 3);

      for (let i=min; i<=max; i++){
        items.push({ label: i, pagex: i, active: i === page });
      }

      if (page < pages){
        items.push({ label: older, page: page + 1 });
      }
    }

    return items;
  },

  // if the page is reloaded with a hash in the url,
  // scroll to the correct position
  setScrollPosition: () => {
    if (window.location.hash){
      const $el = $(window.location.hash);
      if ($el[0]){
        Meteor.setTimeout( (() => $el[0].scrollIntoView()), 100);
      } else {
        Meteor.setTimeout( (() => Utils.setScrollPosition()), 1000);
      }
    } else {
      window.scrollTo(0,0);
    }
  },

  // set the correct <title> and meta info
  setTitleAndMeta: () => {

    Meteor.startup(() => {
      Tracker.autorun(() => {
        FlowRouter.watchPathChange();

        const routeName = FlowRouter.getRouteName();
        if (routeName === "home" || routeName === undefined){
          document.title = "Q42";
        } else {
          document.title = $('h1').first().text() + " - Q42";
        }

        $("meta[property='og:title']").attr("content", document.title);
        $("meta[property='og:url']").attr("content", window.location.href);
        $("meta[property='og:image']").attr("content",
          $( ".block-large img:first-of-type").attr("src")
        );

        const desc = $(".blog-post p:not(.post-date)").first().text() ||
                     $("p:first-of-type").first().text();
        $("meta[property='og:description']").attr("content", desc);
        $("meta[name='description']").attr("content", desc);

      });
    });

  },

  getPictureURL: (user) => {
    const anon = "http://static.q42.nl/images/employees/anonymous.jpg";
    const s = user ? user.services : null;

    if (!s)               return anon;
    else if (s.twitter)   return s.twitter.profile_image_url;
    else if (s.google)    return s.google.picture;
    else if (s.facebook)  return `https://graph.facebook.com/${s.facebook.id}/picture`;
    else if (s.github)    return Gravatar.imageUrl(s.github.email || "");
    else                  return anon;
  }

};
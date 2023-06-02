// $(document).on("scroll", function() {
//     var pageTop = $(document).scrollTop();
//     var pageBottom = pageTop + $(window).height();
//     var tags = $(".text-scroll");
  
//     for (var i = 0; i < tags.length; i++) {
//       var tag = tags[i];
//       if ($(tag).position().top < pageBottom) {
//         $(tag).addClass("visible");
//       } else {
//         $(tag).removeClass("visible");
//       }
//     }
//   });
  
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    console.log(entry)
    if (entry.isIntersecting) 
    {
      entry.target.classList.add('show');
    }
    else
    {
      entry.target.classList.remove('show');
    }
  });
});

const hiddenSections = document.querySelectorAll('.scroll-section');
//tell the observer what to observe
hiddenSections.forEach((el) => observer.observe(el));

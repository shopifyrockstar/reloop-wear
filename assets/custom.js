/**
 * DEVELOPER DOCUMENTATION
 *
 * Include your custom JavaScript here.
 *
 * The theme Focal has been developed to be easily extensible through the usage of a lot of different JavaScript
 * events, as well as the usage of custom elements (https://developers.google.com/web/fundamentals/web-components/customelements)
 * to easily extend the theme and re-use the theme infrastructure for your own code.
 *
 * The technical documentation is summarized here.
 *
 * ------------------------------------------------------------------------------------------------------------
 * BEING NOTIFIED WHEN A VARIANT HAS CHANGED
 * ------------------------------------------------------------------------------------------------------------
 *
 * This event is fired whenever a the user has changed the variant in a selector. The target get you the form
 * that triggered this event.
 *
 * Example:
 *
 * document.addEventListener('variant:changed', function(event) {
 *   let variant = event.detail.variant; // Gives you access to the whole variant details
 *   let form = event.target;
 * });
 *
 * ------------------------------------------------------------------------------------------------------------
 * MANUALLY CHANGE A VARIANT
 * ------------------------------------------------------------------------------------------------------------
 *
 * You may want to manually change the variant, and let the theme automatically adjust all the selectors. To do
 * that, you can get the DOM element of type "<product-variants>", and call the selectVariant method on it with
 * the variant ID.
 *
 * Example:
 *
 * const productVariantElement = document.querySelector('product-variants');
 * productVariantElement.selectVariant(12345);
 *
 * ------------------------------------------------------------------------------------------------------------
 * BEING NOTIFIED WHEN A NEW VARIANT IS ADDED TO THE CART
 * ------------------------------------------------------------------------------------------------------------
 *
 * This event is fired whenever a variant is added to the cart through a form selector (product page, quick
 * view...). This event DOES NOT include any change done through the cart on an existing variant. For that,
 * please refer to the "cart:updated" event.
 *
 * Example:
 *
 * document.addEventListener('variant:added', function(event) {
 *   var variant = event.detail.variant; // Get the variant that was added
 * });
 *
 * ------------------------------------------------------------------------------------------------------------
 * BEING NOTIFIED WHEN THE CART CONTENT HAS CHANGED
 * ------------------------------------------------------------------------------------------------------------
 *
 * This event is fired whenever the cart content has changed (if the quantity of a variant has changed, if a variant
 * has been removed, if the note has changed...). This event will also be emitted when a new variant has been
 * added (so you will receive both "variant:added" and "cart:updated"). Contrary to the variant:added event,
 * this event will give you the complete details of the cart.
 *
 * Example:
 *
 * document.addEventListener('cart:updated', function(event) {
 *   var cart = event.detail.cart; // Get the updated content of the cart
 * });
 *
 * ------------------------------------------------------------------------------------------------------------
 * REFRESH THE CART/MINI-CART
 * ------------------------------------------------------------------------------------------------------------
 *
 * If you are adding variants to the cart and would like to instruct the theme to re-render the cart, you cart
 * send the cart:refresh event, as shown below:
 *
 * document.documentElement.dispatchEvent(new CustomEvent('cart:refresh', {
 *   bubbles: true
 * }));
 *
 * ------------------------------------------------------------------------------------------------------------
 * USAGE OF CUSTOM ELEMENTS
 * ------------------------------------------------------------------------------------------------------------
 *
 * Our theme makes extensive use of HTML custom elements. Custom elements are an awesome way to extend HTML
 * by creating new elements that carry their own JavaScript for adding new behavior. The theme uses a large
 * number of custom elements, but the two most useful are drawer and popover. Each of those components add
 * a "open" attribute that you can toggle on and off. For instance, let's say you would like to open the cart
 * drawer, whose id is "mini-cart", you simply need to retrieve it and set its "open" attribute to true (or
 * false to close it):
 *
 * document.getElementById('mini-cart').open = true;
 *
 * Thanks to the power of custom elements, the theme will take care automagically of trapping focus, maintaining
 * proper accessibility attributes...
 *
 * If you would like to create your own drawer, you can re-use the <drawer-content> content. Here is a simple
 * example:
 *
 * // Make sure you add "aria-controls", "aria-expanded" and "is" HTML attributes to your button:
 * <button type="button" is="toggle-button" aria-controls="id-of-drawer" aria-expanded="false">Open drawer</button>
 *
 * <drawer-content id="id-of-drawer">
 *   Your content
 * </drawer-content>
 *
 * The nice thing with custom elements is that you do not actually need to instantiate JavaScript yourself: this
 * is done automatically as soon as the element is inserted to the DOM.
 *
 * ------------------------------------------------------------------------------------------------------------
 * THEME DEPENDENCIES
 * ------------------------------------------------------------------------------------------------------------
 *
 * While the theme tries to keep outside dependencies as small as possible, the theme still uses third-party code
 * to power some of its features. Here is the list of all dependencies:
 *
 * "vendor.js":
 *
 * The vendor.js contains required dependencies. This file is loaded in parallel of the theme file.
 *
 * - custom-elements polyfill (used for built-in elements on Safari - v1.0.0): https://github.com/ungap/custom-elements
 * - web-animations-polyfill (used for polyfilling WebAnimations on Safari 12, this polyfill will be removed in 1 year - v2.3.2): https://github.com/web-animations/web-animations-js
 * - instant-page (v5.1.0): https://github.com/instantpage/instant.page
 * - tocca (v2.0.9); https://github.com/GianlucaGuarini/Tocca.js/
 * - seamless-scroll-polyfill (v2.0.0): https://github.com/magic-akari/seamless-scroll-polyfill
 *
 * "flickity.js": v2.2.0 (with the "fade" package). Flickity is only loaded on demand if there is a product image
 * carousel on the page. Otherwise it is not loaded.
 *
 * "photoswipe": v4.1.3. PhotoSwipe is only loaded on demand to power the zoom feature on product page. If the zoom
 * feature is disabled, then this script is never loaded.
 */

document.addEventListener("DOMContentLoaded", () => {
  var iconListeners = document.querySelectorAll(".picture-recycle-img");
  if (iconListeners.length > 1) {
    iconListeners.forEach((icon) => {
      let helper = document.createElement("span");
      helper.innerHTML = "Product created from recyclable materials";
      helper.classList = "remove-helper-view";
      helper.style.left = "-148px";
      helper.style.width = "140px";
      helper.style.top = "-8px";
      icon.append(helper);
      icon.addEventListener("mouseenter", (e) => {
        helper.style.opacity = 1;
        console.log("entered");
      });
      icon.addEventListener("mouseleave", (e) => {
        helper.style.opacity = 0;
        console.log("left");
      });
    });
  }
  let customCollections = document.querySelectorAll(
    ".custom-collection-wrapper"
  );
  customCollections.forEach((collection) => {
    var customColLeft = collection.querySelector("#arrow-left-coll");
    var customColRight = collection.querySelector("#arrow-right-coll");
    var customBullets = collection.querySelectorAll(".custom-items-coll");
    var title = collection.querySelector(".title-coll-custom");
    var positionLine = collection.querySelector(".position-line");
    var price_one = collection.querySelector(".coll-price-1");
    var price_two = collection.querySelector(".coll-price-2");
    var collection_url = collection.querySelector(".see-all-coll");
    var currency = collection.querySelector("#default_currency").innerHTML;
    customBullets.forEach((bullet) => {
      var selected_item = 0;
      var real_length = bullet.children.length;
      var length = bullet.children.length - 1;
      let position = 100.0 / real_length;
      console.log("length", length, "position", position);
      customColLeft.addEventListener("click", (e) => {
        console.log("left");
        selected_item -= 1;
        if (selected_item < 0) {
          selected_item = length;
          var revert = position * length;
          title.innerHTML =
            bullet.children[selected_item].querySelector(
              "#btn-label-coll"
            ).innerHTML;
          console.log("revert", revert);
          positionLine.style.left = revert + "%";
          console.log("children", bullet.children[selected_item]);
          let priceOneData =
            bullet.children[selected_item].querySelector(
              "#fetch-p-one"
            ).innerHTML;
          let priceTwoData =
            bullet.children[selected_item].querySelector(
              "#fetch-p-two"
            ).innerHTML;
          let collUrlData =
            bullet.children[selected_item].querySelector(
              "#fetch-p-url"
            ).innerHTML;
          price_one.innerHTML = priceOneData + currency;
          price_two.innerHTML = priceTwoData + currency;
          collection_url.href = collUrlData;
          bullet.children[selected_item].click();
        } else {
          title.innerHTML =
            bullet.children[selected_item].querySelector(
              "#btn-label-coll"
            ).innerHTML;
          var point = position * selected_item;
          console.log("position", position, point);
          positionLine.style.left = point + "%";
          let priceOneData =
            bullet.children[selected_item].querySelector(
              "#fetch-p-one"
            ).innerHTML;
          let priceTwoData =
            bullet.children[selected_item].querySelector(
              "#fetch-p-two"
            ).innerHTML;
          let collUrlData =
            bullet.children[selected_item].querySelector(
              "#fetch-p-url"
            ).innerHTML;
          price_one.innerHTML = priceOneData + currency;
          price_two.innerHTML = priceTwoData + currency;
          collection_url.href = collUrlData;
          bullet.children[selected_item].click();
        }
      });

      customColRight.addEventListener("click", (e) => {
        console.log("right");
        selected_item += 1;
        if (selected_item > length) {
          selected_item = 0;
          title.innerHTML =
            bullet.children[selected_item].querySelector(
              "#btn-label-coll"
            ).innerHTML;
          positionLine.style.left = "0%";
          let priceOneData =
            bullet.children[selected_item].querySelector(
              "#fetch-p-one"
            ).innerHTML;
          let priceTwoData =
            bullet.children[selected_item].querySelector(
              "#fetch-p-two"
            ).innerHTML;
          let collUrlData =
            bullet.children[selected_item].querySelector(
              "#fetch-p-url"
            ).innerHTML;
          price_one.innerHTML = priceOneData + currency;
          price_two.innerHTML = priceTwoData + currency;
          collection_url.href = collUrlData;
          bullet.children[selected_item].click();
        } else {
          title.innerHTML =
            bullet.children[selected_item].querySelector(
              "#btn-label-coll"
            ).innerHTML;
          var point = position * selected_item;
          console.log("position", position, point);
          positionLine.style.left = point + "%";
          let priceOneData =
            bullet.children[selected_item].querySelector(
              "#fetch-p-one"
            ).innerHTML;
          let priceTwoData =
            bullet.children[selected_item].querySelector(
              "#fetch-p-two"
            ).innerHTML;
          let collUrlData =
            bullet.children[selected_item].querySelector(
              "#fetch-p-url"
            ).innerHTML;
          price_one.innerHTML = priceOneData + currency;
          price_two.innerHTML = priceTwoData + currency;
          collection_url.href = collUrlData;
          bullet.children[selected_item].click();
        }
      });
    });
  });

  //newsletter actions
  try {
    let newsletter = document.querySelector("#newsletter");
    let newArrivals = document.querySelector("#newarrivals");
    let newPosts = document.querySelector("#newposts");

    newsletter.addEventListener("change", (e) => {
      console.log("newsletter status", e.target.checked);
      setNewsletterValue();
    });
    newArrivals.addEventListener("click", (e) => {
      console.log("newArrivals change", e.target.checked);
      setNewsletterValue();
    });
    newPosts.addEventListener("change", (e) => {
      console.log("newPosts status", e.target.checked);
      setNewsletterValue();
    });

    submitNewsletterCustomBtn = document.querySelector(
      "#submit-newsletter-custom-btn"
    );
    newsletterTerms = document.querySelector("#newsletter-terms");
    newsletterStatus = document.querySelector("#newsletter-check-status");

    submitNewsletterCustomBtn.addEventListener("click", (e) => {
      if (!newsletterTerms.checked) {
        e.preventDefault();
        newsletterStatus.innerHTML = "Please accept our terms and conditions.";
        setTimeout(() => {
          newsletterStatus.innerHTML = null;
        }, 5000);
        return false;
      } else {
        newsletterStatus.innerHTML = null;
        return true;
      }
    });
  } catch (err) {
    console.log("newsletter error on init");
  }

  //show hide events
  // let showHideButtons = document.querySelectorAll(".show-hide-wrapper");
  // showHideButtons.forEach((showHideButton) => {
  //   console.log("btb", showHideButton);
  //   let inner = showHideButton.querySelector(".show-hide-inner");
  //   let icon = showHideButton.querySelector(".custom-rotate-icon-c");
  //   var isActive = false;
  //   console.log("btb", showHideButton, inner);
  //   showHideButton.addEventListener("click", (e) => {
  //     console.log("clicked show hide");
  //     isActive = !isActive;
  //     icon.style.transform = isActive ? "rotate(0deg)" : "rotate(180deg)";
  //     inner.style.animation = isActive
  //       ? "0.3s show-content-c forwards"
  //       : "0.3s hide-content-c forwards";
  //   });
  // });

  try {
    // banner icons oneMouseEnterEvent
    let mouseEventsBanner = document.querySelectorAll(
      ".banner-mouse-event-add"
    );
    let bannerPicture = document.querySelector(".main-banner-image");
    var backupPicture = bannerPicture.style.backgroundImage;
    mouseEventsBanner.forEach((event) => {
      let pic = event.querySelector(".picture-src-banner");
      event.addEventListener("mouseenter", (e) => {
        console.log("entered");
        // bannerPicture.style.opacity = 0.4;
        setTimeout(() => {
          bannerPicture.style.backgroundImage = pic.style.backgroundImage;
          bannerPicture.style.opacity = 1;
        }, 200);
        console.log(
          "bannerPicture",
          bannerPicture,
          "backupPicture",
          backupPicture,
          "actual",
          pic.style.backgroundImage
        );
      });
      event.addEventListener("mouseleave", (e) => {
        console.log("left");
        // bannerPicture.style.opacity = 0.4;
        setTimeout(() => {
          bannerPicture.style.backgroundImage = backupPicture;
          bannerPicture.style.opacity = 1;
        }, 200);
      });
    });
  } catch (e) {
    console.log("error on mouseevent", e);
  }

  //Function list/grid view
  try {
    let list = document.querySelector("#list-id-demo");
    let grid = document.querySelector("#grid-id-demo");
    let details = document.querySelector("#details-id-demo");
    let onInitWrapper = document.querySelector(
      ".initialize-products-grid-wrapper"
    );

    //append all first

    let allListProducts = document.querySelectorAll(
      ".product-grid-item-hidden"
    );
    list.classList.add("active-item-cc");
    allListProducts.forEach((item) => {
      item.style.display = "block";
      onInitWrapper.append(item);
    });

    // let allListProducts2 = document.querySelectorAll('.product-detail-item-hidden');
    // allListProducts2.forEach(item2 => {
    //   item2.style.display = "none";
    //   onInitWrapper.append(item2);
    // })

    list.addEventListener("click", () => {
      console.log("clicked list");
      list.classList.add("active-item-cc");
      onInitWrapper.classList.remove("initialize-products-grid-wrapper-flex");
      let allListProducts = document.querySelectorAll(
        ".product-grid-item-hidden"
      );
      allListProducts.forEach((item) => {
        item.style.display = "block";
      });
      grid.classList.remove("active-item-cc");
      let allListProducts2 = document.querySelectorAll(
        ".product-detail-item-hidden"
      );
      allListProducts2.forEach((item2) => {
        item2.style.display = "none";
      });
    });
    grid.addEventListener("click", () => {
      console.log("clicked grid");
      list.classList.remove("active-item-cc");
      grid.classList.add("active-item-cc");
      onInitWrapper.classList.remove("initialize-products-grid-wrapper-flex");
      let allListProducts = document.querySelectorAll(
        ".product-grid-item-hidden"
      );
      allListProducts.forEach((item) => {
        item.style.display = "none";
        // onInitWrapper.append(item);
      });

      let allListProducts2 = document.querySelectorAll(
        ".product-detail-item-hidden"
      );
      allListProducts2.forEach((item2) => {
        item2.style.display = "block";
        // onInitWrapper.append(item2);
      });
    });
    detail.addEventListener("click", () => {
      console.log("clicked detail");
    });
  } catch (e) {
    console.log("Error on pre-load list-grid-details view");
  }

  // filter collection view
  try {
    let capsuleSizeEvents = document.querySelector("[capsule-size-filter]");
    let capsuleSizeCheckbox = capsuleSizeEvents.querySelectorAll(
      "[input-size-filter]"
    );
    var capsulesParent = document.querySelector("capsules-js-events");
    var capsules = capsulesParent.querySelectorAll(
      "[collection-capsule-data-inner]"
    );
    let result = document.querySelector("#selected-val-facet");
    let clearAll = document.querySelector("#clear-all-facet");
    let capsuleSizeData = {};
    capsuleSizeCheckbox.forEach((capsuleSize) => {
      capsuleSize.addEventListener("change", (e) => {
        result.innerHTML = null;
        capsuleSizeCheckbox.forEach((cc) => {
          let lowerValue = cc.value.toLowerCase().replace(/\s/g, "");
          capsuleSizeData[lowerValue] = cc.checked ? "yes" : "no";
          if (cc.checked === true) {
            let innerFacet = document.createElement("span");
            innerFacet.className = "tag";
            innerFacet.innerHTML = cc.value;
            result.append(innerFacet);
            innerFacet.addEventListener("click", () => {
              capsuleSizeData[lowerValue] = "no";
              innerFacet.parentNode.removeChild(innerFacet);
              for (var i = 0; i < capsuleSizeData.length; i++) {
                console.log("v", capsuleSizeData[i]);
              }
              if (capsuleSizeData.includes("yes")) {
                console.log("here1");
                filter(capsules, capsuleSizeData, capsulesParent);
              } else {
                console.log("here2 new custom filter");
                console.log(
                  "capsuleSizeData2",
                  capsuleSizeData,
                  capsuleSizeData.some((elem) => Object.is(elem, true))
                );
                result.innerHTML = null;
                capsuleSizeCheckbox.forEach((cc) => {
                  cc.checked = false;
                });
                capsulesParent.innerHTML = null;
                capsules.forEach((capsule, index) => {
                  capsulesParent.append(capsule);
                });
              }
              cc.checked = false;
            });
          } else {
            filter(capsules, capsuleSizeData, capsulesParent);
          }
          // capsules.forEach(capsule => {
          //   const tags = capsule.querySelector("#coll-tags").innerText.toLowerCase();
          //   const price = capsule.querySelector("#coll-price").innerText.toLowerCase();
          //   const title = capsule.querySelector("#coll-title").innerText.toLowerCase();
          //   if(tags.includes(cc.value.toLowerCase())) {
          //     filtered.append(capsule);
          //   }

          // })
        });
      });
    });
    clearAll.addEventListener("click", () => {
      result.innerHTML = null;
      capsuleSizeCheckbox.forEach((cc) => {
        cc.checked = false;
      });
      capsulesParent.innerHTML = null;
      capsules.forEach((capsule, index) => {
        capsulesParent.append(capsule);
      });
    });
    var showMoreClicked = false;
    let showMore = document.querySelector("#show-more-ccc");
    showMore.addEventListener("click", () => {
      console.log("show more clicked");
      showMoreClicked = !showMoreClicked;
      showMore.innerText = showMoreClicked ? "Show less" : "Show more";
      console.log("length", capsulesParent.children.length);
      for (i = 0; i < capsulesParent.children.length; i++) {
        console.log("child", capsulesParent.children[i]);
        if (showMoreClicked && i >= 5) {
          capsulesParent.children[i].classList.remove("coll-hide-imp");
        } else if (i >= 5) {
          capsulesParent.children[i].classList.add("coll-hide-imp");
        }
      }
      // capsulesParent.children.forEach((child, index) => {
      //   if(showMoreClicked && index >= 5) {
      //     child.className.remove("coll-hide-imp");
      //   } else if (index >= 5) {
      //     child.className.add("coll-hide-imp");
      //   }
      // });
    });
  } catch (err) {
    console.log("Error collection filter:", err);
  }

  //switcher functionalities
  try {
    var switcherTitles = document.querySelectorAll("[switcher-action-d]");
    var switcherContent = document.querySelectorAll("[switcher-content-d]");
    switcherTitles.forEach((switcher) => {
      switcher.addEventListener("click", (e) => {
        switcherContent.forEach((content) => {
          let value = content.getAttribute("data-val");
          console.log("is valid?", e.target.id, value);
          // let bla = document.querySelector("#" + e.target.id);
          if (e.target.id === value) {
            console.log("is valid=yes=", e.target.id, value);
            switcher.className = "active-border switcher-action-d";

            // switcher.style.borderBottom = "solid 1px #0F9453!important";
            // switcher.style.color = "#0F9453!important";
            content.style.display = "block";
          } else {
            switcher.className = "switcher-action-d";
            // e.target.classList.remove("active-border");
            // switcher.style.borderBottom = "solid 1px transparent!important";
            // switcher.style.color = "rgba(38, 38, 38, 0.7)!important";
            content.style.display = "none";
          }
        });
      });
    });
  } catch (e) {
    console.log("Error on switcher", e);
  }

  // make scroll
  try {
    var lastKnownScrollPosition = 0;
    const scrollDiv = document.querySelector(".new-pic-wrapper");
    const profInfoWrapper = document.querySelector(".product__info")
    const prodInfo = document.querySelector(".prod__info_keep__active");
    const pictureSize = document.querySelector(".new-pic-img");
    const pictures = document.querySelectorAll("[bullet-picture]");
    const bulletEvents = document.querySelectorAll(".bullet-circle-point");
    const size = pictureSize.children.length - 1;
    const bullets = document.querySelector(".bullets-new-pic");
    const onChangeSize = pictureSize.clientHeight / size;
    const positionStatic = 117;
    const posHeightOffset = scrollDiv.offsetTop;
    const mainHeightProd =  prodInfo.clientHeight;
    var counter = positionStatic;
    var lastPosition = 0;
      console.log("bullet initiated2", bulletEvents)
      bulletEvents.forEach(bulletEvent => {
        console.log("bullet event", bulletEvent);
        bulletEvent.addEventListener("click", () => {
          const id = bulletEvent.getAttribute("id");
          console.log("id", bulletEvent.getAttribute("id"));
          console.log("bullet clicked");
          pictures.forEach((picture) => {
            //  let pos = picture.offsetTop - document.body.scrollHeight;
            let bulletVal = picture.getAttribute("bullet-data");
            if(id === bulletVal) {
              // window.scrollY = picture.offsetTop;
              bulletEvent.style.background = "black";

              window.scrollTo({
                top: picture.offsetTop + 30,
                left: 0,
                behavior: 'smooth'
              });
            } else {
              bulletEvent.style.background = "transparent";
            }
          })
        })
      })
    if (size > 1) {
      document.addEventListener("scroll", function (e) {
        lastKnownScrollPosition = window.scrollY;
        scrollPosition = 117;
        console.log(
          "scroll...",
          window.scrollY,
          scrollDiv.clientHeight,
          prodInfo.clientHeight,
          size,
          onChangeSize,
          positionStatic
        );
        if (
          window.scrollY > 117 &&
          window.scrollY < scrollDiv.clientHeight + 117 - 30
        ) {
          lastPosition = window.scrollY;
          if (
            window.scrollY <
            scrollDiv.clientHeight  + posHeightOffset - mainHeightProd
          ) {
            prodInfo.style.position = "fixed";
            prodInfo.style.top = (posHeightOffset + positionStatic) + "px";
            prodInfo.style.width = "32%";
            prodInfo.style.marginTop = "25px";
          } else if (
            window.scrollY >
            scrollDiv.clientHeight + posHeightOffset - mainHeightProd
          ) {
            prodInfo.style.position = "initial";
            prodInfo.style.width = "100%";
            prodInfo.style.marginTop = scrollDiv.clientHeight + posHeightOffset - mainHeightProd + "px";
          }

          // if(window.scrollY <= 140) {
          // prodInfo.style.position = "fixed";
          // prodInfo.style.top =  positionStatic + "px";
          // counter = 0;
          // prodInfo.scrollTop = positionStatic;
          // } else {
          //   counter -= 2;
          //   prodInfo.style.position = "fixed";
          //   prodInfo.style.top =  counter + "px";
          // }



          
          bullets.style.position = "fixed";
          bullets.style.top = scrollPosition + "px";
          bullets.style.width = "30px";
          pictures.forEach((picture) => {
            //  let pos = picture.offsetTop - document.body.scrollHeight;
            let pos =
              picture.clientHeight + picture.offsetTop - window.scrollY;
            let bulletVal = picture.getAttribute("bullet-data");
            if (bulletVal === "bullet-id-1") {
              console.log(bulletVal, pos);
            }
            let bullet = document.querySelector("#" + bulletVal);
            if (bullet !== null && bullet !== undefined) {
              // console.log("bullet val", bullet);
              bullet.style.background =
               pos > 10 && pos < picture.clientHeight
                  ? "black"
                  : "transparent";
              // console.log("bullet", bullet);
            } else {
              console.log("no bullet");
            }
          });

          // scrollDiv.style.height = "900px";
          // scrollDiv.style.overflow = "scroll";
        } else if (window.scrollY < 117) {
                    prodInfo.style.position = "initial";
          prodInfo.style.top = "0px";
          prodInfo.style.marginTop = "0px";
          prodInfo.style.width = "100%";
          bullets.style.position = "initial";
          bullets.style.top = "0px";
          bullets.style.width = "100%";
        } else {

          bullets.style.position = "initial";
          bullets.style.top = "0px";
          bullets.style.width = "100%";
          // scrollDiv.style.height = "auto";
          // scrollDiv.style.overflow = "none";
        }
      });
    }
    console.log("scroll did", scrollDiv);
  } catch (e) {
    console.log("error on scroll data", e);
  }
});

const filter = (capsules, capsuleSizeData, capsulesParent) => {
  console.log("capsule sizes", capsuleSizeData);
  let filtered = [...capsules].filter((capsule) => {
    const tags = capsule.querySelector("#coll-tags").innerText.toLowerCase();
    const price = capsule.querySelector("#coll-price").innerText.toLowerCase();
    const title = capsule.querySelector("#coll-title").innerText.toLowerCase();
    let tt = JSON.parse(tags);
    if (tt !== null && tt !== undefined && tt.length !== 0) {
      for (var i = 0; i < tt.length; i++) {
        if (tt[i] !== undefined && tt[i] !== null) {
          if (capsuleSizeData[tt[i]] === "yes") {
            return true;
          }
        }
      }
    }
    return false;
  });
  // capsules.innerHTML = null;
  capsulesParent.innerHTML = null;
  filtered.forEach((ffa) => {
    capsulesParent.append(ffa);
  });
};

function setNewsletterValue() {
  let newsletter = document.querySelector("#newsletter");
  let newArrivals = document.querySelector("#newarrivals");
  let newPosts = document.querySelector("#newposts");
  let newsletterMain = document.querySelector("#newsletter-main");
  var values = "";
  if (newsletter.checked) {
    values += newsletter.value;
  }
  if (newArrivals.checked) {
    values += "," + newArrivals.value;
  }
  if (newPosts.checked) {
    values += "," + newPosts.value;
  }
  newsletterMain.value = values;
}


var ellipsestext = "...";
var moretext = "Show more >";
var lesstext = "Show less";

function ShowMore(showChar, element){
  var content = element.html();

  if(content.length > showChar) {
      var c = content.substr(0, showChar);
      var h = content.substr(showChar, content.length - showChar);
      var html = c + '<span class="moreellipses">' + ellipsestext+ '&nbsp;</span><span class="morecontent"><span>' + h + '</span>&nbsp;&nbsp;<a href="" class="morelink">' + moretext + '</a></span>';
      element.html(html);
  }
}

$('.has-show-more').each(function() {
  var showChar = 550;  // How many characters are shown by default
  var element = $(this);
  ShowMore(showChar, element);
});
$('.size-chart-content').each(function() {
  var showChar = 80;  // How many characters are shown by default
  var element = $(this);
  ShowMore(showChar, element);
});

$(".morelink").click(function(){
    if($(this).hasClass("less")) {
        $(this).removeClass("less");
        $(this).html(moretext);
    } else {
        $(this).addClass("less");
        $(this).html(lesstext);
    }
    $(this).parent().prev().toggle();
    $(this).prev().toggle();
    return false;
});


$('.tab-title-wrapper').click(function(){
  $(this).closest(".product-form__tab").toggleClass('active');
  // $(this).closest(".product-form__tab").siblings().removeClass('active'); 
  $(this).closest(".product-form__tab").find('.tab-content-wrapper').stop().slideUp();
  $(this).closest(".product-form__tab.active").find('.tab-content-wrapper').stop().slideDown();
  return false;
});

$('.size-chart-title').click(function(){
  $('.modal-wrapper').addClass('active');
})
$('.modal-close').click(function(){
  $('.modal-wrapper').removeClass('active');
})

$('.tabs-wrapper .title-wrapper .tab-title').click(function(){
  $(this).siblings().removeClass('active');
  $(this).addClass('active');
  var target_class_name = $(this).attr('id');
  $('.individual-tab-content-wrapper').removeClass('active');
  $('.' + target_class_name).addClass('active');
})

$('.switch-input').change(function() {
  if(this.checked) {
    $('.centi-table').addClass('active');
    $('.inch-table').removeClass('active');
  }else{
    $('.centi-table').removeClass('active');
    $('.inch-table').addClass('active');
  }
});

$('.modal-slider-wrapper').slick({
  centerMode: true,
  centerPadding: '100px',
  infinite: true,
  arrows: true,
  slidesToShow: 2,
  slidesToScroll: 1,
  prevArrow:'<img class="arrow-prev arrow-button" src="https://cdn.shopify.com/s/files/1/0381/8707/3668/files/prev.png?v=1664300195">',
  nextArrow:'<img class="arrow-next arrow-button" src="https://cdn.shopify.com/s/files/1/0381/8707/3668/files/next.png?v=1664300208">'  
});

$('.product__zoom-button').click(function(){
  $('#myModal').addClass('active');
})
$('#myModal .close').click(function(){
  $('#myModal').removeClass('active');
})
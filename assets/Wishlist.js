const LOCAL_STORAGE_WISHLIST_KEY = "shopify-wishlist";
const LOCAL_STORAGE_DELIMITER = ",";
const BUTTON_ACTIVE_CLASS = "active";
const GRID_LOADED_CLASS = "loaded";

const selectors = {
  button: "[button-wishlist]",
  grid: "[grid-wishlist]",
  productCard: ".product-card",
  button_circle: "[button-wishlist-circle]",
};

document.addEventListener("DOMContentLoaded", () => {
  let wishlist = getWishlist();
  if (wishlist.length === 0) {
    resetWishlist();
  }
  initButtons();
  // console.log("widndow location 1", window.location);
  initCircleButtons();
  initGrid();
  addToBagEvents();
  onDragEvent();
  updateBubble();
});

document.addEventListener("shopify-wishlist:updated", (event) => {
  console.log("[Shopify Wishlist] Wishlist Updated ✅", event.detail.wishlist);
  updateBubble();
  initGrid();
});

document.addEventListener("shopify-wishlist:init-product-grid", (event) => {
  console.log(
    "[Shopify Wishlist] Wishlist Product List Loaded ✅",
    event.detail.wishlist
  );
});

document.addEventListener("shopify-wishlist:init-buttons", (event) => {
  console.log(
    "[Shopify Wishlist] Wishlist Buttons Loaded ✅",
    event.detail.wishlist
  );
  let wishlist = getWishlist();
  if (wishlist.length === 0) {
    console.log("wishlist_empty");
    var arr = [];
    for (var i = 0; i < 12; i++) {
      arr.push("empty");
    }
    updateWishlist(arr, null, false);
  }
  console.log("initialized", getWishlist());
});

document.addEventListener("shopify-wishlist:init-buttons-circle", (event) => {
  console.log(
    "[Shopify Wishlist] Wishlist Buttons Loaded ✅",
    event.detail.wishlist
  );
  let wishlist = getWishlist();
  if (wishlist.length === 0) {
    console.log("wishlist_empty");
    var arr = [];
    for (var i = 0; i < 12; i++) {
      arr.push("empty");
    }
    updateWishlist(arr, null, false);
  }
  console.log("initialized -circle", getWishlist());
});

const fetchProductCardHTML = (handle, grid, index) => {
  if (handle === "empty") {
    let emptyCapsuleWrapper = document.createElement("div");
    emptyCapsuleWrapper.setAttribute("draggable", true);
    emptyCapsuleWrapper.id = "drag_id_" + index;
    emptyCapsuleWrapper.setAttribute("allow-drag", true);

    emptyCapsuleWrapper.classList = "empty-capsule-wrapper";
    // emptyCapsuleWrapper.setAttribute("draggeable", true);
    let emptyCapsuleChild = document.createElement("div");
    emptyCapsuleWrapper.setAttribute("allow-drag", true);

    emptyCapsuleChild.classList = "empty-capsule-child";

    let buttonIcon = document.createElement("span");
    buttonIcon.classList = "add-capsule-icon";
    buttonIcon.style.backgroundImage =
      "url(\"data:image/svg+xml,%3Csvg width='34' height='34' viewBox='0 0 34 34' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M18.6673 8.66683H15.334V15.3335H8.66732V18.6668H15.334V25.3335H18.6673V18.6668H25.334V15.3335H18.6673V8.66683ZM17.0007 0.333496C7.80065 0.333496 0.333984 7.80016 0.333984 17.0002C0.333984 26.2002 7.80065 33.6668 17.0007 33.6668C26.2007 33.6668 33.6673 26.2002 33.6673 17.0002C33.6673 7.80016 26.2007 0.333496 17.0007 0.333496ZM17.0007 30.3335C9.65065 30.3335 3.66732 24.3502 3.66732 17.0002C3.66732 9.65016 9.65065 3.66683 17.0007 3.66683C24.3507 3.66683 30.334 9.65016 30.334 17.0002C30.334 24.3502 24.3507 30.3335 17.0007 30.3335Z' fill='%23909090'/%3E%3C/svg%3E%0A\")";

    emptyCapsuleChild.append(buttonIcon);
    emptyCapsuleWrapper.append(emptyCapsuleChild);
    return {
      productPrice: 0,
      capsule: emptyCapsuleWrapper,
      capsuleButton: null,
      type: "empty",
    };
  } else {
    var prod_handle = "";
    var isVariant = false;
    var variant = "";
    console.log("index", index);
    if (handle.includes("?variant=")) {
      let values = handle.split("?variant=");
      isVariant = true;
      prod_handle = values[0];
      variant = values[1];
    } else {
      prod_handle = handle;
    }
    const productTileTemplateUrl = `/products/${prod_handle}.js`;
    return fetch(productTileTemplateUrl)
      .then((res) => res.json())
      .then((product) => {
        console.log("res", product, isVariant, prod_handle, variant);
        var variantData = [];
        if (isVariant) {
          product.variants.forEach((variantVal) => {
            if (String(variantVal.id) === variant) {
              variantData = variantVal;
            }
          });
        }
        var productPrice = 0;
        let capsuleChild = document.createElement("div");
        capsuleChild.classList = "capsule-child";
        capsuleChild.setAttribute("draggable", true);
        capsuleChild.id = "drag_id_" + index;
        capsuleChild.setAttribute("allow-drag", true);
        capsuleChild.addEventListener("dragstart", (e) => {
          console.log("drag start", e.target);
          e.dataTransfer.setData("bla", e.target.id);
        });
        if (isVariant) {
          capsuleChild.setAttribute("product-id", variantData.id);
        } else {
          capsuleChild.setAttribute("product-id", product.id);
        }

        let buttonsWrapper = document.createElement("div");
        buttonsWrapper.classList = "buttons-wrapper";

        let helper = document.createElement("span");
        helper.innerHTML = "Remove from My Capsule";
        helper.classList = "remove-helper-view";
        helper.style.left = "-170px";
        helper.style.top = "3px";
        let capsuleButton = document.createElement("button");
        capsuleButton.className = "capsule-button-main";
        let outerCapsuleCircle = document.createElement("div");
        outerCapsuleCircle.className = "button-circle-filled";

        capsuleButton.append(outerCapsuleCircle);
        capsuleButton.append(helper);
        buttonsWrapper.append(capsuleButton);

        capsuleButton.addEventListener("mouseenter", (e) => {
          helper.style.opacity = 1;
        });
        capsuleButton.addEventListener("mouseleave", (e) => {
          helper.style.opacity = 0;
        });
        capsuleButton.addEventListener("click", (e) => {
          if (isVariant) {
            updateWishlist(handle, null, false);
          } else {
            updateWishlist(handle, null, false);
          }
          // grid.removeChild(capsuleChild);
        });

        let imgDiv = document.createElement("div");
        imgDiv.classList = "capsule-image";
        console.log("aa", product.images, "variantData", variantData);
        if (isVariant) {
          product.images.forEach((media) => {
            if (media.id === variantData.image_id) {
              imgDiv.style.backgroundImage = `url("${media.src}")`;
            }
          });
        } else {
          imgDiv.style.backgroundImage = `url("${product.featured_image}")`;
        }

        if (variantData.available === false || product.available === false) {
          let outOfStockWrapper = document.createElement("div");
          outOfStockWrapper.classList = "capsule-out-of-stock";
          let text = document.createElement("p");
          text.innerHTML = "Out of stock";
          outOfStockWrapper.append(text);
          imgDiv.append(outOfStockWrapper);
        }

        let title = document.createElement("span");
        title.innerHTML = product.title;

        let options = document.createElement("span");
        let optionString = "";
        let priceDiv = document.createElement("div");
        priceDiv.className = "price-wrapper";
        let price = document.createElement("span");
        let compareAtPrice = document.createElement("span");
        compareAtPrice.className = "compare-at-price";
        var priceCompare = 0;
        let priceString = "";
        let symbol = document.querySelector("#default_currency").innerHTML;
        if (isVariant) {
          if (
            variantData.option1 !== undefined &&
            variantData.option1 !== null
          ) {
            optionString = variantData.option1;
            if (
              variantData.option2 !== undefined &&
              variantData.option2 != null
            ) {
              optionString += " | " + variantData.option2;
            }
            if (
              variantData.option3 !== undefined &&
              variantData.option3 != null
            ) {
              optionString += " |" + variantData.option3;
            }
            options.innerHTML = optionString;
          } else {
            options.innerHTML = null;
          }
          price.innerHTML =
            (variantData.price / 100)
              .toFixed(2)
              .replace(/\d(?=(\d{3})+\.)/g, "$&,") + symbol;
          productPrice = variantData.price / 100;
          compareAtPrice.innerHTML =
            (variantData.compare_at_price / 100)
              .toFixed(2)
              .replace(/\d(?=(\d{3})+\.)/g, "$&,") + symbol;
          priceCompare = variantData.compare_at_price / 100;
        } else {
          if (product.variants[0] !== undefined) {
            if (
              product.variants[0].option1 !== undefined &&
              product.variants[0].option1 !== null
            ) {
              optionString = product.variants[0].option1;
              if (
                product.variants[0].option2 !== undefined &&
                product.variants[0].option2 != null
              ) {
                optionString += " | " + product.variants[0].option2;
              }
              if (
                product.variants[0].option3 !== undefined &&
                product.variants[0].option3 != null
              ) {
                optionString += " |" + product.variants[0].option3;
              }
              if (!optionString.includes("Default Title")) {
                options.innerHTML = optionString;
              }
            } else {
              options.innerHTML = null;
            }
            price.innerHTML =
              (product.variants[0].price / 100)
                .toFixed(2)
                .replace(/\d(?=(\d{3})+\.)/g, "$&,") + symbol;
            productPrice = product.variants[0].price / 100;
            compareAtPrice.innerHTML =
              (product.variants[0].compare_at_price / 100)
                .toFixed(2)
                .replace(/\d(?=(\d{3})+\.)/g, "$&,") + symbol;
            priceCompare = product.variants[0].compare_at_price / 100;
          } else {
            options.innerHTML = null;
            price.innerHTML = null;
          }
        }

        if (priceCompare >= productPrice) {
          priceDiv.append(compareAtPrice);
          priceDiv.append(price);
        } else {
          priceDiv.append(price);
        }
        // product.product.variants.forEach( (variant,index) => {
        //   if (index == 0) {
        //     optionString += " " + variant.title
        //     priceString = variant.price
        //   }
        // })

        let quickButtonsWrapper = document.createElement("div");
        quickButtonsWrapper.className = "capsule-quick-b-wrapper";

        let quickViewButton = document.createElement("button");
        quickViewButton.className = "capsuie-quick-view-btn";
        quickViewButton.innerHTML = "Quick View";

        quickViewButton.onclick = () => {
          let quickDrawer = document.querySelector(".quick-drawer-1");
          let mainBtn = document.querySelector(
            ".hidden-quickview-product-test"
          );
          var id =
            "product-template--15212196036800__main--" + product.id + "-drawer";
          if (isVariant) {
            id =
              "product-template--15212196036800__main--" +
              variantData.id +
              "-drawer";
          }
          quickDrawer.setAttribute("id", id);
          quickDrawer.setAttribute(
            "href",
            "/products/" + prod_handle + "?view=quick-buy-drawer"
          );
          mainBtn.setAttribute("aria-controls", id);

          mainBtn.click();
        };

        let quickAddToCartButton = document.createElement("button");
        quickAddToCartButton.className = "add-to-bag-capsule2";
        let quicnAddIcon = document.createElement("i");
        quicnAddIcon.className = "add-to-capsule-icon";
        let quickAddTitle = document.createElement("span");
        quickAddTitle.id = "quick-add-capsule-" + product.id;
        quickAddTitle.innerHTML = "Add to My Bag";

        quickAddToCartButton.onclick = () => {
          addToBagSingleEvent(handle, product.id);
        };

        quickAddToCartButton.append(quicnAddIcon);
        quickAddToCartButton.append(quickAddTitle);

        quickButtonsWrapper.append(quickViewButton);
        quickButtonsWrapper.append(quickAddToCartButton);

        capsuleChild.append(imgDiv);
        capsuleChild.append(title);
        capsuleChild.append(options);
        capsuleChild.append(priceDiv);
        capsuleChild.append(buttonsWrapper);
        capsuleChild.append(quickButtonsWrapper);

        // const text = res;
        // const parser = new DOMParser();
        // const htmlDocument = parser.parseFromString(text, 'text/html');
        // const productCard = htmlDocument.documentElement.querySelector(selectors.productCard);
        return {
          productPrice: productPrice,
          capsule: capsuleChild,
          capsuleButton: capsuleButton,
          type: "product",
        };
      })
      .catch((err) =>
        console.error(
          `[Shopify Wishlist] Failed to load content for handle: ${handle}`,
          err
        )
      );
  }
};

const setupGrid = async (grid) => {
  grid.innerHTML = "";
  let symbol = document.querySelector("#default_currency").innerHTML;
  let realPrice = document.querySelector("#real_price_capsule");
  let mainPrice = document.querySelector("#main_price_capsule");
  let discount = document.querySelector(".capsule-discount");
  var totalPrice = 0;
  const wishlist = getWishlist();
  const requests = wishlist.map((handle, index) =>
    fetchProductCardHTML(handle, grid, index)
  );
  const responses = await Promise.all(requests);
  let p = document.createElement("p");
  p.innerHTML = "Add 4 more products for 8% discount:";
  p.classList = "bla";
  grid.append(p);

  let p1 = document.createElement("p");
  p1.classList = "bla1";
  p1.innerHTML = "Add 4 more products for 12% discount:";
  grid.append(p1);

  responses.forEach((response, index) => {
    totalPrice = totalPrice + response.productPrice;
    grid.append(response.capsule);
  });
  var nonEmpty = responses.filter((r) => r.type !== "empty");
  var length = nonEmpty.length - 1;
  console.log("length", length);
  if (length < 3) {
    mainPrice.innerHTML =
      totalPrice.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,") + symbol;
    realPrice.innerHTML = null;
    discount.innerHTML = null;
  } else {
    if (length >= 3 && length < 7) {
      discount.innerHTML = "Save 4% ";
      mainPrice.innerHTML =
        (totalPrice - (4.0 / 100) * totalPrice)
          .toFixed(2)
          .replace(/\d(?=(\d{3})+\.)/g, "$&,") + symbol;
      realPrice.innerHTML =
        totalPrice.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,") + symbol;
    } else if (length >= 7 && length < 11) {
      discount.innerHTML = "Save 8%";
      mainPrice.innerHTML =
        (totalPrice - (8.0 / 100) * totalPrice)
          .toFixed(2)
          .replace(/\d(?=(\d{3})+\.)/g, "$&,") + symbol;
      realPrice.innerHTML =
        totalPrice.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,") + symbol;
    } else if (length >= 11) {
      discount.innerHTML = "Save 12%";
      mainPrice.innerHTML =
        (totalPrice - (12.0 / 100) * totalPrice)
          .toFixed(2)
          .replace(/\d(?=(\d{3})+\.)/g, "$&,") + symbol;
      realPrice.innerHTML =
        totalPrice.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,") + symbol;
    } else {
      mainPrice.innerHTML = 0 + symbol;
      realPrice.innerHTML = null;
      discount.innerHTML = null;
    }
  }
  // console.log("responses", responses);
  // const wishlistProductCards = responses.join('');
  // grid.innerHTML = wishlistProductCards;
  // grid.classList.add(GRID_LOADED_CLASS);
  initButtons();
  initCircleButtons();

  const event = new CustomEvent("shopify-wishlist:init-product-grid", {
    detail: { wishlist: wishlist },
  });
  document.dispatchEvent(event);
};

const setupButtons = (buttons) => {
  buttons.forEach((button) => {
    let text = button.children[1];
    const productHandle = button.dataset.productHandle || false;
    if (!productHandle)
      return console.error(
        "[Shopify Wishlist] Missing `data-product-handle` attribute. Failed to update the wishlist."
      );
    if (wishlistContains(productHandle)) text.innerHTML = "Added to My Capsule";
    button.classList.add(BUTTON_ACTIVE_CLASS);
    button.addEventListener("click", () => {
      updateWishlist(productHandle, text, true);
      button.classList.toggle(BUTTON_ACTIVE_CLASS);
    });
  });
};

const setupCircleButtons = (buttons) => {
  buttons.forEach((button) => {
    console.log("button circle initialized...");
    let helper = document.createElement("span");
    helper.classList = "remove-helper-view";
    button.append(helper);
    // let text = button.children[1];
    const productHandle = button.dataset.productHandle || false;
    if (!productHandle)
      return console.error(
        "[Shopify Wishlist] Missing `data-product-handle` attribute. Failed to update the wishlist."
      );
    console.log("product circle handle", productHandle);
    var exist = wishlistContains(productHandle);
    var classN = exist ? "button-circle-filled" : "button-circle-clear";
    helper.innerHTML = exist ? "Remove from My Capsule" : "Add to My Capsule";
    helper.style.left = exist ? "-160px" : "-120px";
    // if (wishlistContains(productHandle)){
    // button.classList.add(BUTTON_ACTIVE_CLASS);
    button.children[0].className = classN;
    if(button.getAttribute("isLoaded") === "false"){
      button.setAttribute("isLoaded", true);
      button.addEventListener("click", (e) => {
        button.eventLoaded = "true";
        e.preventDefault();
        var exist = wishlistContains(productHandle);
        var classN = exist ? "button-circle-clear" : "button-circle-filled";
        helper.innerHTML = exist ? "Add to My Capsule" : "Remove from My Capsule";
        helper.style.left = exist ? "-120px" : "-160px";
        button.children[0].className = classN;
        console.log("button circle add click");
        updateWishlist(productHandle, "Added to My Capsule", true);
        // button.classList.toggle(BUTTON_ACTIVE_CLASS);
      });
    }
    button.addEventListener("mouseenter", (e) => {
      helper.style.opacity = 1;
    });
    button.addEventListener("mouseleave", (e) => {
      helper.style.opacity = 0;
    });
    // } else {
    //   console.log("Something went wrong.... on circle buttons");
    //   button.addEventListener("click", () => {
    //     console.log("button circle add click");
    //     updateWishlist(productHandle, null, false);
    //     button.children[0].className = "button-circle-filled"
    //     // button.classList.toggle(BUTTON_ACTIVE_CLASS);
    //   });
    // }
  });
};

const initGrid = () => {
  const grid = document.querySelector(selectors.grid) || false;
  if (grid) setupGrid(grid);
};

const initButtons = () => {
  const buttons = document.querySelectorAll(selectors.button) || [];
  if (buttons.length) setupButtons(buttons);
  else return;
  const event = new CustomEvent("shopify-wishlist:init-buttons", {
    detail: { wishlist: getWishlist() },
  });
  document.dispatchEvent(event);
};

const updateBubble = () => {
  let bubble = document.querySelector(".bubble-wp");
  let wishlist = getWishlist();
  var count = 0;
  wishlist.forEach(wish =>{
    if(wish !== "empty") {
      count += 1;
    }
  })
  bubble.innerHTML = count;
}

const initCircleButtons = () => {
  const buttons = document.querySelectorAll(selectors.button_circle) || [];
  if (buttons.length) setupCircleButtons(buttons);
  else return;
  const event = new CustomEvent("shopify-wishlist:init-buttons-circle", {
    detail: { wishlist: getWishlist() },
  });
  document.dispatchEvent(event);
};

const getWishlist = () => {
  const wishlist = localStorage.getItem(LOCAL_STORAGE_WISHLIST_KEY) || false;
  if (wishlist) return wishlist.split(LOCAL_STORAGE_DELIMITER);
  return [];
};

const setWishlist = (array) => {
  console.log("set wishlist called");
  const wishlist = array.join(LOCAL_STORAGE_DELIMITER);
  if (array.length) {
    localStorage.setItem(LOCAL_STORAGE_WISHLIST_KEY, wishlist);
  } else {
    localStorage.removeItem(LOCAL_STORAGE_WISHLIST_KEY);
  }

  const event = new CustomEvent("shopify-wishlist:updated", {
    detail: { wishlist: array },
  });
  document.dispatchEvent(event);

  return wishlist;
};

const updateWishlist = (handle, text, isButton) => {
  // if(window.location.href.includes("/pages/my-capsule"))
  var wishlist = getWishlist();
  let before = wishlist.filter((w) => w !== "empty").length;
  const indexInWishlist = wishlist.indexOf(handle);
  if (indexInWishlist === -1) {
    console.log("wishlist added????");
    // if (wishlist.length === 0) {
      // wishlist.push(handle);
    // } else {
      console.log("w length", wishlist.length);
      if (before < 12) {
        console.log("not entered here?");
        for (var i = 0; i < wishlist.length; i++) {
          if (wishlist[i] === "empty" && handle !== null && handle !== "") {
            wishlist[i] = handle;
            break;
          }
        }
      } else {
        console.log("entered here");
        if ( handle !== null && handle !== "") wishlist.push(handle);
      }
    // }
    let after = wishlist.filter((w) => w !== "empty").length;
    console.log("bla", before);
    if (before === 0 && after === 1) {
      showPopUP(
        "Yay! You just added your first product!",
        "Go to My Capsule to customize your own set."
      );
    }
    if (before === 3 && after === 4) {
      showPopUP("Congrats!", "You just earned a discount for your 4 products.");
    }
    if (before === 7 && after === 8) {
      showPopUP("Congrats!", "You just earned a discount for your 8 products.");
    }
    if (before === 11 && after === 12) {
      showPopUP(
        "Congrats!",
        "You just earned a discount for your 12 products."
      );
    }
    if (isButton === true) {
      showAlert("Product successfully added to My Capsule", true);
      text.innerHTML = "Added to My capsule";
    }
  } else {
    if (isButton === true) {
      showAlert("Product successfully removed from My Capsule", false);
      text.innerHTML = "Add to My Capsule";
    }
    if (wishlist.length <= 12) {
      for (i = 0; i < 12; i++) {
        if (wishlist[i] === handle) {
          wishlist[i] = "empty";
          break;
        }
      }
    } else {
      wishlist.splice(indexInWishlist, 1);
    }
  }
  return setWishlist(wishlist);
};

const wishlistContains = (handle) => {
  const wishlist = getWishlist();
  return wishlist.includes(handle);
};

const resetWishlist = () => {
  var wishlist = [];
  for (var i = 0; i < 12; i++) {
    wishlist.push("empty");
  }
  return setWishlist(wishlist);
};

const addToBagEvents = () => {
  let button = document.querySelector("#capsule-to-bag");
  let text = document.querySelector("#btn-c-text");
  if (button !== undefined || button !== null) {
    try {
      button.addEventListener("click", async (e) => {
        text.innerHTML = "Adding ...";
        let wishlist = getWishlist();
        var products = wishlist.filter((w) => w !== "empty");
        if (products.length === 0) {
          showAlert("Capsule is empty", false);
          text.innerHTML = "Add My Capsule to the Bag";
          return;
        }
        var items = [];
        var allAvailable = true;
        for (const product of products) {
          var prod_handle = "";
          var isVariant = false;
          var variant = "";
          if (product.includes("?variant=")) {
            let values = product.split("?variant=");
            isVariant = true;
            prod_handle = values[0];
            variant = values[1];
          } else {
            prod_handle = product;
          }
          let res = await fetch(`/products/${prod_handle}.js`);
          let p = await res.json();
          if (isVariant) {
            items.push({ id: variant, quantity: 1 });
            console.log("items1", items);
            p.variants.forEach((varData) => {
              if (varData === variant) {
                if (varData.available === false) {
                  allAvailable = false;
                }
              }
            });
          } else {
            console.log("items2", items);
            items.push({ id: p.variants[0].id, quantity: 1 });
            if (p.variants[0].available === false) {
              allAvailable = false;
            }
          }
        }
        const data = await JSON.stringify({ items: items });
        if (allAvailable == true) {
          console.log("data", data);
          fetch("/cart/add.js", {
            body: data,
            credentials: "same-origin",
            headers: {
              "Content-Type": "application/json",
              "X-Requested-With":
                "xmlhttprequest" /* XMLHttpRequest is ok too, it's case insensitive */,
            },
            method: "POST",
          })
            .then(function (response) {
              updateFromLink();
              text.innerHTML = "Add My Capsule to the Bag";
              return response.json();
            })
            .then(function (json) {
              /* we have JSON */
              text.innerHTML = "Add My Capsule to the Bag";
              console.log(json);
            })
            .catch(function (err) {
              /* uh oh, we have error. */
              text.innerHTML = "Add My Capsule to the Bag";
              console.error(err);
            });
        } else {
          text.innerHTML = "Add My Capsule to the Bag";
          showAlert(
            "Capsule contains unavailable products. Please remove unavailable products",
            false
          );
        }
      });
    } catch (e) {
      console.log("button event not loaded on page...");
    }
  }
};

const addToBagSingleEvent = async (handle, index) => {
  let text = document.querySelector("#quick-add-capsule-" + index);
  text.innerHTML = "Adding...";
  if (handle.length === 0) {
    showAlert("Somwthing went wrong, please try again.", false);
    text.innerHTML = "Add to My Bag";
    return;
  }
  var items = [];
  var allAvailable = true;
  var prod_handle = "";
  var isVariant = false;
  var variant = "";
  if (handle.includes("?variant=")) {
    let values = handle.split("?variant=");
    isVariant = true;
    prod_handle = values[0];
    variant = values[1];
  } else {
    prod_handle = handle;
  }
  let res = await fetch(`/products/${prod_handle}.js`);
  let p = await res.json();
  if (isVariant) {
    items.push({ id: variant, quantity: 1 });
    console.log("items1", items);
    p.variants.forEach((varData) => {
      if (varData === variant) {
        if (varData.available === false) {
          allAvailable = false;
        }
      }
    });
  } else {
    console.log("items2", items);
    items.push({ id: p.variants[0].id, quantity: 1 });
    if (p.variants[0].available === false) {
      allAvailable = false;
    }
  }
  const data = await JSON.stringify({ items: items });
  if (allAvailable == true) {
    console.log("data", data);
    fetch("/cart/add.js", {
      body: data,
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With":
          "xmlhttprequest" /* XMLHttpRequest is ok too, it's case insensitive */,
      },
      method: "POST",
    })
      .then(function (response) {
        updateFromLink();
        text.innerHTML = "Add to My Bag";
        return response.json();
      })
      .then(function (json) {
        /* we have JSON */
        text.innerHTML = "Add to My Bag";
        console.log(json);
      })
      .catch(function (err) {
        /* uh oh, we have error. */
        text.innerHTML = "Add to My Bag";
        console.error(err);
      });
  } else {
    text.innerHTML = "Add to My Bag";
    showAlert("Product is not available.", false);
  }
};

updateFromLink = (link) => {
  showAlert(
    "My Capsule products were successfully added to My Bag. Go to My bag to review your products. ",
    true
  );
  document.documentElement.dispatchEvent(
    new CustomEvent("cart:refresh", {
      bubbles: true,
      detail: {
        openMiniCart: window.themeVariables.settings.cartType === "drawer",
      },
    })
  );
  // document.documentElement.dispatchEvent(new CustomEvent("cart:refresh", {}));
};

const showAlert = (text, success) => {
  let alert = document.createElement("div");
  alert.classList = "capsule-add-alert";
  alert.style.background = success ? "#008F51" : "#CD4950";
  let alertText = document.createElement("p");
  alertText.innerHTML = text;
  alert.appendChild(alertText);
  document.body.append(alert);
  setTimeout(async function () {
    alert.classList = "capsule-add-alert capsule-add-alert-out";
    setTimeout(async function () {
      document.body.removeChild(alert);
    }, 1200);
  }, 3000);
};

const showPopUP = (titleText, subtitleText) => {
  let alert = document.createElement("div");
  alert.classList = "capsule-popup-wrapper view-fade-in";
  var alertInner = document.createElement("div");
  alertInner.classList = "capsule-popup-container view-fade-in";
  let title = document.createElement("p");
  title.className = "c-inner-title";
  title.innerHTML = titleText;
  let subtitle = document.createElement("p");
  subtitle.className = "c-inner-subtitle";
  subtitle.innerHTML = subtitleText;
  alertInner.append(title);
  alertInner.append(subtitle);

  let buttonDiv = document.createElement("div");
  buttonDiv.className = "capsule-popup-button-wrapper";

  let redirectCapsule = document.createElement("a");
  redirectCapsule.className =
    "redirect-capsule-popup button button--primary button--full";
  console.log("widndow location", window.location);
  redirectCapsule.href = window.location.origin + "/pages/my-capsule";
  // redirectCapsule.target = "_blank"
  redirectCapsule.rel = "noopener noreferrer";
  redirectCapsule.innerHTML = "Go to My Capsule";
  let cancel = document.createElement("button");
  cancel.innerHTML = "Later";
  cancel.className =
    "cancel-capsule-popup button button--secondary button--full";
  buttonDiv.append(redirectCapsule);
  buttonDiv.append(cancel);

  alertInner.append(buttonDiv);

  alert.append(alertInner);
  document.body.append(alert);
  alert.onclick = (e) => {
    if (e.target == alert) {
      alert.classList = "capsule-popup-wrapper view-fade-out";
      alertInner.classList = "capsule-popup-container view-fade-out";
      setTimeout(async function () {
        document.body.removeChild(alert);
      }, 1000);
    }
  };
  cancel.onclick = (e) => {
    alertInner.classList = "capsule-popup-container view-fade-out";
    alert.classList = "capsule-popup-wrapper view-fade-out";
    setTimeout(async function () {
      document.body.removeChild(alert);
    }, 1000);
  };
  document.body.append(alert);
};

const onDragEvent = () => {
  let wrapper = document.querySelector(".capsule-wrapper");
  if (wrapper !== undefined || wrapper !== nil) {
    try {
      console.log("wrapper", wrapper);
      wrapper.addEventListener("dragover", (e) => {
        e.preventDefault();
        console.log("drag over", e.target);
        let parent = e.target.parentElement;
        if (
          parent.getAttribute("allow-drag") === "true" ||
          parent.getAttribute("allow-drag") === true
        ) {
          parent.classList.add("drag-scale");
        }
      });
      wrapper.addEventListener("dragleave", (e) => {
        e.preventDefault();
        console.log("drag leave", e.target);
        let parent = e.target.parentElement;
        if (
          parent.getAttribute("allow-drag") === "true" ||
          parent.getAttribute("allow-drag") === true
        ) {
          parent.classList.remove("drag-scale");
        }
      });
      // capsuleChild.addEventListener('dragleave', (e) => {
      //   console.log("drag end", e.target)
      // });
      wrapper.addEventListener("drop", (e) => {
        e.preventDefault();
        // console.log("attr", e.target.getAttribute("allow-drag"));
        console.log("Parent", wrapper);
        let parent = e.target.parentElement;
        var data = e.dataTransfer.getData("bla");
        var val = document.getElementById(data);
        console.log("val", val);
        if (
          parent.getAttribute("allow-drag") === "true" ||
          parent.getAttribute("allow-drag") === true
        ) {
          var data = e.dataTransfer.getData("bla");
          var val = document.getElementById(data);
          let aux = parent;
          console.log("Val", val);
          console.log("target", e.target.parentElement);
          // let el = document.getElementById("thingBeingMoved");
          // let moveTo = document.getElementById("otherThing");
          // wrapper.insertBefore(e.target.parentElement, val.parentElement);
          // wrapper.replaceChild(e.target.parentElement, val.parentElement);
          parent.classList.remove("drag-scale");
          val.classList.remove("drag-scale");

          let indexOne = parent.id.split("drag_id_");
          // console.log("parent indexOne", indexOne[1]);

          let indexTwo = val.id.split("drag_id_");
          // console.log("val indexOne", indexTwo[1]);
          swapElements(parent, val);
          var wishlist = getWishlist();
          var i1 = parseInt(indexOne[1]);
          var i2 = parseInt(indexTwo[1]);
          console.log("index", i1, i2);
          console.log("wishlist ", wishlist);
          var temp = wishlist[i1];
          wishlist[i1] = wishlist[i2];
          wishlist[i2] = temp;

          console.log("wishlist new", wishlist);

          const wishlist1 = wishlist.join(LOCAL_STORAGE_DELIMITER);
          if (wishlist.length) {
            localStorage.setItem(LOCAL_STORAGE_WISHLIST_KEY, wishlist1);
          } else {
            localStorage.removeItem(LOCAL_STORAGE_WISHLIST_KEY);
          }

          // let aux1 = wishlist[i1];
          // wishlist[i1] = wishlist[i2];
          // wishlist[i2] = aux;
          // resetWishlist();
          // updateWishlist(wishlist, null, false);

          // TODO: Fix switch array and update
          // const indexInWishlist = wishlist.indexOf(handle);

          // parent.className = val.className;
          // parent.innerHTML =  val.innerHTML;
          // val.className = aux.className;
          // val.innerHTML = aux.innerHTML;
          // val.innerHTML = parent;
          // parent.innerHTML = aux;

          // var val = document.getElementById(data);
          // console.log("data", data);
          // let aux = val;
          // val.parentElement.innerHTML = null;
          // val.append(e.target.parentElement.children[0]);
          // e.target.parentElement.innerHTML = null;
          // e.target.parentElement.appendChild(aux);
        } else {
          console.log("something went wrong", e.target.parentElement);
        }
        // var data = e.dataTransfer.getData(bla);
        // e.target.appendChild(document.getElementById(data));
      });
    } catch (err) {
      console.log("Wrapped drag not initialized");
    }
  }
};

function swapElements(el1, el2) {
  var p2 = el2.parentNode,
    n2 = el2.nextSibling;
  if (n2 === el1) return p2.insertBefore(el1, el2);
  el1.parentNode.insertBefore(el2, el1);
  p2.insertBefore(el1, n2);
}
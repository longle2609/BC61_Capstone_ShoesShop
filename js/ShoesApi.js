const searchParams = window.location.search.replace("?", "");
const path = window.location.pathname.replace("/page/", "");
console.log(path);

const getDetailShoe = (id) => {
  const res = axios({
    method: "GET",
    url: `${BASE_URL}/api/Product/getbyid?id=${id}`,
  });

  res
    .then((result) => {
      const data = result.data.content;
      const shoeObj = new Shoe(data);

      let htmlSizeString = shoeObj.size
        .map((sz) => {
          return `<button class="btn btn-success">${sz}</button>`;
        })
        .join("");
      console.log(htmlSizeString);

      let htmlString = `<div class="item__product">
      <div class="item__product-wrap">
        <img src="${shoeObj.image}" alt="" />
      </div>
      <div class="item__product-wrap">
        <div class="item__product-text">
          <h2>${shoeObj.name}</h2>
          <p>
            ${shoeObj.description}
          </p>
        </div>
        <h4>Availble Size</h4>
        <div class="button mb-4 d-flex gap-2">
           ${htmlSizeString}
        </div>
        <p class="text-danger my-4 fs-1">${shoeObj.price}$</p>
        <div class="item__product-number mb-3">
          <button class="btn bg-body-secondary py-2 px-3 me-2">-</button>
          <span>1</span>
          <button class="btn bg-body-secondary py-2 px-3 ms-2">+</button>
        </div>
        <div class="item__product-cart">
          <button class="btn btn-danger fw-bold py-3">Add To Cart</button>
        </div>
      </div>
    </div>`;
      const detailProductDom = document.querySelector(".item .container");
      if (detailProductDom) {
        detailProductDom.innerHTML = htmlString;
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

if (searchParams) {
  getDetailShoe(searchParams);
}

const getAllShoes = () => {
  //1. lay du lieu tu api luu vao bien: mang (luu list data), object (lay detail)
  const res = axios({
    method: "GET",
    url: `${BASE_URL}/api/Product`,
  });

  res
    .then((result) => {
      const listData = result.data.content;
      let htmlString = ``;
      let carouselHtmlString = ``;
      let count = 0;
      listData.forEach((shoe) => {
        const shoeObj = new Shoe(shoe);
        // console.log(shoeObj);
        htmlString = htmlString.concat(
          `<div class="product__item">
             <img src="${shoeObj.image}" alt="" />
             <h3>${shoeObj.name}</h3>
             <p>${shoeObj.shortDescription}</p>
             <div class="group__action">
               <div class="action__buyNow">
               <a href="./detail.html?${shoeObj.id}">Buy Now</a> 
               </div>
               <div class="action__price">
                 <p>${shoeObj.price}$</p>
               </div>
             </div>
             </div>`
        );
        if (count < 3) {
          carouselHtmlString =
            carouselHtmlString.concat(`<div class="carousel-item ${
              count === 0 ? "active" : ""
            }">
          <div class="carousel-item__wrap">
            <div class="carousel-item__img">
              <img src="${shoeObj.image}" />
            </div>
            <div class="carousel-item__text p-5">
              <h1 class="mt-5">${shoeObj.name}</h1>
              <p class="mb-5">
                ${shoeObj.description}
              </p>
              <button class="btn btn-danger">
                <a href="./page/detail.html?${shoeObj.id}">Buy Now</a>
              </button>
            </div>
          </div>
        </div>`);

          count++;
        }
      });

      //2. lay duoc bien dom tren cay html noi ma m muon du lieu do hien thi len
      let listProductDom = document.querySelector(
        ".product__content.page__detail"
      );
      let carouselProductDom = document.querySelector(
        ".carousel-inner .container"
      );
      // let listProductInDeTailDom = document.querySelector(".product__content");
      // console.log(listProductInDeTailDom);
      if (listProductDom) {
        listProductDom.innerHTML = htmlString;
      }
      if (carouselProductDom) {
        carouselProductDom.innerHTML = carouselHtmlString;
      }
      // if (listProductInDeTailDom) {
      //   listProductInDeTailDom.innerHTML = htmlString;
      // }
    })
    .catch((error) => {
      console.log(error);
    });
};

getAllShoes();

const pageSize = 6;

const getProductWithPage = (pageIndex = 1) => {
  console.log("object");
  const res = axios({
    method: "GET",
    url: `${BASE_URL}/api/Product/getpaging`,
    params: {
      pageSize,
      pageIndex,
    },
  });
  res
    .then((result) => {
      const listData = result.data.content;
      const totalPage = Math.ceil(Number(listData.totalRow) / Number(pageSize));
      const navElement = document.createElement("nav");
      navElement.setAttribute("aria-label", "Page navigation example");
      const ulElement = document.createElement("ul");
      ulElement.className = "pagination justify-content-center";
      navElement.appendChild(ulElement);
      for (let i = 1; i <= totalPage; i++) {
        const liElement = document.createElement("li");
        liElement.className = "page-item";
        const element = document.createElement("div");
        element.className = "page-link";
        element.innerHTML = i;
        element.addEventListener("click", () => {
          getProductWithPage(i);
        });
        liElement.appendChild(element);
        ulElement.appendChild(liElement);
      }
      console.log(navElement);
      let listHtmlString = "";
      listData.items.forEach((shoe) => {
        const shoeObj = new Shoe(shoe);
        // console.log(shoeObj);
        listHtmlString = listHtmlString.concat(
          `<div class="product__item">
            <div class="item__img">
              <img src="https://shop.cyberlearn.vn/images/${shoeObj.image}" alt="" />
            </div>
            <div class="item__name">
              <h3>${shoeObj.name}</h3>
            </div>
            <div class="item__shortDescription">
              <p>${shoeObj.shortDescription}</p>
            </div>
             <div class="group__action">
               <div class="action__buyNow">
               <a href="./page/detail.html?${shoeObj.id}">Buy Now</a>
                 
               </div>
               <div class="action__price">
                 <p>${shoeObj.price}$</p>
               </div>
             </div>
          </div>`
        );
      });
      let listProductDom = document.querySelector(
        ".product__content.page__home"
      );

      if (listProductDom) {
        listProductDom.innerHTML = listHtmlString;
      }

      const paginationDom = document.querySelector(".product__pagination");
      if (paginationDom) {
        // paginationDom.innerHTML = htmlString;
        if (!paginationDom.hasChildNodes()) {
          paginationDom.appendChild(navElement);
        }
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

getProductWithPage();

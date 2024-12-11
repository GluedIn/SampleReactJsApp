// import OwlCarousel from "react-owl-carousel";
import Product from "./Product";
import React from "react";

const Products = (contentInfo: any) => {
  const { shoppable, products = [] } = contentInfo;
  if (shoppable) {
    return (
      <div className="horizontal_scroller">
        {/* <OwlCarousel
          dots={false}
          items={4}
          autoplay={true}
          responsive={{
            0: {
              items: 2.5,
              nav: false,
            },
            600: {
              items: 2.5,
              nav: false,
            },
            1000: {
              items: 4,
              loop: false,
            },
          }}
          className="list list-inline profile-box-slider owl-carousel owl-theme top-profile-list"
        >
          {products.map((product: any) => (
            <Product product={product} key={product.id} />
          ))}
        </OwlCarousel> */}
      </div>
    );
  }
  return null;
};

export default Products;

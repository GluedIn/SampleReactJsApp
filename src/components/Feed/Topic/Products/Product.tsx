import React from "react";

type Proudct = {
  productName: string;
  mrp: number;
  imageUrl: string;
  shoppableLink: string;
  shoppableLinks: string;
  callToAction: string;
};

const Product = ({ product }: { product: Proudct }) => {
  const {
    productName,
    mrp,
    imageUrl,
    shoppableLink,
    shoppableLinks,
    callToAction,
  } = product;
  return (
    <div className="card-info d-flex">
      <div className="left_img">
        <a href={shoppableLink}>
          <img src={imageUrl}></img>
        </a>
      </div>
      <div className="right_info">
        <h6>
          <a href={shoppableLinks}>{productName}</a>
        </h6>
        <h5>${mrp}</h5>
        <a className="add_cart" href={shoppableLink}>
          {callToAction || "More Info"}
        </a>
      </div>
    </div>
  );
};

export default Product;

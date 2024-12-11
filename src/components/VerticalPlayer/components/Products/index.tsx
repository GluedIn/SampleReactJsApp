import React from "react";
import { Link } from "react-router-dom";

export default function VerticalPlayerProducts({ show, products = [] }: any) {
  return (
    <div
      className="product_container"
      style={{
        height: show ? "65px" : 0,
      }}
    >
      {products.map((product: any) => (
        <div className="product_wrapper" key={product._id}>
          <div className="product_info">
            <div className="left">
              <img
                src={product.imageUrl}
                alt={`${product.productId}-logo`}
              ></img>
            </div>
            <div className="right">
              <h6>{product.productName}</h6>
              <Link
                to={product.shoppableLink}
                target="_blank"
                className="product-link"
              >
                Buy
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

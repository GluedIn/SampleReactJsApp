import React from "react";

function Processing() {
  return (
    <svg width="64px" height="64px" viewBox="0 0 128 128">
      <g>
        <path d="M59.6 0h8v40h-8V0z" fill="#000" />
        <path d="M59.6 0h8v40h-8V0z" fill="#ccc" transform="rotate(30 64 64)" />
        <path d="M59.6 0h8v40h-8V0z" fill="#ccc" transform="rotate(60 64 64)" />
        <path d="M59.6 0h8v40h-8V0z" fill="#ccc" transform="rotate(90 64 64)" />
        <path
          d="M59.6 0h8v40h-8V0z"
          fill="#ccc"
          transform="rotate(120 64 64)"
        />
        <path
          d="M59.6 0h8v40h-8V0z"
          fill="#b2b2b2"
          transform="rotate(150 64 64)"
        />
        <path
          d="M59.6 0h8v40h-8V0z"
          fill="#999"
          transform="rotate(180 64 64)"
        />
        <path
          d="M59.6 0h8v40h-8V0z"
          fill="#7f7f7f"
          transform="rotate(210 64 64)"
        />
        <path
          d="M59.6 0h8v40h-8V0z"
          fill="#666"
          transform="rotate(240 64 64)"
        />
        <path
          d="M59.6 0h8v40h-8V0z"
          fill="#4c4c4c"
          transform="rotate(270 64 64)"
        />
        <path
          d="M59.6 0h8v40h-8V0z"
          fill="#333"
          transform="rotate(300 64 64)"
        />
        <path
          d="M59.6 0h8v40h-8V0z"
          fill="#191919"
          transform="rotate(330 64 64)"
        />
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="0 64 64;30 64 64;60 64 64;90 64 64;120 64 64;150 64 64;180 64 64;210 64 64;240 64 64;270 64 64;300 64 64;330 64 64"
          calcMode="discrete"
          dur="1080ms"
          repeatCount="indefinite"
        ></animateTransform>
      </g>
    </svg>
  );
}

export default Processing;

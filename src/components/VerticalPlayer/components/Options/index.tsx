import LikeIcon from "../../Icons/Like";
import ReportIcon from "../../Icons/Report";
import "./Options.css";
import React from "react";

const Option = ({
  option,
}: {
  option: { label: string; icon: JSX.Element };
}) => {
  const { label, icon } = option ?? {};
  return (
    <div className="option">
      <div className="option__icon">{icon}</div>
      <div className="option__label">{label}</div>
    </div>
  );
};

export default function VerticalPlayerOptions({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const options = [
    {
      label: "Like",
      icon: <LikeIcon />,
    },
    {
      label: "Report",
      icon: <ReportIcon />,
    },
  ];
  if (!open) return null;
  return (
    <div className="options__wrapper">
      {/* <Dropdown>
        <Dropdown.Toggle></Dropdown.Toggle>
        {options.map((option) => (
          <Option option={option} />
        ))}
      </Dropdown> */}
    </div>
  );
}

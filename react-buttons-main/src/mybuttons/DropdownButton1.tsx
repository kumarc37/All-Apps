import React, { useState } from "react";
import "./mycss.css";
const DropdownButton1 = () => {
  const [isOpen, setIsOpen] = useState<Boolean>(false);
  const menuItems = [
    {
      name: "Profile",
      icon: "account_circle",
    },
    {
      name: "Settings",
      icon: "settings",
    },
    {
      name: "Logout",
      icon: "logout",
    },
  ];
  const MenuItem = ({ name, icon }: { name: string; icon: string }) => {
    return (
      <button className="menu-button">
        <span className="material-symbols-outlined">{icon}</span>
        <span className="menu-button-text">{name}</span>
      </button>
    );
  };
  const clickHandler = () => {
    if (isOpen) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  };
  return (
    <>
      <div className="dropdown">
        <div className={isOpen ? "menu" : "menu close"}>
          {menuItems.map((item) => (
            <MenuItem key={item.name} name={item.name} icon={item.icon} />
          ))}
        </div>
        <button onClick={clickHandler}>
          <span>Actions</span>
          {isOpen ? (
            <span className="material-symbols-outlined">close</span>
          ) : (
            <span className="material-symbols-outlined">expand_more</span>
          )}
        </button>
      </div>
    </>
  );
};

export default DropdownButton1;

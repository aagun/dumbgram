import React from "react";

export default function ProfilePicture(props) {
  const {
    isSmall,
    isMedium,
    isLarge,
    className: inlineStyle,
    dataImage: { src, alt },
    style,
  } = props;
  const className = [inlineStyle];

  if (isSmall) className.push("profile-image-sm");
  if (isMedium) className.push("profile-image-md");
  if (isLarge) className.push("profile-image");

  return (
    <div className="profile-background" style={style}>
      <img className={className.join(" ")} src={src} alt={alt} />
    </div>
  );
}

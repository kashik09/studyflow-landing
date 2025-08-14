export default function Button({ as: Tag = "button", className = "", children, ...props }) {
  return (
    <Tag
      className={`btn bg-pink-500 text-white shadow hover:shadow-md ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
}

export default function Tooltip({ children, text }) {
    return (
      <div className="relative group">
        {children}
        <span className="absolute top-1/2 left-full transform -translate-y-1/2 ml-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 z-[50]">
          {text}
        </span>
      </div>
    );
  }
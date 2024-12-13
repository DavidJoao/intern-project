export default function Tooltip({ children, text }) {
    return (
      <div className="relative group">
        {children}
        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2">
          {text}
        </span>
      </div>
    );
  }
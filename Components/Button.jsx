export function Button({ children, className = '', ...props }) {
    return (
      <button
        {...props}
        className={`bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition ${className}`}
      >
        {children}
      </button>
    )
  }
  
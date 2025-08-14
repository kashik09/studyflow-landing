import { useState, useRef, useEffect } from "react";

export default function CuteSelect({ options, value, onChange, placeholder = "Select..." }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function clickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", clickOutside);
    return () => document.removeEventListener("mousedown", clickOutside);
  }, []);

  const selected = options.find(o => o.value === value);

  return (
    <div ref={ref} className="relative w-48 text-sm">
      {/* Button */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={`flex w-full items-center justify-between rounded-xl border-2 ${
          open ? "border-pink-400" : "border-pink-200"
        } bg-pink-50 px-3 py-2 font-medium text-pink-800 shadow-sm hover:border-pink-300 focus:outline-none`}
      >
        {selected ? selected.label : <span className="text-pink-400">{placeholder}</span>}
        <span className="ml-2 text-pink-500">{open ? "▲" : "▼"}</span>
      </button>

      {/* Dropdown list */}
      {open && (
        <ul
          className="absolute z-50 mt-1 max-h-48 w-full overflow-auto rounded-xl border border-pink-200 bg-white shadow-lg"
        >
          {options.map(o => (
            <li
              key={o.value}
              onClick={() => {
                onChange(o.value);
                setOpen(false);
              }}
              className={`cursor-pointer px-3 py-2 hover:bg-pink-100 ${
                o.value === value ? "bg-pink-50 font-semibold text-pink-700" : "text-pink-800"
              }`}
            >
              {o.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

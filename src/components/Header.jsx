"use client";

import { Headerlinks } from "./data";

//añadir mas 

const Header = ({ elegirpag, Setelegirpag }) => {
  return (
    <nav className="fixed top-0 left-0 w-full bg-[#1DB954] text-black px-[20px] py-[10px] flex justify-between items-center z-[1000]">
      
      <div className="flex items-center">
        <img src="/logo.png" className="h-[40px] w-auto cursor-pointer" />
      </div>

      <ul className="list-none flex gap-[300px] m-0 p-0">
        {Headerlinks.map((item) => (
          <li key={item.id}>
            <button
              onClick={() => Setelegirpag(item.value)}
              className="text-black hover:underline cursor-pointer bg-transparent border-none text-[18px] font-semibold"
            >
              {item.title}
            </button>
          </li>
        ))}
      </ul>

      <div></div>
    </nav>
  );
};

export default Header;

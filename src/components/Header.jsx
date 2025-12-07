"use client";

import { Headerlinks } from "./data";
import styles from './Header.module.css';

//añadir mas cosas

const Header = () => {
  return (
    <nav className={styles.header}>
      <div className={styles.logo}>
        <p>SPOTYFY</p>
      </div>

      <ul className={styles.menu}>
        {Headerlinks.map((item) => (
          <li key={item.id}>
            <a href={item.link}>{item.title}</a>
          </li>
        ))}
       
      </ul>

      <div className={styles.extra}></div>
    </nav>
  );
};

export default Header;

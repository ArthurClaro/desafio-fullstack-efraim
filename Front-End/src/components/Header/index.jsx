import Logo from "../../assets/Logo.svg"
import styles from "./style.module.scss"

function Header() {
    return (
        <header className={`${styles.flexbox} container`}>
            <img src={Logo}  />
        </header>
    )
}
export default Header
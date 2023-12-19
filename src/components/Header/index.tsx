import * as DateFNS from "date-fns";
import * as region from 'date-fns/locale';
import styles from './styles.module.scss';

export function Header(){
    const currentDate = DateFNS.format(new Date(), "EEEEEE, d MMMM", {
        locale: region.ptBR,
    });
    return (
        <header className={styles.headerContainer}>
            <img src="/logo.svg" alt="Podcastr"/>
            <p>O melhor para você ouvir, sempre</p>
            <span>{currentDate}</span>
        </header>
    )
}
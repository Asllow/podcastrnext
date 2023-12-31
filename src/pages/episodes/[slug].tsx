import { api } from "../../services/api";
import { GetStaticPaths, GetStaticProps } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import * as DateFNS from "date-fns";
import * as region from 'date-fns/locale';
import { convertDurationToTimeString } from "../../utils/convertDurationToTimeString";
import styles from './episode.module.scss';

const format = DateFNS.format;
const parseISO = DateFNS.parseISO;
const ptBR = region.ptBR;

interface Params extends ParsedUrlQuery {
    slug: string;
}

type Episode = {
    id: string;
    title: string;
    thumbnail: string;
    members: string;
    duration: number;
    durationAsString: string;
    url: string;
    publishedAt: string;
    description: string;
}

type EpisodeProps = {
    episode: Episode;
}

export default function Episode({ episode } : EpisodeProps){
    const router = useRouter();
    return (
        <div className={styles.all}>
            <div className={styles.episode}>
                <div className={styles.thumbnailContainer}>
                    <Link href={'/'}>
                        <button type="button">
                            <img src="/arrow-left.svg" alt="Voltar" />
                        </button>
                    </Link>
                    <Image 
                        width={700} 
                        height={160} 
                        src={episode.thumbnail} 
                        alt={episode.title} 
                        style={{objectFit:"cover"}}
                    />
                    <button type="button">
                    <img src="/play.svg" alt="Tocar episódio" />
                    </button>
                </div>
                <header>
                    <h1>{episode.title}</h1>
                    <span>{episode.members}</span>
                    <span>{episode.publishedAt}</span>
                    <span>{episode.durationAsString}</span>
                </header>
                <div 
                    className={styles.description} 
                    dangerouslySetInnerHTML={{ __html: episode.description}} 
                />
            </div>
        </div>
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [],
        fallback: 'blocking'
    }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
    const { slug } = ctx.params as Params
    const { data }  = await api.get(`/episodes/${slug}`)
    
    const episode = {
        id: data.id,
        title: data.title,
        thumbnail: data.thumbnail,
        members: data.members,
        publishedAt: format(parseISO(data.published_at), 'd MMM yy', {
            locale: ptBR
        }),
        duration: Number(data.file.duration),
        durationAsString: convertDurationToTimeString(Number(data.file.duration)),
        description: data.description,
        url: data.file.url,
    }

    return {
        props: {
            episode
        },
        revalidate: 60 * 60 * 24, 
    }
}
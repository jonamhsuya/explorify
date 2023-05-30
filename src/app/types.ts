export type Track = {
    album: Album;
    artists: Array<Artist>
    available_markets: Array<string>
    disc_number: number;
    duration_ms: number;
    explicit: boolean;
    external_ids: {
        isrc: string;
        ean: string;
        upc: string;
    };
    external_urls: {
        spotify: string;
    };
    href: string;
    id: string;
    is_playable: boolean;
    linked_from: {};
    restrictions: {
        reason: string;
    }
    name: string;
    popularity: number;
    preview_url: string;
    track_number: number;
    type: string;
    uri: string;
    is_local: boolean;
}

type Album = {
    album_type: string;
    total_tracks: number;
    available_markets: Array<string>;
    external_urls: {
        spotify: string;
    }
    href: string;
    id: string;
    images: Array<Image>
    name: string;
    release_date: string;
    release_date_precision: string;
    restrictions: {
        reason: string;
    }
    type: string;
    uri: string;
    copyrights: Array<Copyright>;
    external_ids: {
        isrc: string;
        ean: string;
        upc: string;
    }
    genres: Array<string>;
    label: string;
    popularity: number;
    album_group: string;
    artists: Array<SimplifiedArtist>;
}

type Artist = {
    external_urls: {
        spotify: string;
    }
    followers: {
        href: string;
        total: number;
    }
    genres: Array<string>;
    href: string;
    id: string;
    images: Array<Image>
    name: string;
    popularity: number;
    type: string;
    uri: string;
}

type SimplifiedArtist = {
    external_urls: {
        spotify: string;
    }
    href: string;
    id: string;
    name: string;
    type: string;
    uri: string;
}

type Image = {
    url: string;
    height: number;
    width: number;
}

type Copyright = {
    text: string;
    type: string;
}
export interface category {
    _id?: number;
    name: string;
}

export interface chip {
    _id?: number;
    name: string;
    description: string;
}

export interface article {
    _id?: number;
    title: string;
    desc: string;
    infoText: string;
    chips: chip[],
    category: string,
    source: string;
    views: number;
    publishDate: Date,
    ready: Boolean,
    portfolioReady: Boolean,
    hasImage: Boolean,
    image: string
}

export interface api_return_schema<T> {
    data: T
    error: error
}

export interface error {
    has_error: Boolean,
    error_message: string,
}

export interface user {
    id: number;
    username: string;
    password: string;
}
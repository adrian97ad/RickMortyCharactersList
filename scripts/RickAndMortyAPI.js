class RickAndMortyAPI {
    constructor() {
        this.urls = {
            base: 'https://rickandmortyapi.com/api/',
            characters: 'https://rickandmortyapi.com/api/character/'
        }
    }

    async getCharacters(args) {
        let params = '';
        args.forEach(arg => {
            let split = arg.split('=')[1];
            if (split !== '' && split !== 'unknow' && split !== 'null' && split !== 'undefined') {
                params += `&${arg}`;
            }
        });

        window.history.pushState(null, null,
            window.location.href.split('?')[0].concat(`?${params.substring(1)}`));
        const data = await fetch(`${this.urls.characters}?${params.substring(1)}`);
        return data.json();
    }

    async getEpisode(episodeUrl) {
        const data = await fetch(episodeUrl);
        return data.json();
    }
}
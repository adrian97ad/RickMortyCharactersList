class CharactersManager {
    constructor() {
        this._charactersList = new Map();
        this.rickAndMortyAPI = new RickAndMortyAPI();
        this.characterTemplate = null;
        this.jq = $('.charactersList');
    }

    static getInstance() {
        if (!CharactersManager.instance) {
            this.instance = new CharactersManager();
        }
        return this.instance;
    }

    initTemplateAndList(name, status, species, type, gender) {
        this.characterTemplate = new CharacterTemplate(name, status, species, type, gender);
        this.newList();
    }

    newList() {
        this.clear();
        this.getCharacters().then(data => {
            let stop = Math.min(5, data.info.count);
            for (let i = 0; i < stop; i++) {
                let newCharacter = new Character(CharactersManager.getInstance().jq, data.results[i].name,
                    data.results[i].status, data.results[i].species, data.results[i].type, data.results[i].gender);
                newCharacter.completeInfo(data.results[i].image, data.results[i].url, data.results[i].location, data.results[i].origin);
                CharactersManager.getInstance().addCharacterToList(data.results[i].id, newCharacter);
                // $('.hoverHref').each(function(){
                //     $(this).on('click', function (e) {
                //         e.preventDefault();
                //     });
                // });
            }
        }).catch(error => {
            console.log(error);
        });
    }

    addCharacterToList(id, character) {
        if (this._charactersList.size >= 5)
            return;
        if (this._charactersList.get(id) === undefined) {
            character.addToList();
        }
        this._charactersList.set(id, character);
    }

    clear() {
        this._charactersList.clear();
        this.jq.children().remove();
    }

    async getCharacters() {
        return this.rickAndMortyAPI.getCharacters(this.characterTemplate.getAttributesInArray())
    }
}


class CharacterTemplate {
    static STATUS = Object.freeze({alive: 'alive', dead: 'dead', unknown: 'unknown'})
    static Gender = Object.freeze({female: 'female', male: 'male', genderless: 'genderless', unknown: 'unknown'});

    constructor(name, status, species, type, gender) {
        this.name = name;
        this.status = status;
        this.species = species;
        this.type = type;
        this.gender = gender;
    }

    getAttributesInArray() {
        return [`name=${this.name}`, `status=${this.status}`, `species=${this.species}`, `type=${this.type}`, `gender=${this.gender}`];
    }
}

class Character extends CharacterTemplate {
    constructor($root, name, status, species, type, gender) {
        super(name, status, species, type, gender);
        this.root = $root;
    }

    completeInfo(img, url, location, origin) {
        this.img = img;
        this.url = url;
        this.location = location;
        this.origin = origin;
        return this;
    }

    addToList() {
        this.root.append(`<div class="character"></div>`);
        this.jq = this.root.children().last();
        this.addImg().addInfo().fillInfo();
        return this;
    }

    addImg() {
        this.jq.append(`<div class="character-img">
                <img src="${this.img}" alt="${this.name}">
            </div>`);
        return this;
    }

    addInfo() {
        this.jq.append(`<div class="character-info"></div>`);
        return this;
    }

    fillInfo() {
        this.jq.children('.character-info').append(`${this._getTemplateNameStatusType()}`)
            .append(`${this._getTemplateLocation()}`)
            .append(`${this._getTemplateOrigin()}`);
    }

    _getTemplateNameStatusType() {
        return `<div class="character-name-status-type character-stats-group">
                    <div class="character-name hoverHref" onclick="window.open('${this.url}', '_blank');">${this.name}</div>
                    <div class="character-status-type">
                        <span class="character-status-icon ${this.status.toLowerCase()}"></span>
                        <div class="character-status-type-text">${this.status} - ${this.species}</div>
                    </div>
                </div>`;
    }

    _getTemplateLocation() {
        return `<div class="character-location character-stats-group">
                    <div class="character-stat-tittle">Last known location:</div>
                    <div class="character-location-content hoverHref" onclick="window.open('${this.location.url}', '_blank');">${this.location.name}</div>
                </div>`;
    }

    _getTemplateOrigin() {
        return `<div class="character-origin character-stats-group">
                    <div class="character-stat-tittle">First seen in:</div>
                    <div class="character-origin-content hoverHref" onclick="window.open('${this.origin.url}', '_blank');">${this.origin.name}</div>
                </div>`;
    }

}


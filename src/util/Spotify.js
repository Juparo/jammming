//Users access token granted
let   accessToken = null;
//Spotify settings
const clientId      = '048c43c5cf0a440e909854ac48cd75d7';
const redirectUri   = 'http://localhost:3000';
const spotifyScopes = 'playlist-modify-private user-read-private playlist-modify-private';
const spotifyUrl    = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${redirectUri}&scope=${encodeURI(spotifyScopes)}`;
const restSpotify   = 'https://api.spotify.com/v1';

const Spotify = {

    getAccessToken() {
        //If we have an access token just return
        if (accessToken !== null) {
            return accessToken;
        }
        //We need to workout the access token and expire tieme. First check if we have them in the url
        if (window.location.hash !== '') {

            //Parsing the token from the url
            const accessTokenUrl = window.location.hash.match(/access_token=([^&]*)/);
            const expiresInUrl   = window.location.hash.match(/expires_in=([^&]*)/);

            if (accessTokenUrl && expiresInUrl) {
                const expiresIn = expiresInUrl[1];
                accessToken     = accessTokenUrl[1];
                window.setTimeout(() => accessToken = '', expiresIn * 1000);
                window.history.pushState('Access Token', null, '/');
                return accessToken;
            }
        }

        //If we can not find the token redirect to the auth page
        window.location = spotifyUrl;
    },

    async search(searchTerm) {

        const tracks = [];
        const uri = `${restSpotify}/search?type=track&q=${encodeURI(searchTerm)}`;

        const headers = this.getHeaders();

        if (!headers) {
            return tracks;
        }

        try {
            const response = await fetch(uri,headers);

            if (response.ok) {
                const jsonResponse = await response.json();
                jsonResponse.tracks.items.forEach(track => {
                    tracks.push({
                        id     : track.id,
                        name   : track.name,
                        artist : track.artists[0].name,
                        album  : track.album.name,
                        uri    : track.uri
                    });
                });

                return tracks;
            }

            throw new Error('Request failed!');

        } catch(error) {
            return tracks;
        }
    },

    //Save playlist, return true if success
    async savePlaylist(playlistName,playlistUris) {

        if (!playlistName || !playlistUris.length) {
            return;
        }

        const headers = this.getHeaders();

        if (!headers) {
            return false;
        }

        //All methods will return a promise or an error which will be catch here
        this.getUserId(headers)
        .then (userId => {
            return this.createPlaylist(headers,userId,playlistName);
        })
        .then (playlistId => {
            this.postPlaylist(headers,playlistId,playlistUris)
        })
        .catch(error => {
            console.log(error);
            return false;
        });

        return true;

    },

    //Save playlist
    async postPlaylist(headers,playlistId,playlistTracks) {

        const uri      = `${restSpotify}/playlists/${playlistId}/tracks`;
        const postData   = {
            headers: headers.headers,
            method : 'POST',
            body   : JSON.stringify({uris : playlistTracks})
        };

        const response = await fetch(uri,postData);

        if (response.ok) {
            return true;
        }

        throw new Error('Failed to post tracks to playlist');

    },

    //get user id or throw an error
    async getUserId(headers) {
        const response = await fetch(`${restSpotify}/me`,headers);

        if (response.ok) {
            const jsonResponse = await response.json();
            return jsonResponse.id;
        }

        throw new Error('Failed to get user id');
    },

    //Utility to create a playlist
    async createPlaylist(headers,userId,playlistName) {

        const uri      = `${restSpotify}/users/${userId}/playlists`;
        const postData = {
            headers: headers.headers,
            method : 'POST',
            body   : JSON.stringify({
                name   : playlistName,
                public : false
            })
        }

        const response = await fetch(uri,postData);

        if (response.ok) {
            const jsonResponse = await response.json();
            return jsonResponse.id;
        }

        throw new Error('Failed to create playlist');

    },

    //Utility to retrieve the header. If we have no access token will
    //return null
    getHeaders() {

        if (!this.getAccessToken()) {
            return null;
        }

        //Return the access header
        return {
            headers : {
                Authorization: `Bearer ${accessToken}`,
               'Content-Type': 'application/json'
            }
        };
    },
};

export default Spotify;
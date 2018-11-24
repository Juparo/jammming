import React, { Component } from 'react';
import './App.css';
// Import components
import SearchBar     from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist      from '../PlayList/PlayList';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchResults : [
                {
                    name  : "The World According to Pablo",
                    artist: "Pablo",
                    album : "Pablo's World",
                    id    : 1,
                    uri   : 'blablalbal'
                },
                {
                    name  : "The World According to Elyna",
                    artist: "Elyna",
                    album : "Elyna's World",
                    id    : 2,
                    uri   : 'blablalbal'
                },
                {
                    name  : "The World According to Juan",
                    artist: "Juan",
                    album : "Juan's World",
                    id    : 3,
                    uri   : 'blablalbal'
                }
            ],
            playlistName  : "My playlist",
            playlistTracks: [
                {
                    name  : "The World According to Pablo",
                    artist: "Pablo",
                    album : "Pablo's World",
                    id    : 1,
                    uri   : 'blablalbal'
                }
            ]

        };

        this.addTrack           = this.addTrack.bind(this);
        this.removeTrack        = this.removeTrack.bind(this);
        this.updatePlaylistName = this.updatePlaylistName.bind(this);
        this.savePlaylist       = this.savePlaylist.bind(this);
        this.search             = this.search.bind(this);
    }

    addTrack(track) {
        if (this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
            return;
        }

        this.setState(prevState => {
            return {
                playlistTracks : [...prevState.playlistTracks,track]
            };
        });
    }

    removeTrack(track) {
        this.setState(prevState => {
            const newPlaylist = prevState.playlistTracks.filter(keepTrack => keepTrack.id !== track.id);
            return {
                playlistTracks : newPlaylist
            };
        });
    }

    updatePlaylistName(newPlaylistName) {
        this.setState({
            playlistName : newPlaylistName
        });
    }

    savePlaylist() {
        const trackURIs = this.state.playlistTracks.map(track => track.uri);
    }

    search(searchTerm) {
        console.log(searchTerm);
    }

    render() {
        return (
            <div>
              <h1>Ja<span className="highlight">mmm</span>ing</h1>
              <div className="App">
                <SearchBar
                    onSearch = {this.search}
                />
                <div className="App-playlist">
                    <SearchResults
                        searchResults = {this.state.searchResults}
                        onAdd         = {this.addTrack}
                    />
                    <Playlist
                        playlistName   = {this.state.playlistName}
                        playlistTracks = {this.state.playlistTracks}
                        onRemove       = {this.removeTrack}
                        onNameChange   = {this.updatePlaylistName}
                        onSave         = {this.savePlaylist}
                    />
                </div>
              </div>
            </div>
        );
    }
}

export default App;

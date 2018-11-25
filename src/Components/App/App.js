import React, { Component } from 'react';
import './App.css';
// Import components
import SearchBar     from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist      from '../PlayList/PlayList';
import Spotify       from '../../util/Spotify';

class App extends Component {
    constructor(props) {
        super(props);
        //If we kept the objects in the local storage, reload them
        const tracks_str   = localStorage.getItem('tracks');
        const playlistName = localStorage.getItem('playlistName');
        const tracks = tracks_str ? JSON.parse(tracks_str) : [];
        //set up initial states
        this.state = {
            searchResults : [],
            playlistName  : playlistName ? playlistName : 'New Playlist',
            playlistTracks: tracks
        };

        this.addTrack           = this.addTrack.bind(this);
        this.removeTrack        = this.removeTrack.bind(this);
        this.updatePlaylistName = this.updatePlaylistName.bind(this);
        this.savePlaylist       = this.savePlaylist.bind(this);
        this.search             = this.search.bind(this);
    }

    //Add a new track to the playlist if the track doesn't exist
    addTrack(track) {
        if (this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
            return;
        }

        this.setState(prevState => {
            return {
                playlistTracks : [...prevState.playlistTracks,track]
            };
        }, () => {
            localStorage.setItem('tracks',JSON.stringify(this.state.playlistTracks));
        });

        //Remove the track from the result
        this.removeTrackFromResults(track);
    }

    //Remove a track from the playlist, using filtering
    removeTrack(track) {
        this.setState(prevState => {
            const newPlaylist = prevState.playlistTracks.filter(keepTrack => keepTrack.id !== track.id);
            return {
                playlistTracks : newPlaylist
            };
        }, () => {
            localStorage.setItem('tracks',JSON.stringify(this.state.playlistTracks));
        });
    }

    removeTrackFromResults(track) {
        this.setState(prevState => {
            const newSearchResults = prevState.searchResults.filter(keepTrack => keepTrack.id !== track.id);
            return {
                searchResults : newSearchResults
            };
        });
    }

    updatePlaylistName(newPlaylistName) {
        this.setState({
            playlistName : newPlaylistName
        }, () =>{
            localStorage.setItem('playlistName',this.state.playlistName);
        });

    }

    savePlaylist() {
        const playlistUris = this.state.playlistTracks.map(track => track.uri);
        //Call spotify save list with the list of uris from the playlist
        Spotify.savePlaylist(this.state.playlistName,playlistUris)
        .then (ok => {
            if (ok) {
                this.setState({
                    playlistName   : 'New Playlist',
                    playlistTracks : []
                });
                localStorage.setItem('playlistName','');
                localStorage.setItem('tracks','');
            } else {
                //We were redirected so we didnt save it to spotify
                alert('Try again');
            }
        });
    }

    //Perform a difference with the playlist
    differencePlaylist(searchResults) {
        const idsPlaylist      = this.state.playlistTracks.map(track => track.id);
        const newSearchResults = searchResults.filter(track => !idsPlaylist.includes(track.id));
        return newSearchResults;
    }

    search(searchTerm) {
      Spotify.search(searchTerm)
        .then(searchResults => {
            this.setState({
                searchResults : this.differencePlaylist(searchResults)
            });
        });
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

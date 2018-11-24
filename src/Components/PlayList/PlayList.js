import React from 'react';
import './PlayList.css';
//Import needed components
import TrackList from '../TrackList/TrackList';

class PlayList extends React.Component {
    constructor(props) {
        super(props);

        this.handleNameChange = this.handleNameChange.bind(this);
    }

    handleNameChange(e) {
        const newName = e.target.value;
        this.props.onNameChange(newName);
    }

    render() {
        return (
            <div className="Playlist">
              <input defaultValue={'New Playlist'} onChange = {this.handleNameChange}/>
              <TrackList
                  tracks    = {this.props.playlistTracks}
                  onRemove  = {this.props.onRemove}
                  isRemoval = {true}
              />
              <a className="Playlist-save" onClick={this.props.onSave}>SAVE TO SPOTIFY</a>
            </div>
        );
    }
}

export default PlayList;

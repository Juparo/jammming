import React from 'react';
import './SearchBar.css';

class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        //Load the search term from the local storage as default value
        this.state = {
            searchTerm : localStorage.getItem('lastSearchTerm')
        };
        this.search           = this.search.bind(this);
        this.handleTermChange = this.handleTermChange.bind(this);
    }

    search() {
        this.props.onSearch(this.state.searchTerm);
    }

    handleTermChange(e) {
        const searchTerm = e.target.value;
        this.setState({
            searchTerm : searchTerm
        }, () => {
            //Keep it in local storage
            localStorage.setItem('lastSearchTerm',searchTerm);
        });
    }

    render() {
        return (
            <div className="SearchBar">
              <input
                  onChange    = {this.handleTermChange}
                  placeholder = "Enter A Song, Album, or Artist"
                  value       = {this.state.searchTerm}
              />
              <a onClick={this.search}>SEARCH</a>
            </div>
        );
    }
}

export default SearchBar;
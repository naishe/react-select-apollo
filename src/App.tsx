import React, { useState } from "react";
import "./App.css";
import AsyncSelect from "react-select/async";
import ApolloClient, { gql } from "apollo-boost";

const client = new ApolloClient({
  uri: "https://metaphysics-production.artsy.net"
});

const fetchArtists = async (input: string, cb: any) => {
  if (input && input.trim().length < 4) {
    return [];
  }
  const res = await client.query({
    query: gql`
      query {
        match_artist(term: "${input}") {
          name
          imageUrl
        }
      }
    `
  });

  if (res.data && res.data.match_artist) {
    return res.data.match_artist.map(
      (a: { name: string; imageUrl: string }) => ({
        label: a.name,
        value: a.imageUrl
      })
    );
  }

  return [];
};

const App: React.FC = () => {
  const [artist, setArtist] = useState({
    label: "No Name",
    value: "https://dummyimage.com/200x200/000/fff&text=No+Artist"
  });
  return (
    <div className="App">
      <header className="App-header">
        <h4>Search artists and their image (type 4 char or more)</h4>
        <AsyncSelect
          loadOptions={fetchArtists}
          onChange={(opt: any) => setArtist(opt)}
          placeholder="Search an Artist"
          className="select"
        />
        <div>
          <img alt={artist.label} src={artist.value} className="aimage" />
        </div>
      </header>
    </div>
  );
};

export default App;

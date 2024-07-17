import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './LastfmStats.css';
import Navigation from "./Navigation";

const LastfmStats = () => {
    const [stats, setStats] = useState(null);
    const [albumCovers, setAlbumCovers] = useState({});
    const [lastUpdated, setLastUpdated] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const api_key =  process.env.REACT_APP_LASTFM_API_KEY;
                const periods = ['3month', '6month', '12month'];
                const statsData = {};
                const albumCoversData = {};
                const usedCovers = new Set();
                let i = 0;
                for (const period of periods) {
                    const response = await axios.get('https://ws.audioscrobbler.com/2.0/', {
                        params: {
                            method: 'user.getTopArtists',
                            user: 'ali_khat',
                            api_key: api_key,
                            format: 'json',
                            limit: 10,
                            period: period,
                        },
                    });

                    statsData[period] = response.data.topartists.artist;

                    let albumCover = null;
                    let albumName = '';
                    while (!albumCover ) {
                        const artist = statsData[period][0];
                        const albumResponse = await axios.get('https://ws.audioscrobbler.com/2.0/', {
                            params: {
                                method: 'artist.getTopAlbums',
                                artist: artist.name,
                                api_key: api_key,
                                format: 'json',
                                limit: 10,
                            },
                        });

                        const album = albumResponse.data.topalbums.album[i];
                        i = i +1;
                        albumCover = album.image.find((image) => image.size === 'large')['#text'];
                        albumName = `${artist.name} - ${album.name}`;
                    }

                    albumCoversData[period] = { cover: albumCover, name: albumName };
                    usedCovers.add(albumCover);
                }

                setStats(statsData);
                setAlbumCovers(albumCoversData);
                setLastUpdated(new Date().toLocaleString('en-US', { timeZone: 'UTC', timeZoneName: 'short' }));
            } catch (error) {
                console.error('Error fetching Last.fm stats:', error);
            }
        };

        fetchStats();
    }, []);

    return (
        <>
            <Navigation />
            <div className="lastfm-stats">
                <h2>Top Plays in the Last:</h2>
                {stats ? (
                    <>
                        <div className="stats-container">
                            {['3month', '6month', '12month'].map((period) => (
                                <div key={period} className="stats-section">
                                    <h3>{period === '3month' ? '3 Months' : period === '6month' ? '6 Months' : '12 Months'}</h3>
                                    <div className="stats-content">
                                        <div className="album-cover">
                                            <img src={albumCovers[period].cover} alt="Random Album Cover" />
                                            <div className="album-name">{albumCovers[period].name}</div>
                                        </div>
                                        <ul>
                                            {stats[period].map((artist, index) => (
                                                <li key={artist.name}>
                                                    {index + 1}. {artist.name} - {artist.playcount} plays
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p className="last-updated">Last updated: {lastUpdated}</p>
                    </>
                ) : (
                    <p>Loading...</p>
                )}
            </div>
        </>
    );
};

export default LastfmStats;

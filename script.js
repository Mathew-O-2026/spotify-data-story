Promise.all([
  fetch("data/Streaming_History_Audio_2022-2024_0.json").then(res => res.json()),
  fetch("data/Streaming_History_Audio_2025_4.json").then(res => res.json())
])
.then(([data1, data2]) => {
  const combinedData = [...data1, ...data2]; // Merge arrays

  // Aggregate data: Sum ms_played per artist
  const artistPlayTime = {};
  combinedData.forEach(entry => {
    const artist = entry.master_metadata_album_artist_name;
    const ms = entry.ms_played || 0;
    if (artist) {
      artistPlayTime[artist] = (artistPlayTime[artist] || 0) + ms;
    }
  });

  // Convert to minutes and sort top 10
  const sortedArtists = Object.entries(artistPlayTime)
    .map(([artist, ms]) => ({ artist, minutes: Math.round(ms / 60000) })) // ms to minutes
    .sort((a, b) => b.minutes - a.minutes)
    .slice(0, 10); // Top 10

  // Prepare data for Chart.js
  const labels = sortedArtists.map(item => item.artist);
  const data = sortedArtists.map(item => item.minutes);

  // Create bar chart
  const ctx = document.getElementById('myChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Listening Time (minutes)',
        data: data,
        backgroundColor: 'rgba(29, 185, 84, 0.6)', // Spotify green
        borderColor: 'rgba(29, 185, 84, 1)',
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });

  // Now, group by year
  const yearData = {};
  combinedData.forEach(entry => {
    const year = new Date(entry.ts).getFullYear();
    if (!yearData[year]) {
      yearData[year] = { artistPlayTime: {}, songPlayTime: {} };
    }
    const artist = entry.master_metadata_album_artist_name;
    const song = entry.master_metadata_track_name;
    const ms = entry.ms_played || 0;
    if (artist) {
      yearData[year].artistPlayTime[artist] = (yearData[year].artistPlayTime[artist] || 0) + ms;
    }
    if (song) {
      if (!yearData[year].songPlayTime[song]) {
        yearData[year].songPlayTime[song] = { ms: 0, uri: entry.spotify_track_uri };
      }
      yearData[year].songPlayTime[song].ms += ms;
    }
  });

  // For each year, create top 10 artist chart
  Object.keys(yearData).forEach(year => {
    const sortedArtistsYear = Object.entries(yearData[year].artistPlayTime)
      .map(([artist, ms]) => ({ artist, minutes: Math.round(ms / 60000) }))
      .sort((a, b) => b.minutes - a.minutes)
      .slice(0, 10);

    const labelsYear = sortedArtistsYear.map(item => item.artist);
    const dataYear = sortedArtistsYear.map(item => item.minutes);

    const ctxYear = document.getElementById(`chart${year}`).getContext('2d');
    new Chart(ctxYear, {
      type: 'bar',
      data: {
        labels: labelsYear,
        datasets: [{
          label: `Listening Time (minutes) - ${year}`,
          data: dataYear,
          backgroundColor: 'rgba(29, 185, 84, 0.6)',
          borderColor: 'rgba(29, 185, 84, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    // Top 10 songs for the year
    const sortedSongsYear = Object.entries(yearData[year].songPlayTime)
      .map(([song, obj]) => ({ song, minutes: Math.round(obj.ms / 60000), uri: obj.uri }))
      .sort((a, b) => b.minutes - a.minutes)
      .slice(0, 10);

    const labelsSongYear = sortedSongsYear.map(item => item.song);
    const dataSongYear = sortedSongsYear.map(item => item.minutes);

    const ctxSongYear = document.getElementById(`songChart${year}`).getContext('2d');
    new Chart(ctxSongYear, {
      type: 'bar',
      data: {
        labels: labelsSongYear,
        datasets: [{
          label: `Listening Time (minutes) - ${year}`,
          data: dataSongYear,
          backgroundColor: 'rgba(255, 87, 51, 0.6)', // Different color for songs
          borderColor: 'rgba(255, 87, 51, 1)',
          borderWidth: 1
        }]
      },
      options: {
        onClick: function(event, elements) {
          if (elements.length > 0) {
            const index = elements[0].index;
            const uri = sortedSongsYear[index].uri;
            if (uri) {
              const trackId = uri.split(':')[2];
              window.open(`https://open.spotify.com/track/${trackId}`, '_blank');
            }
          }
        },
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  });
})
.catch(err => console.error('Error loading data:', err));
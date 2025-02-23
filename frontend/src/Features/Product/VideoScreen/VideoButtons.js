import React from "react";
import { Link } from "react-router-dom";
import { sourceAdapter } from "../../../utils";
import movieTrailer from "movie-trailer";

// export const findTrailer = (movie) =>
//   movieTrailer(movie.name)
//     .then((url) => {
//       const urlParams = new URLSearchParams(new URL(url).search);
//       return urlParams.get("v");
//     })
//     .catch((e) => "no trailer");

export function VideoButtons({
  movie = sourceAdapter([1])[0],
  trailerUrl,
  setTrailerUrl,
}) {
  const searchTrailer = async () => {
    if (trailerUrl) return setTrailerUrl("");
    movieTrailer(movie.name)
      .then((url) => {
        const urlParams = new URLSearchParams(new URL(url).search);
        setTrailerUrl(urlParams.get("v"));
      })
      .catch((e) => setTrailerUrl(-1));
  };
  return (
    <>
      {trailerUrl ? (
        <button className="banner__button" onClick={() => setTrailerUrl("")}>
          <i className="fa fa-stop"></i> Close
        </button>
      ) : movie.video ? (
        <button
          className="banner__button"
          disabled={movie.video === "no trailer"}
          onClick={() => setTrailerUrl(movie.video)}
        >
          <i className="fa fa-play"></i> Trailer
        </button>
      ) : (
        <button
          className="banner__button"
          onClick={() => {
            searchTrailer();
          }}
        >
          <i className="fa fa-search"></i> Trailer
        </button>
      )}

      <Link
        disabled={!movie.seller}
        //is there any seller sells this movie
        to={movie.seller ? `/cart/${movie._id}?qty=1` : `#`}
      >
        <button className="banner__button" disabled={!movie.seller}>
          <i className="fa fa-shopping-cart"></i> Buy[Rent]
        </button>
      </Link>
    </>
  );
}

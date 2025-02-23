import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import LoadingBox from "../../../components/LoadingBox";
import MessageBox from "../../../components/MessageBox";
import { listProducts } from "../../../Controllers/productActions";
import { dummyMovies, NO_MOVIES, sourceAdapter } from "../../../utils";
import VideoBanner, { VideoBannerBottom } from "./VideoBanner";
import VideoRow from "./VideoRow";
import "./videoScreen.css";

const API_KEY = process.env.REACT_APP_API_KEY;
const sources = {
  "NETFLUX ORIGINALS": `/discover/tv?api_key=${API_KEY}&with_networks=213`,

  "Action Movies": `/discover/movie?api_key=${API_KEY}&with_genres=28`,
  "Comedy Movies": `/discover/movie?api_key=${API_KEY}&with_genres=35`,
  "Horror Movies": `/discover/movie?api_key=${API_KEY}&with_genres=27`,
  "Romance Movies": `/discover/movie?api_key=${API_KEY}&with_genres=10749`,
  Documentaries: `/discover/movie?api_key=${API_KEY}&with_genres=99`,
  "Trending Now": `/trending/all/week?api_key=${API_KEY}&language=en-US`,
  "Top Rated": `/movie/top_rated?api_key=${API_KEY}&language=en-US`,
};
const navLabels = Object.keys(sources);
navLabels.splice(1, 0, "Home", "STORE");

export default function VideoScreen() {
  const dispatch = useDispatch();
  const [genre, setGenre] = useState("STORE");
  const [movies, setMovies] = useState({ STORE: [] });
  const [externMovies, setExternMovies] = useState({});
  const [storeMovies, setStoreMovies] = useState();
  const {
    loading: loadingProducts,
    error: errorProducts,
    success: successProducts,
    products,
  } = useSelector((state) => state.productList);

  useEffect(() => {
    let isMounted = true;
    dispatch(
      listProducts({
        seller: process.env.REACT_APP_SELLER,
        category: "Video",
        pageSize: 11,
        order: "oldest",
      })
    );

    (async function fetchData() {
      const promiseReturns = await Promise.all(
        Object.keys(sources).map(async (genre) => {
          const { data } = await axios
            .get("https://api.themoviedb.org/3" + sources[genre])
            .catch((e) => {});
          return [[genre], data.results];
        })
      );
      if (!isMounted) return;
      const movieObj = {};
      promiseReturns.map(
        ([genre, list]) => (movieObj[genre] = sourceAdapter(list))
      );
      setExternMovies(movieObj);
    })();
    return () => (isMounted = false); // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setStoreMovies(products);
  }, [successProducts, products]);

  useEffect(() => {
    setMovies({ ...externMovies, STORE: storeMovies });
  }, [externMovies, storeMovies]);

  return (
    <div className="container--full video-screen">
      <header className="m-header">
        <ul className="m-nav">
          {navLabels.map((label, id) => (
            <li
              key={id}
              className={label === genre ? " active" : ""}
              onClick={() => setGenre(label)}
            >
              {label.split(" ")[0]}
            </li>
          ))}
        </ul>
      </header>
      <VideoBanner source={!successProducts ? NO_MOVIES : movies[genre]} />
      {externMovies &&
        Object.keys(sources).map(
          (label, id) =>
            (label === genre || genre === "Home") && (
              <VideoRow
                key={id}
                title={label}
                movies={movies[label]}
                portrait={label === "NETFLUX ORIGINALS"}
              />
            )
        )}
      {loadingProducts ? (
        <LoadingBox xl />
      ) : errorProducts ? (
        <MessageBox variant="danger">{errorProducts}</MessageBox>
      ) : (
        <>
          {products.length === 0 && (
            <MessageBox>
              No Product Found Or All Movies In Stock Are Sold Out
            </MessageBox>
          )}
          <VideoRow
            title="IN STOCK: READY TO BUY"
            movies={loadingProducts ? dummyMovies : storeMovies}
            //if Netflux is genre, only one portrait row
            portrait={genre !== "NETFLUX ORIGINALS"}
          />
        </>
      )}
      {
        externMovies["Trending Now"] && genre !== "Trending Now" && (
          <VideoRow
            title="Trending Now"
            movies={externMovies["Trending Now"]}
          />
        ) /* no duplicated Trending Now*/
      }
      {externMovies["Top Rated"] && genre !== "Top Rated" && (
        <VideoRow title="Top Rated" movies={externMovies["Top Rated"]} />
      )}
      <div className="banner__divider"></div>
      <VideoBannerBottom
        source={!successProducts ? NO_MOVIES : movies[genre]}
      />
      />
    </div>
  );
}

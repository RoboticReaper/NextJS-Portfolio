"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import type { ClashPlayer, Song } from "@/lib/integrations";
function useConnection<T>(url: string) {
  const [state, setState] = useState<{
    data: T | null;
    error: string | null;
    loading: boolean;
  }>({ data: null, error: null, loading: true });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const response = await fetch(url, {
          signal: AbortSignal.any([
            controller.signal,
            AbortSignal.timeout(20000),
          ]),
        });
        const data = await response.json();
        if (!response.ok)
          throw new Error(data.error || "Temporarily unavailable");
        setState({ data, error: null, loading: false });
      } catch (error) {
        if (!controller.signal.aborted)
          setState({
            data: null,
            error:
              error instanceof Error && error.name === "Error"
                ? error.message
                : "Temporarily unavailable",
            loading: false,
          });
      }
    }
    load();
    return () => controller.abort();
  }, [url, attempt]);
  return {
    ...state,
    retry: () => {
      setState({ data: null, error: null, loading: true });
      setAttempt((a) => a + 1);
    },
  };
}
function ConnectionState({
  loading,
  error,
  retry,
}: {
  loading: boolean;
  error: string | null;
  retry: () => void;
}) {
  return loading ? (
    <div className="connection-loading" role="status">
      <span className="skeleton-line" />
      <span className="skeleton-line short" />
      <span>Connecting…</span>
    </div>
  ) : error ? (
    <div className="connection-error" role="status">
      <p>{error}</p>
      <button className="text-button" onClick={retry}>
        Try again <span aria-hidden="true">↻</span>
      </button>
    </div>
  ) : null;
}
export function LiveInterests({ trackLimit }: { trackLimit?: number } = {}) {
  const preview = trackLimit !== undefined;
  const clash = useConnection<ClashPlayer>("/api/coc");
  const spotify = useConnection<{ rows: Song[] }>("/api/spotify");
  useEffect(() => {
    // The initial anchor jump can be clamped before the async song list expands.
    if (!preview && !spotify.loading && window.location.hash === "#music")
      document.getElementById("music")?.scrollIntoView({ block: "start", behavior: "instant" });
  }, [preview, spotify.loading]);
  return (
    <div className="interests-grid">
      <section className="interest-card" aria-label="Clash of Clans">
        <div className="interest-heading">
          <img src="/cocIcon.jpg" alt="" width={44} height={44} />
          <div>
            <p className="eyebrow">Outside the editor</p>
            <h3>Clash of Clans</h3>
          </div>
          <span className="live-label">Live</span>
        </div>
        <ConnectionState {...clash} />
        {clash.data && (
          <>
            <p className="player-name">{clash.data.name}</p>
            <div className="player-stats">
              <div>
                <strong>{clash.data.townHallLevel}</strong>
                <span>Town Hall</span>
              </div>
              <div>
                <strong>{clash.data.trophies.toLocaleString("en-US")}</strong>
                <span>Trophies</span>
              </div>
              <div>
                <strong className="league-label">
                  {clash.data.league.name}
                </strong>
                <span>League</span>
              </div>
            </div>
          </>
        )}
      </section>
      <section className={`interest-card music-card${preview ? " music-preview" : ""}`} id={preview ? undefined : "music"} aria-label="On repeat">
        <div className="interest-heading">
          <div className="music-mark" aria-hidden="true">
            ♫
          </div>
          <div>
            <p className="eyebrow">The coding soundtrack</p>
            <h3>{preview ? <Link className="music-card-link" href="/about#music" aria-label="View all top songs">On repeat</Link> : "On repeat"}</h3>
          </div>
          <div className="equalizer" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
          </div>
        </div>
        <p className="interest-note">My top tracks over the last four weeks.</p>
        <ConnectionState {...spotify} />
        {spotify.data &&
          (spotify.data.rows.length ? (
            <ol className="track-list">
              {spotify.data.rows.slice(0, trackLimit).map((song, i) => (
                <li key={`${song.link}-${i}`}>
                  <span className="track-index">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {song.image ? (
                    <img
                      src={song.image}
                      alt={`Album cover for ${song.name}`}
                      width={42}
                      height={42}
                      loading="lazy"
                    />
                  ) : (
                    <span className="track-placeholder" aria-hidden="true">
                      ♪
                    </span>
                  )}
                  {preview ? (
                    <span className="track-info">
                      <strong>{song.name}</strong>
                      <span>{song.artist}</span>
                    </span>
                  ) : (
                    <a className="track-info" href={song.link} target="_blank" rel="noopener noreferrer">
                      <strong>{song.name}</strong>
                      <span>{song.artist}</span>
                    </a>
                  )}
                </li>
              ))}
            </ol>
          ) : (
            <p className="interest-note">
              No top tracks yet. The next soundtrack is still taking shape.
            </p>
          ))}
      </section>
    </div>
  );
}

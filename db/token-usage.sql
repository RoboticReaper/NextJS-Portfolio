-- Additive: existing project tables are left intact. Counts preserve source rounding.
CREATE TABLE IF NOT EXISTS portfolio_codex_usage (
  username text NOT NULL,
  usage_date date NOT NULL,
  tokens_display text NOT NULL,
  tokens_approx bigint NOT NULL CHECK (tokens_approx BETWEEN 0 AND 9007199254740991),
  source_level smallint CHECK (source_level BETWEEN 0 AND 4),
  status text NOT NULL CHECK (status IN ('recorded', 'provisional')),
  collected_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (username, usage_date)
);

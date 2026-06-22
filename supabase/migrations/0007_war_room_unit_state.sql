-- Synced per-unit combat state for war rooms.
-- Each player owns their rows; both players in the room can read all rows.
-- This replaces the local-only ephemeral UnitState with a shared table so
-- wounds, toggles, and modifiers are visible to both players in real time.

CREATE TABLE IF NOT EXISTS war_room_unit_state (
  room_id       UUID        NOT NULL REFERENCES war_rooms(id) ON DELETE CASCADE,
  owner_id      UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  unit_id       TEXT        NOT NULL,
  wounds        INTEGER     NOT NULL DEFAULT 0,
  destroyed     BOOLEAN     NOT NULL DEFAULT FALSE,
  summoned      BOOLEAN     NOT NULL DEFAULT FALSE,
  charged       BOOLEAN     NOT NULL DEFAULT FALSE,
  hit_modifier  SMALLINT    NOT NULL DEFAULT 0,
  save_modifier SMALLINT    NOT NULL DEFAULT 0,
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (room_id, owner_id, unit_id)
);

ALTER TABLE war_room_unit_state ENABLE ROW LEVEL SECURITY;

-- Both players in the same war room can read all unit state rows.
CREATE POLICY "room_participants_read_unit_state"
  ON war_room_unit_state FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM war_rooms wr
      WHERE wr.id = room_id
        AND (wr.player1_id = auth.uid() OR wr.player2_id = auth.uid())
    )
  );

-- Each player can only insert/update/delete their own rows.
CREATE POLICY "room_owner_write_unit_state"
  ON war_room_unit_state FOR ALL
  USING  (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

-- Full replica identity so realtime delivers the complete row on every change.
ALTER TABLE war_room_unit_state REPLICA IDENTITY FULL;

UPDATE reviews r
SET content = regexp_replace(
  regexp_replace(r.content, tm.name, '{name}', 'gi'),
  split_part(tm.name, ' ', 1), '{firstName}', 'gi'
)
FROM team_members tm
WHERE r.member_id = tm.id
  AND r.scope = 'member';

-- Also replace common hardcoded names that don't match current member name
UPDATE reviews SET content = regexp_replace(content, 'Sophia Marlowe', '{name}', 'gi') WHERE scope = 'member';
UPDATE reviews SET content = regexp_replace(content, 'Sophia', '{firstName}', 'gi') WHERE scope = 'member';
UPDATE reviews SET content = regexp_replace(content, 'Adrian Cole', '{name}', 'gi') WHERE scope = 'member';
UPDATE reviews SET content = regexp_replace(content, 'Adrian', '{firstName}', 'gi') WHERE scope = 'member';
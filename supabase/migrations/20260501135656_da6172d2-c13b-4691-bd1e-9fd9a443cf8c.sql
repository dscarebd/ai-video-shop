UPDATE faqs f
SET question = regexp_replace(regexp_replace(f.question, tm.name, '{name}', 'gi'), split_part(tm.name,' ',1), '{firstName}', 'gi'),
    answer = regexp_replace(regexp_replace(f.answer, tm.name, '{name}', 'gi'), split_part(tm.name,' ',1), '{firstName}', 'gi')
FROM team_members tm
WHERE f.scope = 'member' AND f.member_id = tm.id;